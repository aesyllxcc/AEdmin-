import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Send, 
  Layers, 
  Users, 
  Briefcase, 
  Download, 
  Plus, 
  RefreshCw, 
  Sliders, 
  FolderCheck,
  Building2,
  Mail,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ComposerTemplate } from '@/types';

interface ComposerTemplateItem {
  id: string;
  title: string;
  category: 'briefing' | 'client_outreach' | 'pitch' | 'document';
  description: string;
  previewGenerator: () => string;
}

export default function SmartComposer() {
  const { clients, tasks, timeEntries, userProfile } = useApp();
  const { currentUser } = useAuth();

  const activeClients = clients.filter(c => c.status === 'active');
  const [selectedClientId, setSelectedClientId] = useState(activeClients[0]?.id || clients[0]?.id || '');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'briefing' | 'client_outreach' | 'pitch' | 'document'>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('eod_recap');
  const [tone, setTone] = useState<'concise' | 'diplomatic' | 'urgent' | 'detailed'>('concise');
  const [copied, setCopied] = useState(false);

  // Pitch specific inputs
  const [pitchTargetCompany, setPitchTargetCompany] = useState('Acme Ventures');
  const [pitchTargetRole, setPitchTargetRole] = useState('Founding Executive Assistant / Ops Lead');
  const [pitchKeySkills, setPitchKeySkills] = useState('Calendar Defense, Global Timezone Ops, Investor Reporting, High-Stakes Travel');

  // Custom additions
  const [customActionItem, setCustomActionItem] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const targetClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientTasks = tasks.filter(t => t.clientId === selectedClientId && !t.isArchived);
  const completedToday = clientTasks.filter(t => t.status === 'completed');
  const inFlightTasks = clientTasks.filter(t => t.status === 'in_progress' || t.status === 'todo');

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Prebuilt Composer Templates
  const templates: ComposerTemplateItem[] = [
    {
      id: 'eod_recap',
      title: 'Daily EOD Executive Recap',
      category: 'briefing',
      description: 'End-of-day operational report for client inbox or Slack channel.',
      previewGenerator: () => {
        const clientName = targetClient ? targetClient.name : 'Client';
        const contactName = targetClient ? targetClient.primaryContact.split(' ')[0] : 'there';
        const hoursUsed = targetClient ? targetClient.usedHoursThisMonth : 0;
        const hoursPurchased = targetClient ? targetClient.purchasedHours : 0;
        const hoursLeft = (hoursPurchased - hoursUsed).toFixed(1);

        return `Subject: EOD Executive Briefing — ${clientName} (${shortDate})

Hi ${contactName},

Here is your daily executive operating summary for ${todayFormatted}:

✅ COMPLETED DELIVERABLES TODAY:
${completedToday.length > 0 ? completedToday.map(t => `• ${t.title}`).join('\n') : '• Maintained proactive communications monitoring, calendar audit, and operational standby.'}

🔄 ACTIVE / IN-PROGRESS FOR TOMORROW:
${inFlightTasks.length > 0 ? inFlightTasks.slice(0, 4).map(t => `• ${t.title} (Target: ${t.dueDate || 'Tomorrow'})`).join('\n') : '• Preparing upcoming milestone reviews.'}

⏳ RETAINER ALLOCATION STATUS:
• Retainer Used This Period: ${hoursUsed} hrs / ${hoursPurchased} hrs
• Available Balance: ${hoursLeft} hrs

⚠️ ITEMS REQUIRING YOUR ATTENTION:
${customActionItem ? `• ${customActionItem}` : '• No blockers or urgent input required. All operations are running smoothly.'}
${customNotes ? `\n💡 EA NOTE:\n${customNotes}` : ''}

Best regards,
${currentUser?.fullName || userProfile.fullName}
${userProfile.title}`;
      }
    },
    {
      id: 'weekly_brief',
      title: 'Weekly Strategic Retainer Brief',
      category: 'briefing',
      description: 'Comprehensive high-level weekly recap of deliverables, milestone pacing, and upcoming priorities.',
      previewGenerator: () => {
        const clientName = targetClient ? targetClient.name : 'Client';
        const contactName = targetClient ? targetClient.primaryContact.split(' ')[0] : 'there';

        return `Subject: Weekly Executive Operations Brief — ${clientName}

Good morning ${contactName},

Here is the weekly executive summary for ${clientName}:

1. KEY WINS & COMPLETED MILESTONES:
${completedToday.length > 0 ? completedToday.map(t => `• ${t.title}`).join('\n') : '• Completed full weekly Google Drive audit and standardized project nomenclature.\n• Synchronized quarterly board meeting schedule and confirmed all executive attendees.'}

2. IN-FLIGHT PRIORITIES & SPRINT PACING:
${inFlightTasks.length > 0 ? inFlightTasks.map(t => `• ${t.title}`).join('\n') : '• Coordinating upcoming business trip logistics and private briefing book.\n• Finalizing monthly investor update dispatch.'}

3. DECISION QUEUE / YOUR INPUT:
${customActionItem ? `• ${customActionItem}` : '• Please approve the revised Q4 vendor agreement before Thursday 12:00 PM.'}

4. TIME & RETAINER HEALTH:
• Retainer utilization is pacing on schedule at ${targetClient?.usedHoursThisMonth || 12} hours.

Let me know if you would like me to adjust any strategic priorities for the coming week.

Best regards,
${currentUser?.fullName || userProfile.fullName}`;
      }
    },
    {
      id: 'cover_letter_pitch',
      title: 'Tailored Cover Letter & Pitch Proposal',
      category: 'pitch',
      description: 'High-converting, polished cover letter for high-end Executive Assistant & Chief of Staff roles.',
      previewGenerator: () => {
        return `Dear Hiring Lead at ${pitchTargetCompany},

I am writing to express my strong interest in the ${pitchTargetRole} position. 

As an elite Executive Assistant and Operations Lead with extensive experience managing multi-timezone executives and high-growth ventures, I specialize in eliminating operational friction so leaders can focus entirely on high-leverage decisions.

Here is what I bring to ${pitchTargetCompany}:
• Strategic Calendar & Schedule Mastery: Proactive time protection, buffer zoning, and zero-conflict multi-party coordination.
• High-Impact Communications: Executive briefing drafting, inbox triage (4D Heuristic), and stakeholder follow-through.
• Core Competencies: ${pitchKeySkills}.
• Systematic Drive & Asset Governance: Standardized document hierarchies, strict access control, and complete operational confidentiality.

I operate with discretion, high velocity, and extreme ownership. I would welcome the opportunity to discuss how I can immediately unburden your executive leadership.

Sincerely,
${currentUser?.fullName || userProfile.fullName}
${userProfile.title} • ${userProfile.email}`;
      }
    },
    {
      id: 'cold_dm_pitch',
      title: 'LinkedIn / X Direct Message Pitch',
      category: 'pitch',
      description: 'Punchy, conversational 3-paragraph executive DM pitch designed for instant replies.',
      previewGenerator: () => {
        return `Hi [First Name],

Saw your recent update regarding ${pitchTargetCompany}’s growth — congratulations on the momentum!

I help founders and C-suite executives reclaim 15+ hours each week by taking complete ownership of calendar management, investor briefings, high-stakes travel logistics, and client communications.

I currently have bandwidth to support one additional high-growth leader. Would you be open to a brief 10-minute async intro next week to see if I can take operational weight off your plate?

Best,
${currentUser?.fullName || userProfile.fullName}`;
      }
    },
    {
      id: 'meeting_request',
      title: 'Stakeholder Executive Meeting Request',
      category: 'client_outreach',
      description: 'Polite, time-bracketed formal invitation for external partners or investors.',
      previewGenerator: () => {
        return `Subject: Introduction: [Your Executive's Name] <> [Stakeholder Name] / [Topic]

Hi [Stakeholder Name],

I hope this email finds you well.

I am reaching out on behalf of ${targetClient?.primaryContact || 'my executive'}, who would like to connect with you regarding [Discussion Topic / Agenda].

Would any of the following 30-minute windows work for your calendar next week?
• Option 1: Tuesday, [Date] at 10:00 AM [Timezone]
• Option 2: Wednesday, [Date] at 2:30 PM [Timezone]
• Option 3: Thursday, [Date] at 11:00 AM [Timezone]

If another time suits you better, please let me know or feel free to share your booking link.

Thank you,
${currentUser?.fullName || userProfile.fullName}
Executive Assistant to ${targetClient?.primaryContact || 'Executive'}`;
      }
    },
    {
      id: 'blocker_notice',
      title: 'Urgent Approval / Blocker Escalation',
      category: 'client_outreach',
      description: 'Respectful, high-urgency ping when an executive sign-off is blocking a milestone.',
      previewGenerator: () => {
        return `Subject: URGENT: Input Required to Keep [Project Name] on Schedule

Hi ${targetClient?.primaryContact.split(' ')[0] || 'there'},

Quick heads up on the [Project/Deliverable Name] sprint.

To maintain our targeted completion date of [Target Date], we urgently need your review and sign-off on:
👉 [Document Link / Decision Item]

${customActionItem ? `Action Needed: ${customActionItem}` : 'Action Needed: Please provide confirmation or requested edits by 3:00 PM today.'}

Once approved, I will immediately dispatch this to the external stakeholders.

Thank you!
${currentUser?.fullName || userProfile.fullName}`;
      }
    },
    {
      id: 'sop_document',
      title: 'Standard Operating Procedure (SOP) Template',
      category: 'document',
      description: 'Structured internal or client-facing operating manual format.',
      previewGenerator: () => {
        return `# SOP: [System / Process Title]
**Version:** 1.0  
**Effective Date:** ${todayFormatted}  
**Owner:** ${currentUser?.fullName || userProfile.fullName}  
**Target Client:** ${targetClient?.name || 'All Clients'}  

---

### 1. Objective & Scope
Define the primary goal of this procedure and the operational standards it maintains.

### 2. Required Tools & Access Credentials
- Google Drive Root Folder
- Password Vault / 2FA Access
- Communication Channel (Slack / Email)

### 3. Step-by-Step Execution Protocol
1. **Initial Trigger:** Receive incoming request or scheduled Friday audit cadence.
2. **Execution Steps:**
   - Step A: Verify input parameters and client guidelines.
   - Step B: Execute deliverable using standardized naming conventions.
   - Step C: Perform QA and file integrity check.
3. **Completion & Handover:** Dispatch confirmation email to primary executive and log in AEDMIN.

### 4. Exception Handling & Escalation
If blockers occur or required assets are missing, escalate to ${targetClient?.primaryContact || 'Primary Contact'} within 2 hours.`;
      }
    }
  ];

  const filteredTemplates = categoryFilter === 'all' 
    ? templates 
    : templates.filter(t => t.category === categoryFilter);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const generatedContent = activeTemplate.previewGenerator();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeTemplate.id}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Document & Communications Composer
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Templates • Cover Letters • Executive Recaps • SOPs
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#18191D] mt-2">
            Smart Message & Document Composer
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium">
            Draft decision-relevant executive briefs, tailored cover letters, outreach pings, and standard operating procedures with one click.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2.5 bg-white border border-[#ECE6DD] hover:bg-stone-50 text-[#18191D] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Export .MD</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Templates' },
          { id: 'briefing', label: 'Daily & Weekly Briefings' },
          { id: 'pitch', label: 'Cover Letters & DM Pitches' },
          { id: 'client_outreach', label: 'Stakeholder Outreach & Alerts' },
          { id: 'document', label: 'SOPs & Handover Docs' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              categoryFilter === cat.id 
                ? 'bg-[#18191D] text-white border-[#18191D] shadow-xs' 
                : 'bg-white text-stone-500 hover:text-[#18191D] border-[#ECE6DD]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Template Selector + Customizer + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Template List & Variable Inputs (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Template Card Selector */}
          <div className="bg-white p-5 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Select Template ({filteredTemplates.length})
            </h3>
            
            <div className="space-y-2">
              {filteredTemplates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                    selectedTemplateId === tmpl.id 
                      ? 'bg-[#18191D] text-white border-[#18191D] shadow-xs' 
                      : 'bg-[#FAF8F5] text-[#18191D] border-[#ECE6DD] hover:border-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold">{tmpl.title}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      selectedTemplateId === tmpl.id ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {tmpl.category}
                    </span>
                  </div>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${
                    selectedTemplateId === tmpl.id ? 'text-stone-300' : 'text-stone-500'
                  }`}>
                    {tmpl.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Context Controls */}
          <div className="bg-white p-5 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Dynamic Context Variables
            </h3>

            {/* If briefing or client outreach: show client dropdown */}
            {(activeTemplate.category === 'briefing' || activeTemplate.category === 'client_outreach' || activeTemplate.category === 'document') && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Target Client</label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="w-full text-xs font-semibold p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
                >
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.primaryContact})</option>
                  ))}
                </select>
              </div>
            )}

            {/* If pitch / cover letter: show company & role inputs */}
            {activeTemplate.category === 'pitch' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Company / Executive</label>
                  <input
                    type="text"
                    value={pitchTargetCompany}
                    onChange={e => setPitchTargetCompany(e.target.value)}
                    placeholder="e.g. Sequoia Capital / Brian Chesky"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Role Title</label>
                  <input
                    type="text"
                    value={pitchTargetRole}
                    onChange={e => setPitchTargetRole(e.target.value)}
                    placeholder="e.g. Executive Assistant to CEO"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Key Strengths & Differentiators</label>
                  <input
                    type="text"
                    value={pitchKeySkills}
                    onChange={e => setPitchKeySkills(e.target.value)}
                    placeholder="e.g. Schedule Defense, Global Ops, Travel Logistics"
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Custom Notes / Action Item */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Custom Action Item for Client (Optional)
              </label>
              <input
                type="text"
                value={customActionItem}
                onChange={e => setCustomActionItem(e.target.value)}
                placeholder="e.g. Please approve the vendor contract before 12 PM"
                className="w-full text-xs p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Concise EA Note / Context (Optional)
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="e.g. Rescheduled your 3 PM investor call and confirmed boarding pass."
                className="w-full text-xs p-2.5 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Live Executive Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#ECE6DD] shadow-xs flex flex-col justify-between space-y-4 min-h-[560px]">
            
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#ECE6DD]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-[#18191D]">
                  {activeTemplate.title} — Output Preview
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                {generatedContent.length} chars
              </span>
            </div>

            {/* Formatted Content */}
            <div className="flex-1 bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE6DD] overflow-y-auto max-h-[460px] custom-scrollbar">
              <pre className="font-sans text-xs text-[#18191D] whitespace-pre-wrap leading-relaxed">
                {generatedContent}
              </pre>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-[11px] text-stone-400">
                Ready to paste into Gmail, Slack, Telegram, Upwork, or Notion.
              </p>
              <button
                onClick={handleCopy}
                className="px-6 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
