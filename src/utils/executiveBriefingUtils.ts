import { 
  Client, 
  Task, 
  ApprovalItem, 
  Project, 
  Invoice, 
  UserProfile, 
  ExecutiveBriefingSnapshot, 
  ExecutiveBriefingSection 
} from '@/types';

export const DEFAULT_BRIEFING_SECTIONS: ExecutiveBriefingSection[] = [
  { id: 'today', title: 'Today', customTitle: 'Today’s Summary', enabled: true, order: 0, description: 'A concise summary of the most important items requiring awareness.' },
  { id: 'important', title: 'Important Today', customTitle: 'Important Today', enabled: true, order: 1, description: 'Critical deadlines, priorities, and high-impact items.' },
  { id: 'attention', title: 'Your Attention', customTitle: 'Your Attention Required', enabled: true, order: 2, description: 'Decisions, approvals, risks, blockers, and items needing client input.' },
  { id: 'schedule', title: 'Schedule', customTitle: 'Today’s Schedule & Commitments', enabled: true, order: 3, description: 'Upcoming meetings, appointments, and calendar commitments (Business & Personal).' },
  { id: 'work', title: 'Work', customTitle: 'Active Work & Deliverables', enabled: true, order: 4, description: 'Active projects, progress updates, milestones, and operational activities.' },
  { id: 'personal', title: 'Personal', customTitle: 'Personal & Lifestyle Reminders', enabled: true, order: 5, description: 'Personal reminders, important dates, travel details, or lifestyle-related info.' },
  { id: 'handled', title: 'Handled By Your EA', customTitle: 'Handled By Your EA', enabled: true, order: 6, description: 'Completed actions, resolved issues, delegated tasks, and administrative work.' },
  { id: 'upcoming', title: 'Upcoming', customTitle: 'Upcoming Horizon', enabled: true, order: 7, description: 'Future deadlines, projects, renewals, and planned activities.' },
  { id: 'ea_note', title: 'EA Note', customTitle: 'Strategic Note from Your EA', enabled: true, order: 8, description: 'Personalized summary, recommendations, observations, and strategic guidance.' },
  { id: 'onboarding', title: 'Onboarding Checklist', customTitle: 'Onboarding Progress & Checklist', enabled: true, order: 9, description: 'Visual display of onboarding progress and outstanding onboarding requirements.' },
  { id: 'retainer', title: 'Retainer Overview', customTitle: 'Retainer Allocation & Hours', enabled: true, order: 10, description: 'Monthly retainer information, consumed hours, remaining hours, and trends.' },
  { id: 'billing', title: 'Invoices & Payments', customTitle: 'Invoices & Payment History', enabled: true, order: 11, description: 'Invoices, payment history, transaction ledger, and payment status.' },
];

export function generateInitialDraftBriefing(
  client: Client,
  tasks: Task[] = [],
  approvals: ApprovalItem[] = [],
  projects: Project[] = [],
  invoices: Invoice[] = [],
  userProfile?: UserProfile
): ExecutiveBriefingSnapshot {
  const clientApprovals = approvals.filter(a => a.clientId === client.id);
  const pendingApprovals = clientApprovals.filter(a => a.status === 'pending');
  const clientTasks = tasks.filter(t => t.clientId === client.id && !t.isArchived);
  const clientProjects = projects.filter(p => p.clientId === client.id);

  const firstName = client.primaryContact.split(' ')[0] || 'Executive';
  const eaName = userProfile?.fullName || 'Your Executive Partner';

  return {
    id: `brief-${client.id}-${Date.now()}`,
    clientId: client.id,
    updatedAt: new Date().toISOString(),
    isPublished: false,
    perspective: 'today',
    eaGreeting: `Good morning, ${firstName}. Here’s what matters today.`,
    eaNote: `All calendar briefings for today's investor meetings have been updated in your Google Drive. I will monitor inbox escalations while you are in your strategy block. Let me know if you need any adjustments before your 2 PM call.`,
    accountStatusText: pendingApprovals.length > 0 ? 'Decisions Required • Operations Running Smoothly' : 'All Systems Green • On Track',
    accountStatusType: pendingApprovals.length > 0 ? 'attention' : 'optimal',
    sections: DEFAULT_BRIEFING_SECTIONS.map(s => ({ ...s })),

    // Section 1: Today Summary
    todaySummary: `High-focus operational day. You have 3 critical meetings scheduled, ${pendingApprovals.length > 0 ? `${pendingApprovals.length} sign-off awaiting review` : 'all workflows unblocked'}, and your upcoming flight to Tokyo is confirmed.`,
    todayItems: [
      { id: 'ti-1', time: '09:00 AM', title: 'LP Quarterly Strategy Review', category: 'Meeting', detail: 'Prep notes synced in Google Drive folder', isPriority: true },
      { id: 'ti-2', time: '11:30 AM', title: 'Product Architecture Check-in', category: 'Deliverable', detail: 'Review milestone progress before call', isPriority: false },
      { id: 'ti-3', time: '02:00 PM', title: 'Tax & Corporate Legal Advisory', category: 'Executive Call', detail: 'EA attending to capture actionable minutes', isPriority: true }
    ],

    // Section 2: Your Attention
    attentionItems: pendingApprovals.length > 0 
      ? pendingApprovals.map(a => ({
          id: a.id,
          title: a.title,
          type: 'approval' as const,
          deadline: a.dueDate || 'Today, 5:00 PM',
          impact: a.context || a.comments || 'Needed to advance sprint deliverables',
          status: 'pending' as const
        }))
      : [
          {
            id: 'att-1',
            title: 'Q3 Retainer Renewal & Scope Allocation',
            type: 'decision' as const,
            deadline: 'End of week',
            impact: 'Lock in specialized DevOps support for the upcoming launch',
            status: 'pending' as const
          }
        ],

    // Section 3: Schedule (Including Business & Personal Lifestyle Timed Commitments)
    scheduleItems: [
      { 
        id: 'sc-0', 
        time: '07:30 AM - 08:30 AM', 
        title: 'Morning Wellness & Training Session', 
        location: 'Equinox Club', 
        prepNote: 'Trainer confirmed; locker reserved',
        isPersonal: true,
        commitmentType: 'personal'
      },
      { 
        id: 'sc-1', 
        time: '09:00 AM - 10:00 AM', 
        title: 'LP & Investor Strategy Sync', 
        location: 'Zoom • Link in Invite', 
        prepNote: 'Briefing deck v2.4 in Drive',
        isPersonal: false,
        commitmentType: 'business'
      },
      { 
        id: 'sc-2', 
        time: '11:30 AM - 12:15 PM', 
        title: 'Executive Engineering & Product Review', 
        location: 'Google Meet', 
        prepNote: 'Review slides 3-6 beforehand',
        isPersonal: false,
        commitmentType: 'business'
      },
      { 
        id: 'sc-2b', 
        time: '01:00 PM - 01:45 PM', 
        title: 'Dermatology & Health Check-in', 
        location: 'Park Avenue Medical Plaza', 
        prepNote: 'Driver confirmed; reception alerted',
        isPersonal: true,
        commitmentType: 'personal'
      },
      { 
        id: 'sc-3', 
        time: '02:00 PM - 03:00 PM', 
        title: 'Cross-Border Corporate Advisory', 
        location: 'Private Conference Line', 
        prepNote: 'EA in background capturing action points',
        isPersonal: false,
        commitmentType: 'business'
      },
      { 
        id: 'sc-4', 
        time: '07:30 PM - 09:30 PM', 
        title: 'Dinner Reservation: Nobu 57', 
        location: 'Upper East Side', 
        prepNote: 'Table confirmed under executive name; dietary preferences noted',
        isPersonal: true,
        commitmentType: 'personal'
      }
    ],

    // Section 4: Important Today
    importantItems: [
      { id: 'imp-1', title: 'Board Governance Packet Due by 5:00 PM', detail: 'Final review required before distribution to board members.', impact: 'high', category: 'Governance' },
      { id: 'imp-2', title: 'Tokyo Flight Check-in Complete (SQ 012)', detail: 'Chauffeur pickup scheduled for 07:45 AM tomorrow morning.', impact: 'medium', category: 'Travel' },
      { id: 'imp-3', title: 'Courier Delivery Confirmed', detail: 'Executed real estate documents received at primary residence.', impact: 'info', category: 'Logistics' }
    ],

    // Section 5: Work
    workItems: clientProjects.length > 0 
      ? clientProjects.slice(0, 3).map(p => ({
          id: p.id,
          title: p.name,
          category: 'Strategic Project',
          status: p.status === 'in_progress' ? 'In Progress' : 'On Track',
          progressPercent: p.progress || 65,
          summary: p.description || p.scope || 'Deliverables advancing on schedule.'
        }))
      : [
          { id: 'wi-1', title: 'Executive Workflow Automation', category: 'Operations', status: 'On Track', progressPercent: 75, summary: 'Zapier & Slack triaging pipelines live; 8h saved weekly.' },
          { id: 'wi-2', title: 'Investor Relations Data Room', category: 'Finance', status: 'In Review', progressPercent: 90, summary: 'Audit completed; financial statements and deck uploaded.' }
        ],

    // Section 6: Personal
    personalItems: [
      { id: 'pi-1', title: 'Wellness & Training Session', category: 'Appointments', timeOrDate: 'Today, 5:30 PM', summary: 'Personal trainer session confirmed at Equinox.' },
      { id: 'pi-2', title: 'Flight to Tokyo (SQ 012)', category: 'Travel', timeOrDate: 'Tomorrow, 10:45 AM', summary: 'Terminal 2 • 1A Seat • Chauffeur pick up at 07:45 AM.' },
      { id: 'pi-3', title: 'Anniversary Dinner Reservation', category: 'Reservations', timeOrDate: 'Friday, 8:00 PM', summary: 'Chef tasting table booked at French Laundry; dietary notes shared.' }
    ],

    // Section 7: Handled By Your EA
    handledItems: [
      { id: 'hi-1', title: 'Rescheduled 3:00 PM vendor sync to Thursday morning with no conflict', timeAgo: '2 hours ago', category: 'Calendar Management', completed: true },
      { id: 'hi-2', title: 'Checked in online and secured aisle seat 1A for SQ 012 flight', timeAgo: '3 hours ago', category: 'Travel & Logistics', completed: true },
      { id: 'hi-3', title: 'Filtered 42 incoming inbox threads; drafted responses for 5 VIP intros', timeAgo: '4 hours ago', category: 'Inbox Triage', completed: true },
      { id: 'hi-4', title: 'Conducted weekly Google Drive file audit; archived obsolete sprint decks', timeAgo: 'Yesterday', category: 'Drive Governance', completed: true }
    ],

    // Section 8: Upcoming
    upcomingItems: [
      { id: 'ui-1', timeframe: 'Tomorrow', title: 'Flight SQ 012 Departure to Tokyo', detail: 'Chauffeur departure at 07:45 AM from residence.' },
      { id: 'ui-2', timeframe: 'Thursday', title: 'Q3 Board of Directors Deck Sign-Off', detail: 'Final governance review before board meeting.' },
      { id: 'ui-3', timeframe: 'Friday', title: 'Weekly Retainer Hours & Drive Sign-Off', detail: 'Weekly operational audit delivered by EA.' },
      { id: 'ui-4', timeframe: 'Next Week', title: 'Quarterly Team Strategy Offsite', detail: 'Catering and venue logistics fully finalized.' }
    ]
  };
}
