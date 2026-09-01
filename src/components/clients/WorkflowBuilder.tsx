import React, { useState } from 'react';
import { 
  Workflow, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Copy, 
  Save, 
  Check, 
  Layers, 
  ChevronRight, 
  UserCheck,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Client, OnboardingPhase } from '@/types';

export interface WorkflowTemplate {
  id: string;
  name: string;
  type: 'onboarding' | 'offboarding';
  targetAudience: string;
  description: string;
  phases?: {
    id: number;
    name: string;
    description: string;
    items: { id: string; title: string; notes?: string }[];
  }[];
  offboardingSteps?: {
    id: string;
    title: string;
    category: string;
    notes: string;
  }[];
}

const PRESET_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'wf_onb_exec',
    name: 'Executive Assistant White-Glove Onboarding',
    type: 'onboarding',
    targetAudience: 'High-Net-Worth Executives & Founders',
    description: 'Comprehensive 4-phase onboarding covering legal/contracts, executive calendar discovery, 1Password access, and daily routine rhythm.',
    phases: [
      {
        id: 1,
        name: 'Administrative & Legal Alignment',
        description: 'Establish contracts, invoicing terms, and workspace infrastructure.',
        items: [
          { id: 'item_1_1', title: 'Executed Master Services Agreement (MSA) & NDA', notes: 'Countersigned via DocuSign/HelloSign' },
          { id: 'item_1_2', title: 'Autopay Retainer Setup & Initial Billing Receipt', notes: 'Card on file with automated net-0 receipt' },
          { id: 'item_1_3', title: 'Dedicated AEDMIN Workspace & Google Drive Folders Provisioned', notes: 'Shared root folder with permissions locked' }
        ]
      },
      {
        id: 2,
        name: 'Executive Intelligence & Decision Intake',
        description: 'Map out travel preferences, communication cadence, and family details.',
        items: [
          { id: 'item_2_1', title: 'Executive Style & Decision Intake Questionnaire Complete', notes: 'Log in 360 Client Profile' },
          { id: 'item_2_2', title: 'VIP Stakeholder & Family Relationship Directory Created', notes: 'Spouse, children, board members, investors' },
          { id: 'item_2_3', title: 'Travel & Dietary Dossier Recorded', notes: 'Frequent flyer numbers, hotel preferences, dietary quirks' }
        ]
      },
      {
        id: 3,
        name: 'Security & Shared Access Configuration',
        description: 'Secure delegation of Gmail, Google Calendar, Notion, and 1Password vaults.',
        items: [
          { id: 'item_3_1', title: '1Password Executive Shared Vault Connected', notes: 'Verify 2FA token transfer' },
          { id: 'item_3_2', title: 'Google Workspace Inbox & Calendar Delegation Granted', notes: 'Full management without password sharing' },
          { id: 'item_3_3', title: 'Slack Connect / WhatsApp Direct Channel Configured', notes: 'Establish response SLA and emergency rules' }
        ]
      },
      {
        id: 4,
        name: 'Kickoff & Daily Operational Rhythm',
        description: 'Execute the first live day and establish morning/evening recap dispatches.',
        items: [
          { id: 'item_4_1', title: 'Host 30-Minute Executive Kickoff & Alignment Call', notes: 'Review weekly standing blocks' },
          { id: 'item_4_2', title: 'First Morning Triage & Calendar Flow Dispatched', notes: 'Confirm receipt and refine tone' },
          { id: 'item_4_3', title: 'First Friday Weekly Executive Briefing Delivered', notes: 'Review wins, priorities, and retainer hours' }
        ]
      }
    ]
  },
  {
    id: 'wf_onb_frac_coo',
    name: 'Fractional COO & Systems Operations Kickoff',
    type: 'onboarding',
    targetAudience: 'Scaling Companies & Venture-Backed Teams',
    description: 'Process-oriented onboarding for operational audits, software tooling overhaul, and KPI cadence setup.',
    phases: [
      {
        id: 1,
        name: 'Operational Discovery & Tech Stack Audit',
        description: 'Audit company SaaS tools, team workflows, and key bottleneck points.',
        items: [
          { id: 'item_coo_1', title: 'SaaS Tooling & Subscription License Audit', notes: 'List all software tools, owners, and costs' },
          { id: 'item_coo_2', title: 'Current Team Operating Rhythm & Meeting Load Review', notes: 'Audit recurring meetings and async rules' }
        ]
      },
      {
        id: 2,
        name: 'System Architecture & SOP Standardization',
        description: 'Build company knowledge hub and establish autonomous approval thresholds.',
        items: [
          { id: 'item_coo_3', title: 'Company SOP Knowledge Base Structure Generated', notes: 'Notion or Google Drive system' },
          { id: 'item_coo_4', title: 'Financial & Invoice Approval Threshold Protocols Established', notes: 'Define autonomous signing limits' }
        ]
      }
    ]
  },
  {
    id: 'wf_off_standard',
    name: 'Enterprise Security & Asset Handover Offboarding',
    type: 'offboarding',
    targetAudience: 'All Retainer & VIP Engagements',
    description: 'Rigorous 6-step protocol for credential revocation, financial reconciliation, document handover, and archival.',
    offboardingSteps: [
      { id: 'step_off_1', title: 'Revoke Google Workspace, Notion & Slack Access', category: 'Security & Access', notes: 'Remove email delegation and delete active device tokens.' },
      { id: 'step_off_2', title: 'Export & Transfer Client File Vault to Client Drive', category: 'Data & Deliverables', notes: 'Deliver full compressed ZIP export of all assets.' },
      { id: 'step_off_3', title: 'Finalize Hours Audit & Reconcile Outstanding Invoices', category: 'Financial Settlement', notes: 'Audit billable log and issue zero-balance final statement.' },
      { id: 'step_off_4', title: 'Handover Operating Manuals & Standing Routine SOPs', category: 'Operational Handover', notes: 'Transfer executive briefing templates and recurring routine logs.' },
      { id: 'step_off_5', title: 'Archive 1Password & Password Vault Shared Keys', category: 'Security & Access', notes: 'Wipe local credential cache and confirm MFA ownership transfer.' },
      { id: 'step_off_6', title: 'Execute Formal Handover Signoff & Exit Alignment', category: 'Executive Partnership', notes: 'Confirm executive satisfaction and send appreciation letter.' }
    ]
  },
  {
    id: 'wf_off_rapid',
    name: 'Fast-Track Retainer Archival Offboarding',
    type: 'offboarding',
    targetAudience: 'Milestone & Project Clients',
    description: 'Rapid 3-step closure for short-term projects and completed contracts.',
    offboardingSteps: [
      { id: 'step_rap_1', title: 'Final Deliverable Sign-off & Client Acceptance', category: 'Deliverables', notes: 'Obtain written signoff on final project assets.' },
      { id: 'step_rap_2', title: 'Issue Final Project Invoice & Settlement', category: 'Finance', notes: 'Process remaining milestone payout.' },
      { id: 'step_rap_3', title: 'Archive Client Workspace & Move to Audit Records', category: 'Operations', notes: 'Preserve audit logs in read-only mode.' }
    ]
  }
];

interface WorkflowBuilderProps {
  onApplyWorkflowToClient?: (clientId: string, workflow: WorkflowTemplate) => void;
  selectedClientId?: string;
  embedded?: boolean;
}

export function WorkflowBuilder({ onApplyWorkflowToClient, selectedClientId, embedded = false }: WorkflowBuilderProps) {
  const { clients, updateClient } = useApp();
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(() => {
    const saved = localStorage.getItem('aedmin_custom_workflow_templates');
    if (saved) {
      try {
        return [...PRESET_TEMPLATES, ...JSON.parse(saved)];
      } catch {
        return PRESET_TEMPLATES;
      }
    }
    return PRESET_TEMPLATES;
  });

  const [activeWorkflowType, setActiveWorkflowType] = useState<'onboarding' | 'offboarding'>('onboarding');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PRESET_TEMPLATES[0].id);
  const [targetClientForApply, setTargetClientForApply] = useState<string>(selectedClientId || clients[0]?.id || '');
  const [applySuccessToast, setApplySuccessToast] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);

  // Template Editing State
  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const [editName, setEditName] = useState(activeTemplate?.name || '');
  const [editDesc, setEditDesc] = useState(activeTemplate?.description || '');
  const [editPhases, setEditPhases] = useState(activeTemplate?.phases || []);
  const [editSteps, setEditSteps] = useState(activeTemplate?.offboardingSteps || []);

  // Sync edit state when active template changes
  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tmpl = templates.find(t => t.id === id);
    if (tmpl) {
      setActiveWorkflowType(tmpl.type);
      setEditName(tmpl.name);
      setEditDesc(tmpl.description);
      setEditPhases(tmpl.phases || []);
      setEditSteps(tmpl.offboardingSteps || []);
    }
  };

  // Create new custom workflow template
  const handleCreateNewWorkflow = (type: 'onboarding' | 'offboarding') => {
    const newId = `custom_wf_${Date.now()}`;
    const newTmpl: WorkflowTemplate = {
      id: newId,
      name: `Custom ${type === 'onboarding' ? 'Onboarding' : 'Offboarding'} Workflow`,
      type,
      targetAudience: 'Custom Client Engagement',
      description: `Tailored ${type} checklist and milestones.`,
      phases: type === 'onboarding' ? [
        {
          id: 1,
          name: 'Phase 1: Initial Setup',
          description: 'Kickoff and initial requirements.',
          items: [
            { id: `item_${Date.now()}_1`, title: 'Execute Contract & Review Scope', notes: 'Initial alignment' },
            { id: `item_${Date.now()}_2`, title: 'Set Up Shared Communication Channel', notes: 'Slack or Email' }
          ]
        }
      ] : undefined,
      offboardingSteps: type === 'offboarding' ? [
        { id: `step_${Date.now()}_1`, title: 'Revoke System Access & Keys', category: 'Security', notes: 'Remove credentials' },
        { id: `step_${Date.now()}_2`, title: 'Deliver Final Asset Archive', category: 'Deliverables', notes: 'Send zip download' },
        { id: `step_${Date.now()}_3`, title: 'Final Financial Reconciliation', category: 'Finance', notes: 'Settle remaining hours' }
      ] : undefined
    };

    const updated = [...templates, newTmpl];
    setTemplates(updated);
    localStorage.setItem('aedmin_custom_workflow_templates', JSON.stringify(updated.filter(t => !PRESET_TEMPLATES.some(p => p.id === t.id))));
    handleSelectTemplate(newId);
    setIsEditingTemplate(true);
  };

  // Onboarding Phase & Item Operations
  const handleAddPhase = () => {
    const nextId = (editPhases.length || 0) + 1;
    setEditPhases([
      ...editPhases,
      {
        id: nextId,
        name: `Phase ${nextId}: Operational Execution`,
        description: 'New workflow milestone phase.',
        items: [
          { id: `item_${Date.now()}`, title: 'First milestone task for this phase', notes: 'Action item' }
        ]
      }
    ]);
  };

  const handleDeletePhase = (phaseIndex: number) => {
    setEditPhases(editPhases.filter((_, idx) => idx !== phaseIndex));
  };

  const handleAddItemToPhase = (phaseIndex: number) => {
    const updated = [...editPhases];
    updated[phaseIndex].items.push({
      id: `item_${Date.now()}`,
      title: 'New Checklist Action Item',
      notes: ''
    });
    setEditPhases(updated);
  };

  const handleUpdateItem = (phaseIndex: number, itemIndex: number, newTitle: string, newNotes?: string) => {
    const updated = [...editPhases];
    updated[phaseIndex].items[itemIndex].title = newTitle;
    if (newNotes !== undefined) updated[phaseIndex].items[itemIndex].notes = newNotes;
    setEditPhases(updated);
  };

  const handleDeleteItem = (phaseIndex: number, itemIndex: number) => {
    const updated = [...editPhases];
    updated[phaseIndex].items.splice(itemIndex, 1);
    setEditPhases(updated);
  };

  const handleMoveItem = (phaseIndex: number, itemIndex: number, direction: 'up' | 'down') => {
    const updated = [...editPhases];
    const items = updated[phaseIndex].items;
    if (direction === 'up' && itemIndex > 0) {
      const temp = items[itemIndex];
      items[itemIndex] = items[itemIndex - 1];
      items[itemIndex - 1] = temp;
    } else if (direction === 'down' && itemIndex < items.length - 1) {
      const temp = items[itemIndex];
      items[itemIndex] = items[itemIndex + 1];
      items[itemIndex + 1] = temp;
    }
    setEditPhases(updated);
  };

  // Offboarding Step Operations
  const handleAddOffboardingStep = () => {
    setEditSteps([
      ...editSteps,
      {
        id: `step_${Date.now()}`,
        title: 'New Offboarding Verification Protocol',
        category: 'Security & Access',
        notes: 'Protocol instructions'
      }
    ]);
  };

  const handleUpdateOffboardingStep = (stepIndex: number, field: string, value: string) => {
    const updated = [...editSteps];
    updated[stepIndex] = { ...updated[stepIndex], [field]: value };
    setEditSteps(updated);
  };

  const handleDeleteOffboardingStep = (stepIndex: number) => {
    setEditSteps(editSteps.filter((_, idx) => idx !== stepIndex));
  };

  const handleMoveOffboardingStep = (stepIndex: number, direction: 'up' | 'down') => {
    const updated = [...editSteps];
    if (direction === 'up' && stepIndex > 0) {
      const temp = updated[stepIndex];
      updated[stepIndex] = updated[stepIndex - 1];
      updated[stepIndex - 1] = temp;
    } else if (direction === 'down' && stepIndex < updated.length - 1) {
      const temp = updated[stepIndex];
      updated[stepIndex] = updated[stepIndex + 1];
      updated[stepIndex + 1] = temp;
    }
    setEditSteps(updated);
  };

  // Save current edits to template library
  const handleSaveTemplate = () => {
    const updatedTemplates = templates.map(t => {
      if (t.id === selectedTemplateId) {
        return {
          ...t,
          name: editName,
          description: editDesc,
          phases: t.type === 'onboarding' ? editPhases : undefined,
          offboardingSteps: t.type === 'offboarding' ? editSteps : undefined
        };
      }
      return t;
    });

    setTemplates(updatedTemplates);
    localStorage.setItem(
      'aedmin_custom_workflow_templates', 
      JSON.stringify(updatedTemplates.filter(t => !PRESET_TEMPLATES.some(p => p.id === t.id)))
    );
    setIsEditingTemplate(false);
  };

  // Apply workflow to target client
  const handleApplyToClient = () => {
    if (!targetClientForApply) return;
    const client = clients.find(c => c.id === targetClientForApply);
    if (!client) return;

    if (activeWorkflowType === 'onboarding') {
      // Map phases to client's onboardingPhases format
      const formattedPhases: OnboardingPhase[] = editPhases.map((p, idx) => ({
        id: idx + 1,
        name: p.name,
        description: p.description,
        completed: false,
        items: p.items.map(item => ({
          id: item.id || `ob_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          title: item.title,
          completed: false
        }))
      }));

      updateClient(client.id, {
        onboardingPhases: formattedPhases,
        onboardingProgress: 0,
        status: client.status === 'archived' ? 'archived' : 'onboarding'
      });
    } else {
      // Offboarding workflow
      const formattedOffboarding = editSteps.map(step => ({
        id: step.id,
        title: step.title,
        category: step.category,
        notes: step.notes,
        completed: false
      }));

      updateClient(client.id, {
        offboardingChecklist: formattedOffboarding,
        offboardingProgress: 0,
        status: client.status === 'archived' ? 'archived' : 'offboarding'
      });
    }

    if (onApplyWorkflowToClient) {
      onApplyWorkflowToClient(client.id, activeTemplate);
    }

    setApplySuccessToast(true);
    setTimeout(() => setApplySuccessToast(false), 3500);
  };

  const filteredTemplates = templates.filter(t => t.type === activeWorkflowType);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Workflow Builder Header */}
      {!embedded && (
        <div className="bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1">
                <Workflow className="w-3 h-3 text-purple-700" /> Operational Automation Suite
              </span>
              <span className="text-xs text-stone-500 font-medium">Standardized Client Journeys</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">Interactive Workflow Builder & SOP Engine</h2>
            <p className="text-xs text-stone-500 mt-0.5 max-w-2xl">
              Create, customize, reorder, and deploy bespoke onboarding and offboarding workflows directly to any client workspace.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleCreateNewWorkflow('onboarding')}
              className="px-4 py-2 bg-sidebar-bg hover:bg-stone-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> New Onboarding Workflow
            </button>
            <button
              onClick={() => handleCreateNewWorkflow('offboarding')}
              className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> New Offboarding Workflow
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Left Template Selector + Right Interactive Checklist Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Workflow Category Tabs & Template Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Type Toggle Pills */}
          <div className="bg-stone-100 p-1 rounded-2xl flex border border-[#ECE6DD]">
            <button
              onClick={() => {
                setActiveWorkflowType('onboarding');
                const first = templates.find(t => t.type === 'onboarding');
                if (first) handleSelectTemplate(first.id);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeWorkflowType === 'onboarding'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-700" />
              Onboarding ({templates.filter(t => t.type === 'onboarding').length})
            </button>

            <button
              onClick={() => {
                setActiveWorkflowType('offboarding');
                const first = templates.find(t => t.type === 'offboarding');
                if (first) handleSelectTemplate(first.id);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeWorkflowType === 'offboarding'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              Offboarding ({templates.filter(t => t.type === 'offboarding').length})
            </button>
          </div>

          {/* Template Cards List */}
          <div className="space-y-2.5">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;
              return (
                <div
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-purple-600 shadow-sm ring-1 ring-purple-600/20'
                      : 'bg-[#FAF8F5] border-[#ECE6DD] hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 leading-snug">{template.name}</h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 shrink-0">
                      {template.type === 'onboarding' ? `${template.phases?.length || 0} Phases` : `${template.offboardingSteps?.length || 0} Steps`}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Apply Panel */}
          <div className="bg-[#FCFAF8] p-5 rounded-3xl border border-[#ECE6DD] space-y-3">
            <span className="text-xs font-bold text-stone-900 block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Deploy to Client Workspace
            </span>
            <p className="text-[11px] text-stone-500">
              Apply this active workflow directly to a client's live environment.
            </p>

            <div className="space-y-2">
              <select
                value={targetClientForApply}
                onChange={e => setTargetClientForApply(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#ECE6DD] rounded-xl text-xs font-medium text-stone-900"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company}) — Status: {c.status.toUpperCase()}
                  </option>
                ))}
              </select>

              {applySuccessToast && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-600" /> Workflow successfully applied!
                </div>
              )}

              <button
                onClick={handleApplyToClient}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Apply {activeWorkflowType === 'onboarding' ? 'Onboarding' : 'Offboarding'} Workflow
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Checklist Builder & Reordering Suite (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#ECE6DD] shadow-xs space-y-6">
          
          {/* Header & Meta Edit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECE6DD]">
            <div className="flex-1 min-w-0">
              {isEditingTemplate ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full text-base font-bold text-stone-900 p-2 rounded-xl border border-[#ECE6DD]"
                    placeholder="Workflow Title"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    className="w-full text-xs text-stone-600 p-2 rounded-xl border border-[#ECE6DD]"
                    placeholder="Short description of this workflow"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-bold text-stone-900">{editName}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">{editDesc}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isEditingTemplate ? (
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingTemplate(true)}
                  className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Template
                </button>
              )}
            </div>
          </div>

          {/* 1. ONBOARDING PHASES BUILDER */}
          {activeWorkflowType === 'onboarding' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Workflow Phases & Action Checklists
                </span>
                <button
                  onClick={handleAddPhase}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 rounded-full text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Phase
                </button>
              </div>

              {editPhases.map((phase, pIdx) => (
                <div key={phase.id || pIdx} className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DD] space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-200 text-purple-900 text-xs font-bold flex items-center justify-center">
                          {pIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={phase.name}
                          onChange={(e) => {
                            const updated = [...editPhases];
                            updated[pIdx].name = e.target.value;
                            setEditPhases(updated);
                          }}
                          className="font-bold text-xs text-stone-900 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-purple-600 focus:bg-white px-1.5 py-0.5 rounded outline-none flex-1"
                        />
                      </div>
                      <input
                        type="text"
                        value={phase.description}
                        onChange={(e) => {
                          const updated = [...editPhases];
                          updated[pIdx].description = e.target.value;
                          setEditPhases(updated);
                        }}
                        placeholder="Phase description..."
                        className="text-[11px] text-stone-500 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-purple-600 focus:bg-white px-1.5 py-0.5 rounded outline-none w-full mt-1"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleAddItemToPhase(pIdx)}
                        className="p-1.5 bg-white border border-[#ECE6DD] hover:bg-stone-50 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1"
                        title="Add item to this phase"
                      >
                        <Plus className="w-3.5 h-3.5" /> Item
                      </button>
                      <button
                        onClick={() => handleDeletePhase(pIdx)}
                        className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg"
                        title="Delete phase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Checklist Items in Phase with Reordering */}
                  <div className="space-y-2 pt-1">
                    {phase.items.map((item, iIdx) => (
                      <div
                        key={item.id || iIdx}
                        className="p-3 bg-white rounded-xl border border-[#ECE6DD] flex items-center justify-between gap-2.5 shadow-2xs group"
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-stone-300 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleUpdateItem(pIdx, iIdx, e.target.value)}
                              className="w-full text-xs font-semibold text-stone-800 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-purple-600 px-1 py-0.5 rounded outline-none"
                            />
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => handleUpdateItem(pIdx, iIdx, item.title, e.target.value)}
                              placeholder="Add SOP note or guidance instructions..."
                              className="w-full text-[10px] text-stone-400 bg-transparent border-b border-transparent hover:border-stone-300 focus:border-purple-600 px-1 py-0.5 rounded outline-none"
                            />
                          </div>
                        </div>

                        {/* Item Actions: Reorder & Delete */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveItem(pIdx, iIdx, 'up')}
                            disabled={iIdx === 0}
                            className={`p-1 rounded-lg border border-[#ECE6DD] ${
                              iIdx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
                            }`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveItem(pIdx, iIdx, 'down')}
                            disabled={iIdx === phase.items.length - 1}
                            className={`p-1 rounded-lg border border-[#ECE6DD] ${
                              iIdx === phase.items.length - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
                            }`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(pIdx, iIdx)}
                            className="p-1 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg"
                            title="Delete item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {phase.items.length === 0 && (
                      <p className="text-[11px] text-stone-400 italic py-2 text-center">
                        No checklist items in this phase. Click "+ Item" to add.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. OFFBOARDING STEPS BUILDER */}
          {activeWorkflowType === 'offboarding' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  Offboarding Steps & Handover Protocols
                </span>
                <button
                  onClick={handleAddOffboardingStep}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-full text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Offboarding Step
                </button>
              </div>

              <div className="space-y-3">
                {editSteps.map((step, sIdx) => (
                  <div
                    key={step.id || sIdx}
                    className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg bg-rose-200 text-rose-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {sIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleUpdateOffboardingStep(sIdx, 'title', e.target.value)}
                            placeholder="Step Title"
                            className="font-bold text-xs text-stone-900 bg-white p-2 rounded-xl border border-[#ECE6DD] w-full"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={step.category}
                            onChange={(e) => handleUpdateOffboardingStep(sIdx, 'category', e.target.value)}
                            placeholder="Category (e.g. Security & Access, Finance)"
                            className="p-2 bg-white rounded-xl border border-[#ECE6DD] text-stone-700"
                          />
                          <input
                            type="text"
                            value={step.notes}
                            onChange={(e) => handleUpdateOffboardingStep(sIdx, 'notes', e.target.value)}
                            placeholder="Protocol notes / instructions"
                            className="p-2 bg-white rounded-xl border border-[#ECE6DD] text-stone-700"
                          />
                        </div>
                      </div>

                      {/* Reorder & Delete Step Controls */}
                      <div className="flex items-center gap-1 shrink-0 pt-1">
                        <button
                          onClick={() => handleMoveOffboardingStep(sIdx, 'up')}
                          disabled={sIdx === 0}
                          className={`p-1.5 rounded-lg border border-[#ECE6DD] bg-white ${
                            sIdx === 0 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
                          }`}
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveOffboardingStep(sIdx, 'down')}
                          disabled={sIdx === editSteps.length - 1}
                          className={`p-1.5 rounded-lg border border-[#ECE6DD] bg-white ${
                            sIdx === editSteps.length - 1 ? 'text-stone-200 cursor-not-allowed' : 'text-stone-600 hover:bg-stone-100'
                          }`}
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteOffboardingStep(sIdx)}
                          className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg"
                          title="Delete step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {editSteps.length === 0 && (
                  <p className="text-xs text-stone-400 italic py-6 text-center">
                    No offboarding steps configured. Click "+ Add Offboarding Step".
                  </p>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
