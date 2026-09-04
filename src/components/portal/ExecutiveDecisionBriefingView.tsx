import React from 'react';
import { Client, ApprovalItem, Task, Project, ExecutiveBriefingSnapshot, Invoice } from '@/types';
import { generateInitialDraftBriefing } from '@/utils/executiveBriefingUtils';
import { ExecutiveBriefingPortalFeed } from './ExecutiveBriefingPortalFeed';

interface ExecutiveDecisionBriefingViewProps {
  client: Client;
  briefing?: ExecutiveBriefingSnapshot;
  approvals?: ApprovalItem[];
  tasks?: Task[];
  projects?: Project[];
  invoices?: Invoice[];
  userFullName?: string;
  userTitle?: string;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onAskQuestion?: (id: string, question: string) => void;
  onOpenMessageModal?: () => void;
  isPreviewMode?: boolean;
}

export const ExecutiveDecisionBriefingView: React.FC<ExecutiveDecisionBriefingViewProps> = ({
  client,
  briefing,
  approvals = [],
  tasks = [],
  projects = [],
  invoices = [],
  userFullName = 'Executive Partner',
  userTitle = 'Executive Assistant',
  onApprove,
  onReject,
  onAskQuestion,
  onOpenMessageModal,
  isPreviewMode = false
}) => {
  // If a briefing snapshot is provided or exists on client.portalConfig, use it; otherwise generate initial snapshot
  const activeBriefing = briefing || 
    client.portalConfig?.publishedBriefing || 
    client.portalConfig?.draftBriefing || 
    generateInitialDraftBriefing(client, tasks, approvals, projects, invoices);

  return (
    <ExecutiveBriefingPortalFeed
      client={client}
      briefing={activeBriefing}
      invoices={invoices}
      projects={projects}
      isPreviewMode={isPreviewMode}
      onApproveDecision={onApprove}
      onRequestDecisionChange={(id, notes) => onAskQuestion ? onAskQuestion(id, notes) : onReject?.(id)}
      onOpenMessageModal={onOpenMessageModal}
    />
  );
};
