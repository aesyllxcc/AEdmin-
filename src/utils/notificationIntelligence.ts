import { Task, ApprovalItem, Client, UserProfile } from '../types';
import { getClientLiveTime, cleanTimezone, parseTimeToMinutes, getFreelancerLiveTimeInfo } from './timezoneUtils';

export interface ActionableNotification {
  id: string;
  category: 'decision_approval' | 'risk_escalation' | 'deadline_action' | 'blocker_opportunity';
  title: string;
  description: string;
  source: string;
  sourceType: 'task' | 'approval' | 'client' | 'schedule';
  urgency: 'critical' | 'high' | 'medium';
  actionLabel: string;
  actionUrl: string;
  badgeText: string;
  badgeColor: string;
  timeContext?: string;
  clientId?: string;
}

export function generateActionableNotifications(
  tasks: Task[],
  approvals: ApprovalItem[],
  clients: Client[],
  userProfile: UserProfile,
  now: Date = new Date()
): ActionableNotification[] {
  const notifications: ActionableNotification[] = [];
  const todayStr = now.toISOString().split('T')[0];
  const freelancerTz = cleanTimezone(userProfile.timezone || userProfile.defaultTimezone || 'America/New_York');
  const freelancerLive = getFreelancerLiveTimeInfo(userProfile, now);

  // 1. DECISIONS & APPROVALS (Items that require immediate sign-off or authorization to unblock client work)
  approvals.forEach(approval => {
    if (approval.status === 'pending') {
      notifications.push({
        id: `approval-${approval.id}`,
        category: 'decision_approval',
        title: `Approval Required: ${approval.title}`,
        description: `${approval.clientName} has pending deliverables waiting for authorization (${approval.type.replace('_', ' ')}).`,
        source: approval.clientName,
        sourceType: 'approval',
        urgency: 'high',
        actionLabel: 'Review & Approve',
        actionUrl: '/approvals',
        badgeText: 'Pending Sign-off',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        timeContext: approval.dueDate ? `Target: ${approval.dueDate}` : undefined,
        clientId: approval.clientId
      });
    }
  });

  // 2. RISKS & ESCALATIONS (Overdue tasks, Retainer budget caps, SLA breaches)
  tasks.forEach(task => {
    if (!task.isArchived && task.status !== 'completed') {
      if (task.dueDate && task.dueDate < todayStr) {
        notifications.push({
          id: `task-overdue-${task.id}`,
          category: 'risk_escalation',
          title: `Overdue Deliverable: ${task.title}`,
          description: `Commitment for ${task.clientName || 'Studio'} was scheduled for ${task.dueDate}. Action needed to avoid SLA breach.`,
          source: task.clientName || 'General',
          sourceType: 'task',
          urgency: 'critical',
          actionLabel: 'Resolve or Reschedule',
          actionUrl: '/operations',
          badgeText: 'Overdue SLA',
          badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
          timeContext: `Due: ${task.dueDate}`,
          clientId: task.clientId
        });
      }
    }
  });

  // Retainer Consumption Risks (Over 85% or 100%)
  clients.forEach(client => {
    if (client.status === 'active' && client.purchasedHours > 0) {
      const used = client.usedHoursThisMonth || 0;
      const ratio = used / client.purchasedHours;
      if (ratio >= 1.0) {
        notifications.push({
          id: `retainer-exceeded-${client.id}`,
          category: 'risk_escalation',
          title: `Retainer Exceeded (100%+): ${client.name}`,
          description: `Client consumed ${used}h of ${client.purchasedHours}h allocated. Scope adjustment or top-up invoice required before additional work.`,
          source: client.name,
          sourceType: 'client',
          urgency: 'critical',
          actionLabel: 'Review Retainer & Invoice',
          actionUrl: `/clients/${client.id}`,
          badgeText: 'Retainer Exceeded',
          badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
          timeContext: `${Math.round(ratio * 100)}% consumed`,
          clientId: client.id
        });
      } else if (ratio >= 0.85) {
        notifications.push({
          id: `retainer-warning-${client.id}`,
          category: 'risk_escalation',
          title: `Retainer Risk Warning (85%+): ${client.name}`,
          description: `${used}h of ${client.purchasedHours}h consumed (${Math.round(ratio * 100)}%). Alert client to approve top-up retainer block.`,
          source: client.name,
          sourceType: 'client',
          urgency: 'high',
          actionLabel: 'Send Retainer Notice',
          actionUrl: `/clients/${client.id}`,
          badgeText: 'Approaching Cap',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          timeContext: `${(client.purchasedHours - used).toFixed(1)}h remaining`,
          clientId: client.id
        });
      }
    }
  });

  // 3. DEADLINES & SHIFT COMMITMENTS (Due today or due within working shift)
  tasks.forEach(task => {
    if (!task.isArchived && task.status !== 'completed' && task.dueDate === todayStr) {
      notifications.push({
        id: `task-today-${task.id}`,
        category: 'deadline_action',
        title: `Due Today: ${task.title}`,
        description: `Deliverable milestone for ${task.clientName || 'Internal'}. Complete before end-of-shift (${freelancerLive.endOfShiftLabel}).`,
        source: task.clientName || 'General',
        sourceType: 'task',
        urgency: task.priority === 'urgent' ? 'critical' : 'high',
        actionLabel: 'Execute Task',
        actionUrl: '/workday',
        badgeText: 'Due End-of-Shift',
        badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
        timeContext: `Today`,
        clientId: task.clientId
      });
    }
  });

  // 4. BLOCKERS & PRIME OPPORTUNITIES (Client in prime timezone communication window with pending items)
  clients.forEach(client => {
    if (client.status === 'active') {
      const live = getClientLiveTime(client, now, freelancerTz);
      const pendingClientTasks = tasks.filter(t => t.clientId === client.id && t.status !== 'completed');
      
      if (live.status === 'preferred_comms' && pendingClientTasks.length > 0) {
        notifications.push({
          id: `prime-comms-opp-${client.id}`,
          category: 'blocker_opportunity',
          title: `Prime Communication Window: ${client.name}`,
          description: `${client.primaryContact || client.name} is online in ${live.effectiveCity} (${live.timeStr}). Ideal time to unblock deliverables or get feedback.`,
          source: client.name,
          sourceType: 'client',
          urgency: 'medium',
          actionLabel: 'Open Global Dispatch',
          actionUrl: '/global-operations',
          badgeText: 'Prime Response Window',
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          timeContext: live.preferredCommsLabel,
          clientId: client.id
        });
      }
    }
  });

  // Sort: Critical first, then High, then Medium
  const urgencyWeight = { critical: 3, high: 2, medium: 1 };
  return notifications.sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency]);
}
