import React, { useState, useRef, useEffect } from 'react';
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
  FileCheck,
  Search,
  Star,
  Edit,
  Trash2,
  Play,
  RotateCcw,
  Tag,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Maximize2,
  Printer,
  Save,
  CheckCircle2,
  Clock,
  Variable
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ManagedTemplate, GeneratedDraftRecord } from '@/types';
import { TemplateEditorModal } from '@/components/templates/TemplateEditorModal';
import { TemplateRunnerModal } from '@/components/templates/TemplateRunnerModal';

export default function AESmartWrite() {
  const { 
    clients, 
    tasks, 
    timeEntries, 
    userProfile,
    templates,
    generatedDrafts,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    archiveTemplate,
    restoreTemplate,
    toggleTemplateFavorite,
    saveGeneratedDraft,
    deleteGeneratedDraft,
    updateGeneratedDraft
  } = useApp();

  const { currentUser } = useAuth();

  // Navigation tab within AESmart Write
  const [subTab, setSubTab] = useState<'composer' | 'library' | 'pitch' | 'drafts'>('composer');

  // Client Selection
  const activeClients = clients.filter(c => c.status === 'active');
  const [selectedClientId, setSelectedClientId] = useState(activeClients[0]?.id || clients[0]?.id || '');
  const [selectedTone, setSelectedTone] = useState<'concise' | 'diplomatic' | 'urgent' | 'detailed'>('concise');
  const [quickTemplateId, setQuickTemplateId] = useState<string>('eod_recap');

  // Rich Text Editor Content State
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorHtml, setEditorHtml] = useState<string>('');
  const [editorTitle, setEditorTitle] = useState<string>('Executive Update');
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Pitch specific inputs
  const [pitchCompany, setPitchCompany] = useState('Acme Ventures');
  const [pitchRole, setPitchRole] = useState('Founding Executive Assistant / Chief of Staff');
  const [pitchSkills, setPitchSkills] = useState('Calendar Defense, Global Timezone Ops, Investor Reporting, High-Stakes Travel Logistics');
  const [pitchPainPoint, setPitchPainPoint] = useState('Executive calendar overload, rapid cross-timezone communication friction, and strategic administrative bottlenecks');

  // Custom inputs for quick compose
  const [customActionItem, setCustomActionItem] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Library state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<ManagedTemplate | null>(null);
  const [runnerModalOpen, setRunnerModalOpen] = useState(false);
  const [templateToRun, setTemplateToRun] = useState<ManagedTemplate | null>(null);

  // Drafts state
  const [activeDraft, setActiveDraft] = useState<GeneratedDraftRecord | null>(null);
  const [draftEditText, setDraftEditText] = useState<string>('');

  const targetClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const clientTasks = tasks.filter(t => t.clientId === selectedClientId && !t.isArchived);
  const completedToday = clientTasks.filter(t => t.status === 'completed');
  const inFlightTasks = clientTasks.filter(t => t.status === 'in_progress' || t.status === 'todo');

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const shortDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Generate initial content when composer loads
  useEffect(() => {
    generateQuickContent(quickTemplateId);
  }, [selectedClientId, selectedTone]);

  const generateQuickContent = (templateId: string) => {
    setQuickTemplateId(templateId);
    const clientName = targetClient ? targetClient.name : 'Client';
    const contactName = targetClient ? targetClient.primaryContact.split(' ')[0] : 'there';
    const hoursUsed = targetClient ? targetClient.usedHoursThisMonth : 0;
    const hoursPurchased = targetClient ? targetClient.purchasedHours : 0;
    const hoursLeft = (hoursPurchased - hoursUsed).toFixed(1);
    const userName = currentUser?.fullName || userProfile.fullName || 'Olivia Vance';
    const userTitle = userProfile.title || 'Executive Virtual Assistant';

    let html = '';
    let title = '';

    if (templateId === 'eod_recap') {
      title = `EOD Executive Briefing — ${clientName} (${shortDate})`;
      html = `<h2><strong>Subject: EOD Executive Briefing — ${clientName} (${shortDate})</strong></h2>
<p>Hi ${contactName},</p>
<p>Here is your daily executive operating summary for <strong>${todayFormatted}</strong>:</p>
<hr />
<h3><strong>✅ COMPLETED DELIVERABLES TODAY:</strong></h3>
<ul>
  ${completedToday.length > 0 ? completedToday.map(t => `<li><strong>${t.title}</strong> — Priority: ${t.priority.toUpperCase()}</li>`).join('') : '<li>Maintained calendar monitoring, inbox triage, and operational standby.</li>'}
</ul>
<hr />
<h3><strong>🔄 ACTIVE / IN-PROGRESS FOR TOMORROW:</strong></h3>
<ul>
  ${inFlightTasks.length > 0 ? inFlightTasks.slice(0, 4).map(t => `<li><strong>${t.title}</strong> (Target: ${t.dueDate || 'Tomorrow'})</li>`).join('') : '<li>Preparing upcoming sprint deliverables and executive briefing packets.</li>'}
</ul>
<hr />
<h3><strong>⏳ RETAINER ALLOCATION STATUS:</strong></h3>
<ul>
  <li>Retainer Used This Month: <strong>${hoursUsed} hrs</strong> / ${hoursPurchased} hrs</li>
  <li>Available Balance: <strong>${hoursLeft} hrs</strong></li>
</ul>
<hr />
<h3><strong>⚠️ ITEMS REQUIRING YOUR ATTENTION:</strong></h3>
<p>${customActionItem ? `• ${customActionItem}` : '• No blockers or urgent input required at this time. All operations are running smoothly.'}</p>
${customNotes ? `<p><em>💡 <strong>EA Note:</strong> ${customNotes}</em></p>` : ''}
<br />
<p>Best regards,<br /><strong>${userName}</strong><br />${userTitle}</p>`;
    } else if (templateId === 'weekly_brief') {
      title = `Weekly Strategic Operations Brief — ${clientName}`;
      html = `<h2><strong>Subject: Weekly Strategic Operations Brief — ${clientName}</strong></h2>
<p>Good morning ${contactName},</p>
<p>Here is the weekly executive operations summary for <strong>${clientName}</strong>:</p>
<hr />
<h3><strong>1. KEY WINS & COMPLETED MILESTONES:</strong></h3>
<ul>
  ${completedToday.length > 0 ? completedToday.map(t => `<li><strong>${t.title}</strong></li>`).join('') : '<li>Completed full weekly Google Drive audit and standardized nomenclature.</li><li>Synchronized executive schedule and confirmed all board meeting attendees.</li>'}
</ul>
<hr />
<h3><strong>2. IN-FLIGHT PRIORITIES & SPRINT PACING:</strong></h3>
<ul>
  ${inFlightTasks.length > 0 ? inFlightTasks.map(t => `<li><strong>${t.title}</strong></li>`).join('') : '<li>Coordinating upcoming business travel logistics and private briefing book.</li><li>Finalizing monthly client update and vendor agreements.</li>'}
</ul>
<hr />
<h3><strong>3. DECISION QUEUE / YOUR INPUT:</strong></h3>
<p>${customActionItem ? `• ${customActionItem}` : '• Please approve the revised Q4 vendor agreement before Thursday 12:00 PM.'}</p>
<hr />
<h3><strong>4. CAPACITY & RETAINER HEALTH:</strong></h3>
<p>Retainer utilization is pacing smoothly on schedule with <strong>${hoursUsed} hours</strong> consumed of <strong>${hoursPurchased} total hours</strong> (${hoursLeft} hrs remaining).</p>
<br />
<p>Warmly,<br /><strong>${userName}</strong><br />${userTitle}</p>`;
    } else if (templateId === 'proposal_sow') {
      title = `Executive Support Proposal & SOW — ${clientName}`;
      html = `<h2><strong>EXECUTIVE SUPPORT PROPOSAL & SCOPE OF WORK</strong></h2>
<p><strong>Prepared for:</strong> ${clientName} (${contactName})<br />
<strong>Prepared by:</strong> ${userName} (${userTitle})<br />
<strong>Date:</strong> ${todayFormatted}</p>
<hr />
<h3><strong>1. EXECUTIVE SUMMARY & ENGAGEMENT OBJECTIVE</strong></h3>
<p>This engagement is designed to streamline administrative operations, defend executive calendar time, and provide proactive cross-timezone support for ${clientName}.</p>
<hr />
<h3><strong>2. SCOPE OF SERVICES</strong></h3>
<ul>
  <li><strong>Calendar & Timezone Defense:</strong> Autonomous scheduling, conflict resolution, buffer optimization.</li>
  <li><strong>Inbox Triage & VIP Dispatch:</strong> Daily zero-inbox protocol, drafted replies, priority escalation.</li>
  <li><strong>Operational Document Management:</strong> Google Drive directory auditing, file hygiene, client briefings.</li>
  <li><strong>Travel & Logistics Management:</strong> Comprehensive itineraries, private transport, and visa coordination.</li>
</ul>
<hr />
<h3><strong>3. RETAINER TERMS & INVESTMENT</strong></h3>
<p><strong>Monthly Allocation:</strong> ${hoursPurchased || 20} Dedicated Hours / Month<br />
<strong>Monthly Retainer:</strong> $${((hoursPurchased || 20) * (userProfile.defaultHourlyRate || 150)).toLocaleString()} USD / Month<br />
<strong>Overage Rate:</strong> $${userProfile.defaultHourlyRate || 150} USD / Hour</p>
<br />
<p>Agreed and Confirmed,<br /><strong>${userName}</strong></p>`;
    } else if (templateId === 'outreach_followup') {
      title = `Follow-Up & Check-In — ${clientName}`;
      html = `<p>Hi ${contactName},</p>
<p>Following up on our recent conversation regarding executive operations and support for <strong>${clientName}</strong>.</p>
<p>I wanted to check if you had a chance to review the proposed scope of work and timeline. I have reserved capacity in our schedule to kick off onboarding seamlessly.</p>
<p>Looking forward to your thoughts!</p>
<br />
<p>Best,<br /><strong>${userName}</strong></p>`;
    }

    setEditorTitle(title);
    setEditorHtml(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
  };

  const generatePitchContent = () => {
    const userName = currentUser?.fullName || userProfile.fullName || 'Olivia Vance';
    const userTitle = userProfile.title || 'Executive Virtual Assistant';
    const title = `Tailored Application & Pitch — ${pitchCompany}`;

    const html = `<h2><strong>APPLICATION & OPERATIONAL PITCH</strong></h2>
<p><strong>Target:</strong> ${pitchCompany}<br />
<strong>Position:</strong> ${pitchRole}<br />
<strong>Applicant:</strong> ${userName}</p>
<hr />
<p>Dear Hiring Team at <strong>${pitchCompany}</strong>,</p>

<p>I am writing to express my enthusiastic interest in the <strong>${pitchRole}</strong> role. With over 8+ years of specialized experience supporting high-velocity founders, venture partners, and C-suite executives, I operate not merely as a task executor, but as a strategic force multiplier.</p>

<h3><strong>Why I am Uniquely Positioned to Solve ${pitchCompany}'s Challenges:</strong></h3>
<ul>
  <li><strong>Proactive Calendar & Timezone Defense:</strong> Mastered multi-continent calendar synchronization across US, EMEA, and APAC timezones, eliminating scheduling friction and protecting executive focus blocks.</li>
  <li><strong>Executive Competencies:</strong> Deep expertise in ${pitchSkills}.</li>
  <li><strong>Targeted Problem Resolution:</strong> Proven track record alleviating ${pitchPainPoint}.</li>
</ul>

<p>I bring complete technical proficiency across Google Workspace, Slack, Notion, Asana, and executive communications. I would welcome the opportunity to discuss how I can defend your team's time and drive operational momentum.</p>

<p>Thank you for your time and consideration.</p>
<br />
<p>Sincerely,<br /><strong>${userName}</strong><br />${userTitle}<br />${userProfile.email}</p>`;

    setEditorTitle(title);
    setEditorHtml(html);
    if (editorRef.current) {
      editorRef.current.innerHTML = html;
    }
    setSubTab('composer');
  };

  // Rich text formatting execCommand helper
  const formatDoc = (cmd: string, val: string = '') => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) {
      setEditorHtml(editorRef.current.innerHTML);
    }
  };

  // Insert dynamic variable pill into rich editor
  const insertVariable = (variableKey: string) => {
    let replacement = '';
    const contactName = targetClient ? targetClient.primaryContact.split(' ')[0] : 'there';
    const clientName = targetClient ? targetClient.name : 'Client';
    const hoursUsed = targetClient ? targetClient.usedHoursThisMonth : 0;
    const hoursPurchased = targetClient ? targetClient.purchasedHours : 0;
    const hoursLeft = (hoursPurchased - hoursUsed).toFixed(1);
    const userName = currentUser?.fullName || userProfile.fullName || 'Olivia Vance';

    switch (variableKey) {
      case 'client_name': replacement = clientName; break;
      case 'client_contact': replacement = contactName; break;
      case 'client_company': replacement = targetClient?.company || clientName; break;
      case 'user_name': replacement = userName; break;
      case 'user_title': replacement = userProfile.title || 'Executive Virtual Assistant'; break;
      case 'today_date': replacement = todayFormatted; break;
      case 'hours_used': replacement = `${hoursUsed} hrs`; break;
      case 'hours_left': replacement = `${hoursLeft} hrs`; break;
      case 'hourly_rate': replacement = `$${userProfile.defaultHourlyRate || 150}/hr`; break;
      default: replacement = `{{${variableKey}}}`;
    }

    document.execCommand('insertText', false, replacement);
    if (editorRef.current) {
      setEditorHtml(editorRef.current.innerHTML);
    }
  };

  const handleCopyRichText = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadMarkdown = () => {
    const text = editorRef.current ? editorRef.current.innerText : editorHtml;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editorTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'aesmart_document'}.md`;
    a.click();
  };

  const handleDownloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${editorTitle}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #1f2937; }
    h1, h2, h3 { color: #111827; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
    ul { padding-left: 20px; }
  </style>
</head>
<body>
  ${editorHtml}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${editorTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'aesmart_document'}.html`;
    a.click();
  };

  const handleSaveToVault = () => {
    const text = editorRef.current ? editorRef.current.innerText : editorHtml;
    saveGeneratedDraft({
      title: editorTitle || 'Smart Write Document',
      category: 'Smart Write',
      content: text,
      clientName: targetClient?.name || 'General'
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const wordCount = editorRef.current ? editorRef.current.innerText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = editorRef.current ? editorRef.current.innerText.length : 0;
  const readingTimeMinutes = Math.ceil(wordCount / 200) || 1;

  // Filter templates in library
  const filteredTemplates = templates.filter(tpl => {
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tpl.tags && tpl.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));

    if (!matchesSearch) return false;
    if (selectedCategory === 'favorites') return tpl.isFavorite && !tpl.isArchived;
    if (selectedCategory === 'archived') return tpl.isArchived;
    if (tpl.isArchived) return false;
    if (selectedCategory === 'all') return true;
    return tpl.category === selectedCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Main Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              AESMART WRITE STUDIO
            </span>
            <span className="text-xs text-text-muted font-medium">
              Unified Templates, Rich AI Composer & Document Vault
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">
            AESmart Write
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Produce polished executive communications, parameterized proposals, EOD recaps, and cover letters with rich text formatting and dynamic variable injection.
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-2xl border border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setSubTab('composer')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              subTab === 'composer' 
                ? 'bg-white text-text-main shadow-xs font-bold' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Smart Composer
          </button>
          <button
            onClick={() => setSubTab('library')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              subTab === 'library' 
                ? 'bg-white text-text-main shadow-xs font-bold' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            Template Library ({templates.filter(t => !t.isArchived).length})
          </button>
          <button
            onClick={() => setSubTab('pitch')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              subTab === 'pitch' 
                ? 'bg-white text-text-main shadow-xs font-bold' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
            Pitch & Cover Studio
          </button>
          <button
            onClick={() => setSubTab('drafts')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              subTab === 'drafts' 
                ? 'bg-white text-text-main shadow-xs font-bold' 
                : 'text-text-muted hover:text-text-main'
            }`}
          >
            <FolderCheck className="w-3.5 h-3.5 text-amber-600" />
            Saved Vault ({generatedDrafts.length})
          </button>
        </div>
      </div>

      {/* 1. SMART COMPOSER VIEW */}
      {subTab === 'composer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Context Controls Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Target Client Selector */}
            <div className="bg-white rounded-[24px] border border-border-subtle p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-purple-600" />
                  Target Client Context
                </label>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Live Sync
                </span>
              </div>

              <select
                value={selectedClientId}
                onChange={e => setSelectedClientId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold text-text-main focus:outline-none"
              >
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company}) — {c.status.toUpperCase()}
                  </option>
                ))}
              </select>

              {targetClient && (
                <div className="p-3 bg-[#FDFBF7] rounded-xl border border-border-subtle text-xs space-y-1.5">
                  <div className="flex justify-between text-text-muted">
                    <span>Contact:</span>
                    <strong className="text-text-main">{targetClient.primaryContact}</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Retainer Used:</span>
                    <strong className="text-purple-900 font-mono">{targetClient.usedHoursThisMonth}h / {targetClient.purchasedHours}h</strong>
                  </div>
                  <div className="flex justify-between text-text-muted">
                    <span>Active In-Flight Tasks:</span>
                    <strong className="text-emerald-800 font-mono">{inFlightTasks.length}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Template Generator Buttons */}
            <div className="bg-white rounded-[24px] border border-border-subtle p-5 shadow-xs space-y-3">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Select Composition Blueprint
              </label>

              <div className="space-y-2">
                {[
                  { id: 'eod_recap', label: 'Daily EOD Executive Recap', desc: 'End-of-day operational report' },
                  { id: 'weekly_brief', label: 'Weekly Strategic Operations Brief', desc: 'Milestone pacing & decision queue' },
                  { id: 'proposal_sow', label: 'Executive Support Proposal & SOW', desc: 'Scope of work with retainer terms' },
                  { id: 'outreach_followup', label: 'Client Follow-Up & Check-In', desc: 'Diplomatic cadence update' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => generateQuickContent(t.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      quickTemplateId === t.id
                        ? 'bg-purple-50/80 border-purple-300 text-purple-950 font-bold shadow-xs'
                        : 'bg-[#FDFBF7] border-border-subtle text-text-main hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="text-[11px] text-text-muted font-normal mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes & Actions Injection */}
            <div className="bg-white rounded-[24px] border border-border-subtle p-5 shadow-xs space-y-3">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-600" />
                Custom Injections
              </label>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Urgent Action / Decision Request
                </label>
                <input
                  type="text"
                  value={customActionItem}
                  onChange={e => setCustomActionItem(e.target.value)}
                  placeholder="e.g. Please approve flight itinerary before 4 PM"
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Special EA Observation / Note
                </label>
                <textarea
                  rows={2}
                  value={customNotes}
                  onChange={e => setCustomNotes(e.target.value)}
                  placeholder="e.g. Flight price held for next 4 hours."
                  className="w-full px-3 py-2 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs"
                />
              </div>

              <button
                onClick={() => generateQuickContent(quickTemplateId)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-text-main rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-apply Custom Injections
              </button>
            </div>

          </div>

          {/* Right Rich Text Editor Canvas (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Rich Editor Box */}
            <div className="bg-white rounded-[28px] border border-border-subtle shadow-sm overflow-hidden flex flex-col min-h-[640px]">
              
              {/* Document Title Header */}
              <div className="p-4 border-b border-border-subtle bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <input
                  type="text"
                  value={editorTitle}
                  onChange={e => setEditorTitle(e.target.value)}
                  placeholder="Document Title..."
                  className="bg-transparent text-base font-bold text-text-main focus:outline-none px-2 py-1 rounded border-b border-transparent focus:border-stone-300 w-full sm:w-80"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleCopyRichText}
                    className="px-3 py-1.5 bg-white border border-border-subtle hover:bg-stone-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 text-text-main shadow-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={handleSaveToVault}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    {saveSuccess ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
                    {saveSuccess ? 'Saved to Vault!' : 'Save Draft'}
                  </button>

                  <div className="flex items-center gap-1 border-l border-stone-300 pl-2">
                    <button
                      onClick={handleDownloadMarkdown}
                      title="Download Markdown (.md)"
                      className="p-1.5 hover:bg-stone-200/80 rounded-lg text-text-muted hover:text-text-main"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => window.print()}
                      title="Print Document / Save as PDF"
                      className="p-1.5 hover:bg-stone-200/80 rounded-lg text-text-muted hover:text-text-main"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Variables Chips Toolbar */}
              <div className="px-4 py-2 bg-purple-50/50 border-b border-purple-100 flex items-center gap-1.5 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1 mr-1">
                  <Variable className="w-3 h-3 text-purple-700" /> Insert Variable:
                </span>
                {[
                  { key: 'client_name', label: '{{client_name}}' },
                  { key: 'client_contact', label: '{{client_contact}}' },
                  { key: 'today_date', label: '{{today_date}}' },
                  { key: 'hours_used', label: '{{hours_used}}' },
                  { key: 'hours_left', label: '{{hours_left}}' },
                  { key: 'user_name', label: '{{user_name}}' },
                  { key: 'hourly_rate', label: '{{hourly_rate}}' }
                ].map(v => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVariable(v.key)}
                    className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-900 font-mono text-[10px] font-bold hover:bg-purple-100 transition-colors shadow-2xs"
                  >
                    {v.label}
                  </button>
                ))}
              </div>

              {/* Rich Text Toolbar */}
              <div className="px-4 py-2 border-b border-border-subtle bg-white flex items-center gap-1 flex-wrap text-xs text-text-muted">
                <button
                  type="button"
                  onClick={() => formatDoc('bold')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main font-bold"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('italic')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main italic"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('underline')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main"
                  title="Underline"
                >
                  <Underline className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('strikeThrough')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main"
                  title="Strikethrough"
                >
                  <Strikethrough className="w-4 h-4" />
                </button>

                <span className="h-4 w-px bg-stone-300 mx-1" />

                <button
                  type="button"
                  onClick={() => formatDoc('formatBlock', '<h2>')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main font-bold text-xs"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('formatBlock', '<h3>')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main font-bold text-xs"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('formatBlock', '<p>')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main text-xs font-semibold"
                  title="Paragraph"
                >
                  P
                </button>

                <span className="h-4 w-px bg-stone-300 mx-1" />

                <button
                  type="button"
                  onClick={() => formatDoc('insertUnorderedList')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main"
                  title="Bulleted List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('insertOrderedList')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('formatBlock', '<blockquote>')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => formatDoc('insertHorizontalRule')}
                  className="p-1.5 hover:bg-stone-100 rounded-md text-text-main"
                  title="Divider"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="h-4 w-px bg-stone-300 mx-1" />

                <button
                  type="button"
                  onClick={() => formatDoc('removeFormat')}
                  className="px-2 py-1 hover:bg-stone-100 rounded-md text-[11px] font-semibold text-text-muted"
                  title="Clear Formatting"
                >
                  Clear Format
                </button>
              </div>

              {/* Editable Content Area */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={() => {
                  if (editorRef.current) {
                    setEditorHtml(editorRef.current.innerHTML);
                  }
                }}
                className="flex-1 p-6 md:p-8 focus:outline-none font-sans text-sm text-text-main leading-relaxed space-y-4 overflow-y-auto max-h-[560px]"
                dangerouslySetInnerHTML={{ __html: editorHtml }}
              />

              {/* Footer Status Bar */}
              <div className="p-3 bg-[#FAF8F5] border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                <div className="flex items-center gap-4">
                  <span>Words: <strong className="text-text-main font-mono">{wordCount}</strong></span>
                  <span>Characters: <strong className="text-text-main font-mono">{charCount}</strong></span>
                  <span>Est. Read: <strong className="text-text-main font-mono">{readingTimeMinutes} min</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% In-Place Customizable
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* 2. TEMPLATE LIBRARY & RUNNER VIEW */}
      {subTab === 'library' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search templates by title, tag, or keyword..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-border-subtle rounded-2xl text-xs focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTemplateToEdit(null);
                  setEditorModalOpen(true);
                }}
                className="px-4 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create New Template
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar text-xs font-semibold">
            {[
              { id: 'all', label: 'All Templates' },
              { id: 'cover_letter', label: 'Cover Letters' },
              { id: 'proposal', label: 'Proposals & SOW' },
              { id: 'report', label: 'Executive Reports' },
              { id: 'onboarding', label: 'Onboarding' },
              { id: 'client_communication', label: 'Communications' },
              { id: 'favorites', label: '⭐ Favorites' },
              { id: 'archived', label: 'Archived' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-sidebar-bg text-white shadow-xs font-bold'
                    : 'bg-white text-text-muted hover:text-text-main border border-border-subtle'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map(tpl => (
              <div 
                key={tpl.id}
                className="bg-white rounded-[24px] border border-border-subtle p-5 shadow-xs flex flex-col justify-between hover:border-purple-200 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 border border-purple-100">
                      {tpl.category.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => toggleTemplateFavorite(tpl.id)}
                      className={`p-1 rounded-md transition-colors ${tpl.isFavorite ? 'text-amber-500' : 'text-stone-300 hover:text-amber-500'}`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-text-main group-hover:text-purple-950">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {tpl.description}
                  </p>

                  {tpl.tags && tpl.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {tpl.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-border-subtle flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setTemplateToEdit(tpl);
                        setEditorModalOpen(true);
                      }}
                      className="p-1.5 hover:bg-stone-100 rounded-lg text-text-muted hover:text-text-main"
                      title="Edit Template Blueprint"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateTemplate(tpl.id)}
                      className="p-1.5 hover:bg-stone-100 rounded-lg text-text-muted hover:text-text-main"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => archiveTemplate(tpl.id)}
                      className="p-1.5 hover:bg-stone-100 rounded-lg text-text-muted hover:text-rose-600"
                      title="Archive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setTemplateToRun(tpl);
                      setRunnerModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Play className="w-3 h-3 fill-current" /> Fill & Run
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* 3. PITCH & COVER LETTER STUDIO VIEW */}
      {subTab === 'pitch' && (
        <div className="bg-white rounded-[28px] border border-border-subtle p-6 md:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Targeted Career & Pitch Engine
            </span>
            <h2 className="text-xl font-bold text-text-main mt-2">Generate Tailored Pitch / Cover Letter</h2>
            <p className="text-xs text-text-muted mt-1">
              Provide job/client details to instantly generate a tailored high-impact pitch ready in the Smart Composer.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Target Organization / Prospect Company</label>
              <input
                type="text"
                value={pitchCompany}
                onChange={e => setPitchCompany(e.target.value)}
                placeholder="e.g. Sequoia Capital, OpenAI Executive Office, Benchmark"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Role / Executive Position</label>
              <input
                type="text"
                value={pitchRole}
                onChange={e => setPitchRole(e.target.value)}
                placeholder="e.g. Chief of Staff / Founding Executive Assistant"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Highlighted Core Competencies & Skills</label>
              <input
                type="text"
                value={pitchSkills}
                onChange={e => setPitchSkills(e.target.value)}
                placeholder="e.g. Calendar Defense, Global Timezone Ops, Investor Relations"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Client Pain Points / Target Objectives</label>
              <textarea
                rows={3}
                value={pitchPainPoint}
                onChange={e => setPitchPainPoint(e.target.value)}
                placeholder="e.g. Rapid timezone shifts, executive calendar congestion, disorganized document folders"
                className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={generatePitchContent}
                className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95"
              >
                <Sparkles className="w-4 h-4" /> Load Tailored Pitch Into Rich Composer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SAVED VAULT VIEW */}
      {subTab === 'drafts' && (
        <div className="bg-white rounded-[28px] border border-border-subtle p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
            <div>
              <h2 className="text-lg font-bold text-text-main">Saved Compositions & Draft Vault</h2>
              <p className="text-xs text-text-muted">Repository of saved briefings, proposals, and dispatches.</p>
            </div>
            <span className="text-xs font-mono font-bold bg-stone-100 px-3 py-1 rounded-full">
              {generatedDrafts.length} Documents
            </span>
          </div>

          {generatedDrafts.length === 0 ? (
            <div className="text-center py-12 text-text-muted space-y-2">
              <FolderCheck className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold">No saved drafts in the vault yet.</p>
              <p className="text-xs">Click "Save Draft" in the Smart Composer to archive your documents here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {generatedDrafts.map(draft => (
                <div key={draft.id} className="p-4 bg-[#FDFBF7] rounded-2xl border border-border-subtle space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-text-main">{draft.title}</h4>
                      <div className="text-[11px] text-text-muted flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{new Date(draft.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-purple-800 font-semibold">{draft.clientName || 'General'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditorTitle(draft.title);
                          setEditorHtml(draft.content.replace(/\n/g, '<br />'));
                          if (editorRef.current) {
                            editorRef.current.innerHTML = draft.content.replace(/\n/g, '<br />');
                          }
                          setSubTab('composer');
                        }}
                        className="px-3 py-1.5 bg-white border border-border-subtle hover:bg-stone-50 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-2xs"
                      >
                        <Edit className="w-3.5 h-3.5" /> Open in Composer
                      </button>
                      <button
                        onClick={() => deleteGeneratedDraft(draft.id)}
                        className="p-2 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-border-subtle font-mono text-xs text-stone-700 whitespace-pre-wrap max-h-36 overflow-y-auto">
                    {draft.content}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Modals for Template Editing & Running */}
      <TemplateEditorModal
        isOpen={editorModalOpen}
        onClose={() => setEditorModalOpen(false)}
        templateToEdit={templateToEdit}
        onSave={(data) => {
          if (templateToEdit) {
            updateTemplate(templateToEdit.id, data);
          } else {
            addTemplate(data);
          }
          setEditorModalOpen(false);
        }}
      />

      <TemplateRunnerModal
        isOpen={runnerModalOpen}
        onClose={() => setRunnerModalOpen(false)}
        template={templateToRun}
        onGenerated={(content, title) => {
          setEditorTitle(title);
          setEditorHtml(content.replace(/\n/g, '<br />'));
          if (editorRef.current) {
            editorRef.current.innerHTML = content.replace(/\n/g, '<br />');
          }
          setRunnerModalOpen(false);
          setSubTab('composer');
        }}
      />

    </div>
  );
}
