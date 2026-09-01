import React, { useState, useEffect, useRef } from "react";
import { 
  BarChart2, 
  Copy, 
  Check, 
  Send, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Sparkles, 
  Download, 
  Activity, 
  PieChart as PieIcon,
  TrendingUp,
  Target,
  ShieldCheck,
  Award,
  Layers,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Edit3,
  Printer,
  RefreshCw,
  Sliders,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { useApp } from "@/context/AppContext";

export default function Reports() {
  const { clients, tasks, timeEntries, userProfile, approvals } = useApp();

  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [activeViewMode, setActiveViewMode] = useState<'interactive_editor' | 'preview_document'>('interactive_editor');
  const [copied, setCopied] = useState(false);

  const client = clients.find(c => c.id === selectedClientId) || clients[0];

  const clientTasks = tasks.filter(t => t.clientId === selectedClientId);
  const completedTasks = clientTasks.filter(t => t.status === 'completed');
  const inFlightTasks = clientTasks.filter(t => t.status === 'in_progress' || t.status === 'todo');

  const clientTime = timeEntries.filter(t => t.clientId === selectedClientId);
  const totalMinutes = clientTime.reduce((acc, t) => acc + (t.durationMinutes || 0), 0);
  const hoursSpent = (totalMinutes / 60).toFixed(1);

  const purchased = client?.purchasedHours || 20;
  const used = client?.usedHoursThisMonth || 12;
  const remaining = Math.max(0, purchased - used);
  const burnPct = purchased > 0 ? Math.round((used / purchased) * 100) : 0;

  const clientApprovals = approvals.filter(a => a.clientId === selectedClientId);
  const approvedItems = clientApprovals.filter(a => a.status === 'approved');

  // Custom inputs for Weekly Briefing
  const [weeklyAccomplishments, setWeeklyAccomplishments] = useState<string>('');
  const [weeklyInFlight, setWeeklyInFlight] = useState<string>('');
  const [weeklyBlockers, setWeeklyBlockers] = useState<string>('No blockers. Operational bandwidth clear.');
  const [weeklyNextSteps, setWeeklyNextSteps] = useState<string>('Finalize weekly sprint review and confirm next milestone priorities.');

  // Custom inputs for Monthly Summary
  const [monthlyPerformance, setMonthlyPerformance] = useState<string>('Operations executed with 100% on-time cadence. Calendar defense saved an estimated 14 executive hours.');
  const [monthlyAchievements, setMonthlyAchievements] = useState<string>('');
  const [monthlyUsageNotes, setMonthlyUsageNotes] = useState<string>('Retainer utilization reached healthy target with zero overages.');
  const [monthlyRecommendations, setMonthlyRecommendations] = useState<string>('1. Implement automated recurring vendor contract renewals.\n2. Expand async status reporting to cross-functional leads.\n3. Maintain current 20-hour retainer tier for upcoming sprint cycle.');

  // Full in-place editable text document
  const [customReportDoc, setCustomReportDoc] = useState<string>('');
  const [isManualDocEdited, setIsManualDocEdited] = useState<boolean>(false);

  // Sync state whenever client, report type, or tasks change
  useEffect(() => {
    if (completedTasks.length > 0) {
      setWeeklyAccomplishments(completedTasks.map(t => `• ${t.title} (${t.priority.toUpperCase()} priority)`).join('\n'));
      setMonthlyAchievements(completedTasks.map((t, idx) => `${idx + 1}. ${t.title} — Verified & Shipped`).join('\n'));
    } else {
      setWeeklyAccomplishments('• Maintained proactive calendar defense and zero-inbox triage protocol.\n• Standardized client workspace document naming conventions.');
      setMonthlyAchievements('1. Completed end-to-end operational systems overhaul.\n2. Coordinated quarterly board sync across 3 global timezones.\n3. Audited and organized Google Drive document infrastructure.');
    }

    if (inFlightTasks.length > 0) {
      setWeeklyInFlight(inFlightTasks.slice(0, 4).map(t => `• ${t.title} (Target: ${t.dueDate || 'Next Sprint'})`).join('\n'));
    } else {
      setWeeklyInFlight('• Preparing upcoming milestone review and sprint deliverables.');
    }
  }, [selectedClientId, reportType]);

  // Generate complete document text
  const generateBaseDocumentText = () => {
    if (!client) return '';
    const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const renewalDate = new Date();
    renewalDate.setMonth(renewalDate.getMonth() + 1);
    renewalDate.setDate(1);
    const renewalStr = renewalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (reportType === 'weekly') {
      return `========================================================================
WEEKLY EXECUTIVE BRIEFING: ${client.name.toUpperCase()} (${client.company})
Status: AUTO-GENERATED (FRIDAY EOS CADENCE)
Prepared by: ${userProfile.fullName} (${userProfile.title})
Date: ${todayDate} • Reporting Window: 7 Operating Days
========================================================================

1. 🏆 ACCOMPLISHMENTS & SHIPPED DELIVERABLES
------------------------------------------------------------------------
${weeklyAccomplishments}

2. 🔄 IN-FLIGHT TASKS & ACTIVE PACING
------------------------------------------------------------------------
${weeklyInFlight}

3. ⚠️ BLOCKERS, DEPENDENCIES & RISKS
------------------------------------------------------------------------
${weeklyBlockers}

4. 🚀 NEXT STEPS & IMMEDIATE FOCUS
------------------------------------------------------------------------
${weeklyNextSteps}

5. ⏳ RETAINER HEALTH & CAPACITY AUDIT
------------------------------------------------------------------------
• Retainer Used This Month: ${used}.0 hrs / ${purchased}.0 hrs (${burnPct}%)
• Available Balance: ${remaining}.0 hrs
• Burn Rate Status: ON TRACK (Normal pacing)

------------------------------------------------------------------------
Confidential • Prepared with AEDMIN Executive Operating System`;
    }

    // Monthly Summary
    return `========================================================================
MONTHLY EXECUTIVE PERFORMANCE & RETAINER SUMMARY
Status: AUTO-GENERATED (2 DAYS PRIOR TO RETAINER RENEWAL: ${renewalStr})
Client Partner: ${client.name.toUpperCase()} (${client.company})
Prepared by: ${userProfile.fullName} (${userProfile.title})
Reporting Cycle: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
========================================================================

1. 📈 HIGH-LEVEL EXECUTIVE PERFORMANCE & STRATEGIC ROI
------------------------------------------------------------------------
${monthlyPerformance}

2. 🎖️ KEY ACHIEVEMENTS & MILESTONES DELIVERED
------------------------------------------------------------------------
${monthlyAchievements}

3. ⏳ RETAINER USAGE & VELOCITY BREAKDOWN
------------------------------------------------------------------------
• Monthly Allocation: ${purchased}.00 Hours
• Consumed Hours This Period: ${used}.00 Hours (${burnPct}% utilization)
• Net Remaining Balance: ${remaining}.00 Hours
• Retainer Fee: $${(client.monthlyRetainerFee || 0).toLocaleString()} USD
• Usage Notes: ${monthlyUsageNotes}

4. 💡 STRATEGIC RECOMMENDATIONS FOR NEXT MONTH
------------------------------------------------------------------------
${monthlyRecommendations}

5. 📅 RENEWAL & NEXT BILLING CYCLE
------------------------------------------------------------------------
• Next Renewal Date: ${renewalStr}
• Planned Allocation: ${purchased}.00 Hours
• Recommended Focus: High-leverage operational scaling, calendar hygiene, and stakeholder alignment.

------------------------------------------------------------------------
Confidential • Prepared with AEDMIN Executive Operating System`;
  };

  const finalReportText = isManualDocEdited ? customReportDoc : generateBaseDocumentText();

  const handleCopy = () => {
    navigator.clipboard.writeText(finalReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([finalReportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${reportType}_report_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
  };

  const handleDownloadHTML = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${reportType === 'weekly' ? 'Weekly Executive Briefing' : 'Monthly Performance Summary'} - ${client.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 20px; color: #111827; }
    h1 { font-size: 22px; border-bottom: 2px solid #111827; padding-bottom: 8px; }
    h2 { font-size: 16px; margin-top: 24px; color: #1f2937; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    pre { background: #f9fafb; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; font-size: 13px; font-family: monospace; white-space: pre-wrap; }
    .badge { display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #3730a3; border-radius: 9999px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="badge">${reportType.toUpperCase()} REPORT</div>
  <h1>${client.name} &mdash; ${reportType === 'weekly' ? 'Weekly Executive Briefing' : 'Monthly Retainer Summary'}</h1>
  <pre>${finalReportText}</pre>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${reportType}_report_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
  };

  // Weekly effort data (7-day distribution)
  const weeklyEffortData = [
    { day: 'Mon', hours: 3.5, label: 'Deep Work' },
    { day: 'Tue', hours: 4.0, label: 'Execution' },
    { day: 'Wed', hours: 2.5, label: 'Review' },
    { day: 'Thu', hours: 5.0, label: 'Milestone' },
    { day: 'Fri', hours: 3.0, label: 'Ops Wrap' },
    { day: 'Sat', hours: 0.0, label: 'Off' },
    { day: 'Sun', hours: 0.0, label: 'Off' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Top Main Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold tracking-wide flex items-center gap-1.5 shadow-xs">
              <BarChart2 className="w-3.5 h-3.5 text-blue-700" />
              EXECUTIVE REPORTING ENGINE
            </span>
            <span className="text-xs text-text-muted font-medium">
              Weekly EoS Briefings & Monthly Pre-Renewal Summaries
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5">
            Executive Reports & Analytics
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Auto-generate Friday End-of-Shift briefings and Monthly retainer performance reviews with 100% in-place customization.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-stone-50 text-text-main rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Report'}
          </button>
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2.5 bg-white border border-border-subtle hover:bg-stone-50 text-text-main rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Download Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5" />
            Download MD
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Cadence Selection & Auto-Generation Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Weekly Briefing Selector Card */}
        <div 
          onClick={() => {
            setReportType('weekly');
            setIsManualDocEdited(false);
          }}
          className={`p-5 rounded-[24px] border transition-all cursor-pointer ${
            reportType === 'weekly' 
              ? 'bg-blue-50/70 border-blue-300 shadow-xs ring-2 ring-blue-500/20' 
              : 'bg-white border-border-subtle hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
              WEEKLY BRIEFING
            </span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" /> Auto-Generated Every Friday EoS
            </span>
          </div>

          <h3 className="text-base font-bold text-text-main mt-3">Weekly Operational Briefing</h3>
          <p className="text-xs text-text-muted mt-1">
            Focuses on weekly accomplishments, in-flight sprint pacing, blockers/risks, and next steps.
          </p>

          <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between text-xs text-text-muted">
            <span>Next Auto-Trigger: <strong>Friday 5:00 PM EoS</strong></span>
            <span className="text-blue-700 font-bold">Active Cadence</span>
          </div>
        </div>

        {/* Monthly Summary Selector Card */}
        <div 
          onClick={() => {
            setReportType('monthly');
            setIsManualDocEdited(false);
          }}
          className={`p-5 rounded-[24px] border transition-all cursor-pointer ${
            reportType === 'monthly' 
              ? 'bg-purple-50/70 border-purple-300 shadow-xs ring-2 ring-purple-500/20' 
              : 'bg-white border-border-subtle hover:bg-stone-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
              MONTHLY SUMMARY
            </span>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-purple-600" /> 2 Days Before Renewal
            </span>
          </div>

          <h3 className="text-base font-bold text-text-main mt-3">Monthly Retainer & Performance Review</h3>
          <p className="text-xs text-text-muted mt-1">
            Highlights overall performance, milestones, retainer allocation breakdown, and strategic recommendations for next month.
          </p>

          <div className="mt-3 pt-3 border-t border-purple-200/60 flex items-center justify-between text-xs text-text-muted">
            <span>Renewal Cadence: <strong>1st of Month (-2 Days)</strong></span>
            <span className="text-purple-700 font-bold">Active Cadence</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Controls + Live Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 cols): Context & Metrics */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Client Workspace Selector */}
          <div className="bg-white p-5 rounded-[24px] border border-border-subtle shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Target Client Workspace
              </label>
              <span className="text-[10px] font-mono font-bold bg-stone-100 px-2 py-0.5 rounded">
                Live Data
              </span>
            </div>

            <select
              value={selectedClientId}
              onChange={e => {
                setSelectedClientId(e.target.value);
                setIsManualDocEdited(false);
              }}
              className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-semibold text-text-main focus:outline-none"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.company})
                </option>
              ))}
            </select>

            {client && (
              <div className="p-3.5 bg-[#FDFBF7] rounded-xl border border-border-subtle text-xs space-y-2">
                <div className="flex justify-between text-text-muted">
                  <span>Primary Stakeholder:</span>
                  <strong className="text-text-main">{client.primaryContact}</strong>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Retainer Health:</span>
                  <strong className="text-blue-900 font-mono">{used}h / {purchased}h ({burnPct}%)</strong>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Completed Tasks:</span>
                  <strong className="text-emerald-800 font-mono">{completedTasks.length} tasks</strong>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Contract Retainer Fee:</span>
                  <strong className="text-text-main font-mono">${(client.monthlyRetainerFee || 0).toLocaleString()}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Effort & Capacity Metric Visualizer */}
          <div className="bg-white p-5 rounded-[24px] border border-border-subtle shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-main flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Capacity & Pacing Velocity
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {reportType.toUpperCase()}
              </span>
            </h3>

            <div className="h-[160px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyEffortData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} unit="h" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                  />
                  <Bar dataKey="hours" name="Hours Spent" fill="#111827" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-center gap-4 text-xs font-semibold pt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
                <span className="text-text-muted">Used: {used}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-text-muted">Available: {remaining}h</span>
              </div>
            </div>
          </div>

          {/* Quick Section Reset / Regenerate */}
          <button
            onClick={() => setIsManualDocEdited(false)}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-text-main rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-sync Live Tasks into Report
          </button>

        </div>

        {/* Right Column (8 cols): Interactive In-Place Editor & Preview Canvas */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="bg-white rounded-[28px] border border-border-subtle shadow-xs overflow-hidden flex flex-col">
            
            {/* View Mode Switcher Header */}
            <div className="p-4 border-b border-border-subtle bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-main">
                  {reportType === 'weekly' ? 'Weekly Executive Briefing Canvas' : 'Monthly Performance Review Canvas'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  100% In-Place Editable
                </span>
              </div>

              <div className="flex items-center bg-stone-200/70 p-0.5 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveViewMode('interactive_editor')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeViewMode === 'interactive_editor'
                      ? 'bg-white text-text-main shadow-xs font-bold'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  <Sliders className="w-3 h-3" /> Section Form Editor
                </button>
                <button
                  onClick={() => {
                    if (!isManualDocEdited) {
                      setCustomReportDoc(generateBaseDocumentText());
                    }
                    setActiveViewMode('preview_document');
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    activeViewMode === 'preview_document'
                      ? 'bg-white text-text-main shadow-xs font-bold'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  <FileText className="w-3 h-3" /> Full Text Canvas
                </button>
              </div>
            </div>

            {/* 1. INTERACTIVE SECTION FORM EDITOR */}
            {activeViewMode === 'interactive_editor' && (
              <div className="p-6 md:p-8 space-y-6">
                
                {reportType === 'weekly' ? (
                  /* WEEKLY BRIEFING FORM SECTIONS */
                  <div className="space-y-5">
                    
                    {/* Section 1: Accomplishments */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        1. Weekly Accomplishments & Shipped Deliverables
                      </label>
                      <textarea
                        rows={4}
                        value={weeklyAccomplishments}
                        onChange={e => setWeeklyAccomplishments(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Bullet points of completed deliverables..."
                      />
                    </div>

                    {/* Section 2: In-Flight Tasks */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        2. In-Flight Tasks & Active Sprint Pacing
                      </label>
                      <textarea
                        rows={3}
                        value={weeklyInFlight}
                        onChange={e => setWeeklyInFlight(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Active tasks and target dates..."
                      />
                    </div>

                    {/* Section 3: Blockers / Risks */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        3. Blockers, Dependencies & Risks
                      </label>
                      <textarea
                        rows={2}
                        value={weeklyBlockers}
                        onChange={e => setWeeklyBlockers(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Blockers requiring client or vendor decisions..."
                      />
                    </div>

                    {/* Section 4: Next Steps */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-purple-600" />
                        4. Next Steps & Immediate Priorities
                      </label>
                      <textarea
                        rows={2}
                        value={weeklyNextSteps}
                        onChange={e => setWeeklyNextSteps(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Next sprint kickoff objectives..."
                      />
                    </div>

                  </div>
                ) : (
                  /* MONTHLY SUMMARY FORM SECTIONS */
                  <div className="space-y-5">
                    
                    {/* Section 1: Executive Performance */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        1. High-Level Executive Performance & Strategic ROI
                      </label>
                      <textarea
                        rows={3}
                        value={monthlyPerformance}
                        onChange={e => setMonthlyPerformance(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Summary of monthly operational throughput and business ROI..."
                      />
                    </div>

                    {/* Section 2: Key Achievements */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-blue-600" />
                        2. Key Achievements & Milestones Delivered
                      </label>
                      <textarea
                        rows={4}
                        value={monthlyAchievements}
                        onChange={e => setMonthlyAchievements(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Numbered list of verified milestones..."
                      />
                    </div>

                    {/* Section 3: Retainer Usage */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-purple-600" />
                        3. Retainer Usage & Velocity Breakdown Notes
                      </label>
                      <textarea
                        rows={2}
                        value={monthlyUsageNotes}
                        onChange={e => setMonthlyUsageNotes(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Retainer balance notes, pacing comments, and overage assessments..."
                      />
                    </div>

                    {/* Section 4: Strategic Recommendations */}
                    <div>
                      <label className="block text-xs font-bold text-text-main uppercase mb-1.5 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-600" />
                        4. Strategic Recommendations for Next Month
                      </label>
                      <textarea
                        rows={3}
                        value={monthlyRecommendations}
                        onChange={e => setMonthlyRecommendations(e.target.value)}
                        className="w-full p-3.5 bg-[#FDFBF7] border border-border-subtle rounded-xl text-xs font-sans focus:outline-none"
                        placeholder="Actionable recommendations and capacity suggestions for upcoming cycle..."
                      />
                    </div>

                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setCustomReportDoc(generateBaseDocumentText());
                      setActiveViewMode('preview_document');
                    }}
                    className="px-5 py-2.5 bg-sidebar-bg hover:bg-sidebar-active text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Formatted Output Document
                  </button>
                </div>

              </div>
            )}

            {/* 2. FULL TEXT DIRECT CANVAS */}
            {activeViewMode === 'preview_document' && (
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between text-xs text-text-muted pb-1">
                  <span>Direct In-Place Monospace Text Editor</span>
                  <span>Character edits will be preserved on export</span>
                </div>

                <textarea
                  rows={20}
                  value={finalReportText}
                  onChange={e => {
                    setCustomReportDoc(e.target.value);
                    setIsManualDocEdited(true);
                  }}
                  className="w-full p-5 bg-[#FDFBF7] border border-border-subtle rounded-2xl font-mono text-xs text-text-main leading-relaxed focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
