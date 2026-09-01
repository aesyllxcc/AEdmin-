import { useState } from "react";
import { 
  ArrowUpRight, 
  Clock, 
  Globe,
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Users, 
  TrendingUp, 
  Plus, 
  Play, 
  FileText, 
  DollarSign, 
  ChevronRight, 
  Activity, 
  Sparkles,
  Zap,
  Eye,
  Check,
  RotateCw,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Copy,
  ExternalLink,
  Circle,
  HelpCircle,
  Share2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid 
} from "recharts";
import { useApp } from "@/context/AppContext";
import { TaskModal } from "@/components/modals/TaskModal";
import { TimeModal } from "@/components/modals/TimeModal";
import { Task } from "@/types";
import { getClientLiveTime, getClientEffectiveLocation, parseTimeToMinutes, formatMinutesToTime, getFreelancerLiveTimeInfo } from "@/utils/timezoneUtils";

export default function CommandCenter() {
  const navigate = useNavigate();
  const { 
    userProfile, 
    tasks, 
    clients, 
    invoices, 
    timeEntries, 
    approvals, 
    opportunities,
    rateCalculator,
    startTimer, 
    toggleTaskStatus,
    setPortalClientId
  } = useApp();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'urgent' | 'today' | 'approvals' | 'all'>('urgent');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Active Clients & Calculations
  const activeClients = clients.filter(c => c.status === 'active');
  const totalPurchasedHours = activeClients.reduce((acc, c) => acc + (c.purchasedHours || 0), 0);
  const totalUsedHours = activeClients.reduce((acc, c) => acc + (c.usedHoursThisMonth || 0), 0);
  const retainerUsagePercent = totalPurchasedHours > 0 ? Math.round((totalUsedHours / totalPurchasedHours) * 100) : 0;

  // Monthly Recurring Revenue & Annual Run-Rate (CEO metrics)
  const currentMRR = activeClients.reduce((acc, c) => acc + (c.monthlyRetainerFee || 0), 0);
  const annualizedRunRate = (currentMRR || 0) * 12;
  const targetAnnual = rateCalculator?.targetAnnualIncome || 180000;
  const annualPacingPercent = Math.min(100, Math.round((annualizedRunRate / (targetAnnual || 1)) * 100));

  // Operating cash and runway
  const estimatedOperatingCash = 42500;
  const monthlyOverhead = rateCalculator?.monthlyExpenses || 1200;
  const runwayMonths = (estimatedOperatingCash / (monthlyOverhead || 1)).toFixed(1);

  // Studio Capacity
  const maxMonthlyCapacity = (rateCalculator?.billableHoursPerWeek || 25) * 4;
  const capacityUtilizationPercent = maxMonthlyCapacity > 0 ? Math.round((totalPurchasedHours / maxMonthlyCapacity) * 100) : 0;

  // Client concentration
  const maxClientRevenue = Math.max(...activeClients.map(c => c.monthlyRetainerFee || 0), 0);
  const largestClient = activeClients.find(c => (c.monthlyRetainerFee || 0) === maxClientRevenue);
  const largestClientConcentration = currentMRR > 0 ? Math.round((maxClientRevenue / currentMRR) * 100) : 0;
  const isHighConcentrationRisk = largestClientConcentration > 50;

  // Pipeline summary
  const weightedPipeline = opportunities
    .filter(o => o.stage !== 'lost' && o.stage !== 'won')
    .reduce((acc, o) => acc + ((o.estimatedValue || 0) * ((o.confidencePercentage || 0) / 100)), 0);

  // Approvals & Tasks
  const pendingApprovals = approvals.filter(a => a.status === 'pending');
  const activeTasks = tasks.filter(t => !t.isArchived && t.status !== 'completed');
  const urgentTasks = [...activeTasks].sort((a, b) => (b.calculatedScore || 0) - (a.calculatedScore || 0));
  const todayTasks = activeTasks.filter(t => t.dueDate === todayStr || t.status === 'in_progress');

  // Filtered deliverables list
  const filteredTasks = taskFilter === 'urgent' 
    ? urgentTasks.slice(0, 5)
    : taskFilter === 'today'
    ? (todayTasks.length > 0 ? todayTasks.slice(0, 5) : urgentTasks.slice(0, 5))
    : activeTasks.slice(0, 5);

  // MRR Trajectory Data
  const mrrTrajectoryData = [
    { month: 'Oct', mrr: 11200, target: 12500 },
    { month: 'Nov', mrr: 12800, target: 13000 },
    { month: 'Dec', mrr: 14500, target: 14000 },
    { month: 'Jan', mrr: 15200, target: 15000 },
    { month: 'Feb', mrr: 16800, target: 16000 },
    { month: 'Mar (Now)', mrr: currentMRR > 0 ? currentMRR : 17500, target: 17000 }
  ];

  // Dynamic Schedule Defense timeline blocks based on configured working hours
  const workStartM = parseTimeToMinutes(userProfile.workingHoursStart || '08:30');
  const workEndM = parseTimeToMinutes(userProfile.workingHoursEnd || '17:30');
  const endShiftM = parseTimeToMinutes(userProfile.endOfShiftWindowStart || userProfile.endOfShiftTime || '17:00');

  const todayBlocks = [
    { 
      time: `${formatMinutesToTime(workStartM)} - ${formatMinutesToTime(workStartM + 45)}`, 
      title: "Morning Triage & Executive Calendar Defense", 
      client: "Internal SOP", 
      status: "completed", 
      color: "bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]" 
    },
    { 
      time: `${formatMinutesToTime(workStartM + 60)} - ${formatMinutesToTime(workStartM + 180)}`, 
      title: "Arkgate Ventures: LP Presentation Deck Sprint", 
      client: "Arkgate Ventures", 
      status: "completed", 
      color: "bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]" 
    },
    { 
      time: `${formatMinutesToTime(workStartM + 180)} - ${formatMinutesToTime(workStartM + 240)}`, 
      title: "Midday Client Communications & Approvals", 
      client: "Internal Operations", 
      status: "in_progress", 
      color: "bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]" 
    },
    { 
      time: `${formatMinutesToTime(workStartM + 300)} - ${formatMinutesToTime(workStartM + 420)}`, 
      title: "Wayne Tech: AI Workflow & Security Automation", 
      client: "Wayne Tech Corp", 
      status: "upcoming", 
      color: "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]" 
    },
    { 
      time: `${formatMinutesToTime(endShiftM)} - ${formatMinutesToTime(workEndM)}`, 
      title: "AEDMIN EOD Wrap-Up & Client Recaps Dispatch", 
      client: "Internal Studio", 
      status: "upcoming", 
      color: "bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]" 
    }
  ];

  const handleCopyPortalLink = (client: any) => {
    const token = client.portalToken || client.id;
    const url = `${window.location.origin}/portal/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(client.id);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const greetingTime = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Hero Greeting with Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#18191D] text-white">
              Studio Command Center
            </span>
            <span className="text-xs text-[#797E8B] font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#18191D] mt-2">
            {greetingTime()}, {userProfile.fullName.split(' ')[0]}.
          </h1>
          <p className="text-xs sm:text-sm text-[#797E8B] mt-1 font-medium">
            Executive studio overview at a glance: <strong>${currentMRR.toLocaleString()}/mo MRR</strong>, <strong>{runwayMonths} months</strong> liquid runway, and <strong>{activeTasks.length} queued deliverables</strong> across {activeClients.length} active retainers.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTimeModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-[#ECE6DD] hover:bg-[#FAF7F2] text-[#18191D] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            Log Time
          </button>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        </div>
      </div>

      {/* 2. Top 4 High-Impact Executive Bento Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Lemon Bento Card: MRR & Annual Run-Rate */}
        <div className="bg-[#FEF9C3] border border-[#FEF08A] rounded-[28px] p-5.5 relative overflow-hidden flex flex-col justify-between min-h-[175px] shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E]">
                Monthly Recurring (MRR)
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-yellow-300/80 text-[#854D0E]">
                +48% YoY
              </span>
            </div>
            
            <div className="mt-3">
              <div className="text-3xl font-black text-[#18191D]">
                ${currentMRR.toLocaleString()}<span className="text-sm font-semibold text-[#854D0E]">/mo</span>
              </div>
              <div className="text-xs text-[#854D0E] font-medium mt-1">
                Run-rate: <strong>${annualizedRunRate.toLocaleString()}/yr</strong> ({annualPacingPercent}% of ${targetAnnual/1000}k goal)
              </div>
            </div>
          </div>

          <div className="w-full bg-yellow-300/60 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-[#CA8A04] h-full rounded-full" style={{ width: `${annualPacingPercent}%` }} />
          </div>
        </div>

        {/* Lilac Bento Card: Studio Capacity & Workload */}
        <div className="bg-[#EDE9FE] border border-[#DDD6FE] rounded-[28px] p-5.5 relative overflow-hidden flex flex-col justify-between min-h-[175px] shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B21B6]">
                Studio Capacity
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-200 text-[#5B21B6]">
                {totalPurchasedHours}h Booked
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-black text-[#18191D]">
                {capacityUtilizationPercent}%
              </div>
              <div className="text-xs text-[#5B21B6] font-medium mt-1">
                {totalUsedHours.toFixed(1)}h logged this mo • {Math.max(0, maxMonthlyCapacity - totalPurchasedHours)}h buffer open
              </div>
            </div>
          </div>

          <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden mt-3">
            <div className="bg-[#7C3AED] h-full rounded-full" style={{ width: `${capacityUtilizationPercent}%` }} />
          </div>
        </div>

        {/* Mint Bento Card: Operating Runway & Cash Reserves */}
        <div className="bg-[#DCFCE7] border border-[#BBF7D0] rounded-[28px] p-5.5 relative overflow-hidden flex flex-col justify-between min-h-[175px] shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">
                Operating Runway
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-200 text-[#166534]">
                Zero-Debt Posture
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-black text-[#18191D]">
                {runwayMonths} <span className="text-base font-bold text-[#166534]">Months</span>
              </div>
              <div className="text-xs text-[#166534] font-medium mt-1">
                ${estimatedOperatingCash.toLocaleString()} liquid cash reserves (${monthlyOverhead}/mo burn)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold text-[#166534] mt-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Strong Solopreneur Fortress
          </div>
        </div>

        {/* Sky Bento Card: Client Concentration & Pipeline */}
        <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-[28px] p-5.5 relative overflow-hidden flex flex-col justify-between min-h-[175px] shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0369A1]">
                Retainers & Pipeline
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-200 text-[#0369A1]">
                {activeClients.length} Retainers
              </span>
            </div>

            <div className="mt-3">
              <div className="text-3xl font-black text-[#18191D]">
                ${Math.round(weightedPipeline/1000)}k <span className="text-xs font-semibold text-[#0369A1]">Pipeline</span>
              </div>
              <div className="text-xs text-[#0369A1] font-medium mt-1">
                Top Client: <strong>{largestClient?.code || 'None'} ({largestClientConcentration}% MRR)</strong>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-bold text-[#0369A1] mt-3">
            {isHighConcentrationRisk ? '⚠️ High client concentration' : '✓ Well-diversified client base'}
          </div>
        </div>

      </div>

      {/* Global Times Quick Telemetry Banner */}
      <div className="bg-white p-4.5 rounded-[28px] border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#18191D]">Global Times Radar</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Live client timezones & operating windows synchronized with your local HQ
            </p>
          </div>
        </div>

        {/* Live mini clocks scrollable row */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {activeClients.map(c => {
            const live = getClientLiveTime(c, new Date(), userProfile.defaultTimezone || 'America/New_York');
            const loc = getClientEffectiveLocation(c);
            return (
              <div 
                key={c.id} 
                className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#ECE6DD] flex items-center gap-2 shrink-0 text-xs"
              >
                <span className="text-sm">{loc.flagEmoji}</span>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-[#18191D]">{c.code}</span>
                    <span className="text-[10px] text-stone-400 font-mono">({live.timeDiffLabel.split(' ')[0]})</span>
                  </div>
                  <div className="font-mono font-black text-stone-800 text-[11px]">
                    {live.timeStr.split(' ')[0]} <span className="text-[9px] text-purple-700">{live.timeStr.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/global-times"
            className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1 transition-colors shrink-0 border border-purple-200"
          >
            <span>Open Global Times</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Main Split Section: Operational Radar & Intelligence (Left) + Schedule Defense & Public Portals (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Operational Deliverables, MRR Curve, and Client Revenue Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Action Radar: Priority Deliverables */}
          <div className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ECE6DD]">
              <div>
                <h2 className="text-sm font-bold text-[#18191D] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-current" /> Immediate Priority Radar
                </h2>
                <p className="text-xs text-[#797E8B]">High-leverage deliverables requiring executive execution</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-full border border-[#ECE6DD]">
                {[
                  { id: 'urgent', label: 'Top Urgent' },
                  { id: 'today', label: `Today (${todayTasks.length})` },
                  { id: 'all', label: `All (${activeTasks.length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTaskFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      taskFilter === tab.id 
                        ? 'bg-[#18191D] text-white shadow-2xs' 
                        : 'text-[#797E8B] hover:text-[#18191D]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Task Items */}
            <div className="space-y-2.5">
              {filteredTasks.map(task => {
                const client = clients.find(c => c.id === task.clientId);
                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#ECE6DD] hover:border-black/30 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-[#D5CFCE] hover:text-[#10B981] transition-colors shrink-0"
                      >
                        <Circle className="w-4 h-4" />
                      </button>

                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#18191D] truncate group-hover:text-black">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#797E8B]">
                          <span className="font-semibold text-[#18191D]">{client?.name || task.clientName}</span>
                          <span>• Due: {task.dueDate}</span>
                          {task.priority === 'urgent' && (
                            <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => startTimer({ clientId: task.clientId, taskId: task.id, notes: `${client?.name || ''}: ${task.title}` })}
                      className="p-2 rounded-full bg-white border border-[#ECE6DD] text-[#797E8B] hover:text-[#10B981] hover:border-[#10B981] transition-colors shrink-0 shadow-2xs"
                      title="Start Session Timer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="py-8 text-center text-xs text-[#797E8B]">
                  No deliverables currently match this filter. Clear to proceed with deep work.
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#797E8B]">
              <span>Pending approvals waiting on clients: <strong className="text-[#18191D]">{pendingApprovals.length}</strong></span>
              <Link to="/operations" className="font-bold text-[#18191D] hover:underline flex items-center gap-1">
                View All Operations <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 6-Month MRR Growth Trajectory Chart (Merged from CEO Dashboard) */}
          <div className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-sm font-bold text-[#18191D]">MRR Growth Trajectory & Target Pacing</h3>
                <p className="text-xs text-[#797E8B]">6-month recurring revenue curve vs target trajectory</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#DCFCE7] text-[#166534] font-bold text-xs border border-[#BBF7D0]">
                Target: ${targetAnnual/1000}k/yr
              </span>
            </div>

            <div className="h-[200px] w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mrrTrajectoryData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrGradientDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#18191D" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#18191D" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ECE6DD" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#797E8B' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#797E8B' }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18191D', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="mrr" name="Actual MRR" stroke="#18191D" strokeWidth={3} fillOpacity={1} fill="url(#mrrGradientDash)" />
                  <Area type="monotone" dataKey="target" name="Target MRR" stroke="#CA8A04" strokeWidth={2} strokeDasharray="4 4" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Client Revenue Distribution & Yield Matrix */}
          <div className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-sm font-bold text-[#18191D]">Client Retainer Revenue & Yield Matrix</h3>
                <p className="text-xs text-[#797E8B]">Monthly billing breakdown and effective hourly yield</p>
              </div>
              <span className="text-xs font-bold text-[#18191D]">Total: ${currentMRR.toLocaleString()}/mo</span>
            </div>

            <div className="space-y-3">
              {activeClients.map(c => {
                const monthlyFee = c.monthlyRetainerFee || 0;
                const purchasedHrs = c.purchasedHours || 0;
                const hourly = c.hourlyRate || 0;
                const clientShare = currentMRR > 0 ? Math.round((monthlyFee / currentMRR) * 100) : 0;
                const effectiveHourly = purchasedHrs > 0 ? Math.round(monthlyFee / purchasedHrs) : hourly;

                return (
                  <div key={c.id} className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-xl ${c.avatarColor || 'bg-[#FEF9C3]'} flex items-center justify-center font-bold text-xs text-[#18191D]`}>
                          {c.code}
                        </div>
                        <span className="font-bold text-xs text-[#18191D]">{c.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#797E8B]">{clientShare}% of MRR</span>
                        <span className="font-mono font-bold text-xs text-[#18191D]">${monthlyFee.toLocaleString()}/mo</span>
                      </div>
                    </div>

                    <div className="w-full bg-[#ECE6DD] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#18191D] h-full rounded-full" style={{ width: `${clientShare}%` }} />
                    </div>

                    <div className="flex justify-between text-[10px] text-[#797E8B] pt-0.5">
                      <span>{c.usedHoursThisMonth.toFixed(1)}h / {purchasedHrs}h hours used</span>
                      <span>Effective yield: <strong className="text-[#18191D]">${effectiveHourly}/hr</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Today's Schedule Defense & Direct Client Public Portals Hub (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Schedule Defense Timeline */}
          <div className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#18191D]">Schedule Defense</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#797E8B] border border-[#ECE6DD]">
                    {userProfile.workingHoursStart || '08:30'} - {userProfile.workingHoursEnd || '17:30'}
                  </span>
                </div>
                <p className="text-xs text-[#797E8B]">Today's protected operating blocks • {userProfile.timezone?.split('/').pop()?.replace('_', ' ') || 'HQ Local'}</p>
              </div>
              <Link to="/workday" className="text-xs font-bold text-[#18191D] hover:underline">
                Full Schedule →
              </Link>
            </div>

            <div className="space-y-2.5">
              {todayBlocks.map((block, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${block.color}`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold block opacity-80">{block.time}</span>
                    <h4 className="text-xs font-bold text-[#18191D] mt-0.5">{block.title}</h4>
                    <span className="text-[10px] font-medium opacity-80 block mt-0.5">{block.client}</span>
                  </div>

                  {block.status === 'in_progress' ? (
                    <button
                      onClick={() => startTimer({ notes: block.title })}
                      className="px-2.5 py-1 bg-[#18191D] text-white rounded-full text-[10px] font-bold shrink-0 flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Active
                    </button>
                  ) : block.status === 'completed' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70 text-[#166534] shrink-0">
                      ✓ Done
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 text-[#797E8B] shrink-0">
                      Upcoming
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Unique Client Public Portals Hub */}
          <div className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div>
                <h3 className="text-sm font-bold text-[#18191D] flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-[#5B21B6]" /> Client Public Portals
                </h3>
                <p className="text-xs text-[#797E8B]">Unique, standalone public links for each client workspace</p>
              </div>
            </div>

            <div className="space-y-3">
              {activeClients.map(client => {
                const token = client.portalToken || client.id;
                const isCopied = copiedToken === client.id;

                return (
                  <div 
                    key={client.id}
                    className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] flex items-center justify-between gap-3 hover:border-black/20 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl ${client.avatarColor || 'bg-[#FEF9C3]'} flex items-center justify-center font-bold text-xs text-[#18191D] shrink-0 shadow-2xs`}>
                        {client.code}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#18191D] truncate">{client.name}</h4>
                        <p className="text-[10px] text-[#797E8B] font-mono truncate">
                          /portal/{token}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyPortalLink(client)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                          isCopied 
                            ? 'bg-[#10B981] text-white' 
                            : 'bg-white border border-[#ECE6DD] text-[#18191D] hover:bg-[#FAF7F2]'
                        }`}
                        title="Copy Unique Link"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" /> Copy Link
                          </>
                        )}
                      </button>

                      <a
                        href={`/portal/${token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-full bg-white border border-[#ECE6DD] text-[#797E8B] hover:text-[#18191D] transition-colors"
                        title="Open Portal in New Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-2xl text-[11px] text-[#797E8B] border border-[#ECE6DD] flex items-start gap-2">
              <Lock className="w-3.5 h-3.5 text-[#5B21B6] shrink-0 mt-0.5" />
              <span>Each link provides public, isolated access strictly to that client's deliverables, retainer hours, invoices, and approvals. No internal menus are accessible.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Modals */}
      <TaskModal 
        isOpen={taskModalOpen} 
        onClose={() => setTaskModalOpen(false)} 
      />
      <TimeModal 
        isOpen={timeModalOpen} 
        onClose={() => setTimeModalOpen(false)} 
      />

    </div>
  );
}
