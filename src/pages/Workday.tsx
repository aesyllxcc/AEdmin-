import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  Copy, 
  Check, 
  RotateCcw, 
  Calendar, 
  Plus, 
  FileText,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Layers,
  Building2,
  Trash2,
  Filter,
  UserCheck,
  MoreVertical
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TaskModal } from "@/components/modals/TaskModal";
import { TimeModal } from "@/components/modals/TimeModal";
import { WeeklyDriveAuditTab } from "@/components/workday/WeeklyDriveAuditTab";
import { formatMinutesToTime, parseTimeToMinutes, getFreelancerLiveTimeInfo } from "@/utils/timezoneUtils";

export default function Workday() {
  const { 
    userProfile, 
    clients, 
    tasks, 
    timeEntries, 
    dailyRoutines, 
    toggleRoutineItem, 
    resetDailyRoutines,
    toggleClientRoutineItem,
    addClientRoutineItem,
    deleteClientRoutineItem,
    startTimer,
    toggleTaskStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'timeline' | 'client_routines' | 'internal_sops' | 'drive_audit'>('timeline');
  const [selectedClientForEod, setSelectedClientForEod] = useState(clients[0]?.id || '');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('all');
  const [newRoutineText, setNewRoutineText] = useState("");
  const [newRoutineClientId, setNewRoutineClientId] = useState(clients[0]?.id || "");
  const [newRoutinePhase, setNewRoutinePhase] = useState<'opening' | 'midday' | 'eod'>('opening');
  const [newRoutineMinutes, setNewRoutineMinutes] = useState(15);
  const [showAddRoutineModal, setShowAddRoutineModal] = useState(false);

  const [copiedRecap, setCopiedRecap] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [timeModalOpen, setTimeModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const activeClients = clients.filter(c => c.status === 'active');
  const todayTasks = tasks.filter(t => t.dueDate === todayStr || t.status === 'in_progress');
  const todayTimeLogs = timeEntries.filter(t => t.date === todayStr);

  const freelancerLive = getFreelancerLiveTimeInfo(userProfile);

  const clientForEod = clients.find(c => c.id === selectedClientForEod);
  const clientTodayTasks = tasks.filter(t => t.clientId === selectedClientForEod);
  const clientCompletedToday = clientTodayTasks.filter(t => t.status === 'completed');
  const clientInProgressToday = clientTodayTasks.filter(t => t.status === 'in_progress' || t.status === 'todo');

  const filteredClients = selectedClientFilter === 'all' 
    ? activeClients 
    : activeClients.filter(c => c.id === selectedClientFilter);

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineText.trim() || !newRoutineClientId) return;
    addClientRoutineItem(newRoutineClientId, {
      title: newRoutineText.trim(),
      phase: newRoutinePhase,
      timeTarget: newRoutinePhase === 'opening' ? userProfile.workingHoursStart || '09:00' : newRoutinePhase === 'midday' ? '12:30' : userProfile.endOfShiftWindowStart || '17:00',
      estimatedMinutes: Number(newRoutineMinutes) || 15
    });
    setNewRoutineText("");
    setShowAddRoutineModal(false);
  };

  const generateEodText = () => {
    if (!clientForEod) return '';
    return `Subject: EOD Executive Update — ${clientForEod.name} (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})

Hi ${clientForEod.primaryContact.split(' ')[0]},

Here is your daily operational summary for ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}:

✅ COMPLETED DELIVERABLES TODAY:
${clientCompletedToday.length > 0 ? clientCompletedToday.map(t => `• ${t.title}`).join('\n') : '• Core operations & async monitoring maintained.'}

🔄 IN-FLIGHT & TOMORROW'S PRIORITIES:
${clientInProgressToday.length > 0 ? clientInProgressToday.map(t => `• ${t.title} (Target: ${t.dueDate})`).join('\n') : '• Reviewing upcoming milestone deliverables.'}

⏳ RETAINER STATUS:
• Used This Month: ${clientForEod.usedHoursThisMonth} hrs / ${clientForEod.purchasedHours} hrs allocated
• Remaining Balance: ${(clientForEod.purchasedHours - clientForEod.usedHoursThisMonth).toFixed(1)} hrs

❓ ACTION ITEMS FOR YOU / INPUT NEEDED:
• No blockers currently. All deliverables on track.

Best regards,
${userProfile.fullName}
${userProfile.title}`;
  };

  const handleCopyRecap = () => {
    navigator.clipboard.writeText(generateEodText());
    setCopiedRecap(true);
    setTimeout(() => setCopiedRecap(false), 2000);
  };

  // Dynamic Strategic Schedule Flow Timeline based on configured working hours & business hours
  const workStartM = parseTimeToMinutes(userProfile.workingHoursStart || '08:30');
  const workEndM = parseTimeToMinutes(userProfile.workingHoursEnd || '17:30');
  const endShiftStartM = parseTimeToMinutes(userProfile.endOfShiftWindowStart || '17:00');
  const endShiftEndM = parseTimeToMinutes(userProfile.endOfShiftWindowEnd || userProfile.endOfShiftTime || '18:00');

  const timeBlocks = [
    { 
      time: `${formatMinutesToTime(workStartM)} - ${formatMinutesToTime(workStartM + 45)}`, 
      title: "Morning Triage & Executive Calendar Flow", 
      type: "internal", 
      category: "Internal Studio SOP",
      status: "completed",
      duration: "45m",
      cardColor: "bg-[#FEF9C3] border-[#FEF08A] text-[#854D0E]"
    },
    { 
      time: `${formatMinutesToTime(workStartM + 60)} - ${formatMinutesToTime(workStartM + 180)}`, 
      title: "Arkgate Ventures: LP Presentation Deck Sprint", 
      type: "client", 
      clientName: "Arkgate Ventures",
      category: "Client Deep Work",
      status: "completed",
      duration: "2h 00m",
      cardColor: "bg-[#FCE7F3] border-[#FBCFE8] text-[#9D174D]"
    },
    { 
      time: `${formatMinutesToTime(workStartM + 180)} - ${formatMinutesToTime(workStartM + 240)}`, 
      title: "Midday Client Communications & Review Approvals", 
      type: "internal", 
      category: "Internal Operations",
      status: "in_progress",
      duration: "1h 00m",
      cardColor: "bg-[#EDE9FE] border-[#DDD6FE] text-[#5B21B6]"
    },
    { 
      time: `${formatMinutesToTime(workStartM + 300)} - ${formatMinutesToTime(workStartM + 420)}`, 
      title: "Wayne Tech: AI Workflow & Security Automation", 
      type: "client", 
      clientName: "Wayne Tech Corp",
      category: "Client Deep Work",
      status: "upcoming",
      duration: "2h 00m",
      cardColor: "bg-[#DCFCE7] border-[#BBF7D0] text-[#166534]"
    },
    { 
      time: `${formatMinutesToTime(workStartM + 435)} - ${formatMinutesToTime(endShiftStartM)}`, 
      title: "Stark Media: Retainer Audit & Weekly Analytics Sync", 
      type: "client", 
      clientName: "Stark Media Group",
      category: "Client Routine",
      status: "upcoming",
      duration: "45m",
      cardColor: "bg-[#E0F2FE] border-[#BAE6FD] text-[#0369A1]"
    },
    { 
      time: `${formatMinutesToTime(endShiftStartM)} - ${formatMinutesToTime(endShiftEndM)}`, 
      title: "AEDMIN EOD Wrap-Up & Daily Client Recaps", 
      type: "internal", 
      category: "Internal Studio Wrap-Up",
      status: "upcoming",
      duration: "45m",
      cardColor: "bg-[#FEF9C3] border-[#FEF08A] text-[#854D0E]"
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#18191D] text-white">
              Daily Operating Cadence
            </span>
            <span className="text-xs text-[#797E8B] font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#18191D] mt-2">
            My Workday & Routines
          </h1>
          <p className="text-xs sm:text-sm text-[#797E8B] mt-1 font-medium">
            Structured daily routines for each active client, internal studio SOPs, and schedule defense.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddRoutineModal(true)}
            className="px-4 py-2 bg-white border border-[#ECE6DD] hover:bg-[#FAF7F2] text-[#18191D] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Routine
          </button>
          <button
            onClick={() => setTimeModalOpen(true)}
            className="px-4 py-2 bg-white border border-[#ECE6DD] hover:bg-[#FAF7F2] text-[#18191D] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" />
            Log Time
          </button>
          <button
            onClick={() => setTaskModalOpen(true)}
            className="px-4 py-2 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Day Task
          </button>
        </div>
      </div>

      {/* Bento-Style Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'timeline', label: 'Timeline & Operating Cadence' },
          { id: 'client_routines', label: `Client Daily Routines (${activeClients.length})` },
          { id: 'internal_sops', label: 'Internal Ops.' },
          { id: 'drive_audit', label: 'Weekly Drive File Audit' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              activeTab === tab.id 
                ? 'bg-[#18191D] text-white border-[#18191D] shadow-xs' 
                : 'bg-white text-[#797E8B] hover:text-[#18191D] border-[#ECE6DD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Client Daily Routines Tab */}
      {activeTab === 'client_routines' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#18191D]">Client-Specific Operational Routines</h2>
              <p className="text-xs text-[#797E8B]">
                Tick off daily recurring checks and recurring deliverables tailored for each individual client retainer.
              </p>
            </div>

            {/* Filter by client */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#797E8B] font-semibold">Filter:</span>
              <select
                value={selectedClientFilter}
                onChange={e => setSelectedClientFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#ECE6DD] rounded-full text-xs font-semibold text-[#18191D] focus:outline-none shadow-xs"
              >
                <option value="all">All Active Clients ({activeClients.length})</option>
                {activeClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredClients.map(client => {
              const routines = client.dailyRoutines || [];
              const completedCount = routines.filter(r => r.completed).length;

              return (
                <div 
                  key={client.id}
                  className="bg-white p-6 rounded-[28px] border border-[#ECE6DD] shadow-xs flex flex-col justify-between space-y-4 hover:border-black/20 transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-2xl ${client.avatarColor || 'bg-[#FEF9C3]'} flex items-center justify-center text-xs font-bold text-[#18191D] shadow-2xs`}>
                          {client.code}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#18191D]">{client.name}</h3>
                          <span className="text-[11px] text-[#797E8B]">{client.primaryContact} • {client.tier}</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FAF7F2] text-[#18191D] border border-[#ECE6DD]">
                        {completedCount}/{routines.length} Complete
                      </span>
                    </div>

                    {/* Routines List */}
                    <div className="space-y-2 mt-4">
                      {routines.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-start justify-between p-3 rounded-2xl border transition-all ${
                            item.completed 
                              ? 'bg-[#FAF7F2] border-[#ECE6DD] text-[#A0A4B0]' 
                              : 'bg-white border-[#ECE6DD] hover:border-black/30 text-[#18191D]'
                          }`}
                        >
                          <div 
                            onClick={() => toggleClientRoutineItem(client.id, item.id)}
                            className="flex items-start gap-3 flex-1 cursor-pointer"
                          >
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#D5CFCE] shrink-0 mt-0.5" />
                            )}
                            <div className="min-w-0">
                              <p className={`text-xs font-semibold leading-snug ${item.completed ? 'line-through text-[#A0A4B0]' : 'text-[#18191D]'}`}>
                                {item.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-[#797E8B]">
                                {item.timeTarget && <span className="font-mono">Target: {item.timeTarget}</span>}
                                <span>• Est. {item.estimatedMinutes}m</span>
                                <span className="capitalize font-semibold text-[#18191D] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#ECE6DD]">
                                  {item.phase}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-2">
                            <button
                              onClick={() => startTimer({ clientId: client.id, notes: `${client.name}: ${item.title}` })}
                              className="p-1.5 rounded-full text-[#797E8B] hover:text-[#10B981] hover:bg-[#DCFCE7] transition-colors"
                              title="Start timer for routine"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                            <button
                              onClick={() => deleteClientRoutineItem(client.id, item.id)}
                              className="p-1.5 rounded-full text-[#A0A4B0] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete routine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {routines.length === 0 && (
                        <div className="py-6 text-center text-xs text-[#797E8B] italic">
                          No daily routines configured for this client. Click below to add one.
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setNewRoutineClientId(client.id);
                      setShowAddRoutineModal(true);
                    }}
                    className="w-full py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#ECE6DD] border border-[#ECE6DD] text-xs font-bold text-[#18191D] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Task/Routine for {client.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Internal Studio SOP Routines Tab */}
      {activeTab === 'internal_sops' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#797E8B]">
              Tick internal operations off sequentially to maintain studio defense throughout the workday.
            </p>
            <button
              onClick={resetDailyRoutines}
              className="text-xs font-bold text-[#18191D] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Daily Checklists
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Opening Phase - Lemon Card */}
            <div className="bg-[#FEF9C3] p-6 rounded-[28px] border border-[#FEF08A] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#FEF08A]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CA8A04]" />
                    <h3 className="font-bold text-sm text-[#854D0E]">Opening Routine</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#854D0E] bg-yellow-200/80 px-2.5 py-0.5 rounded-full font-mono">
                    {userProfile.businessHoursStart || '08:00'} - {userProfile.workingHoursStart || '09:00'}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  {dailyRoutines.opening.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoutineItem('opening', item.id)}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-yellow-200/60 cursor-pointer transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#CA8A04] shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-[#A16207]' : 'text-[#854D0E]'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-yellow-200/70 rounded-2xl text-[11px] text-[#854D0E] font-medium border border-yellow-300">
                <strong>Rule:</strong> Protect client mornings by clearing unread items and queuing priorities before {userProfile.workingHoursStart || '09:30'}.
              </div>
            </div>

            {/* Midday Phase - Sky Card */}
            <div className="bg-[#E0F2FE] p-6 rounded-[28px] border border-[#BAE6FD] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#BAE6FD]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                    <h3 className="font-bold text-sm text-[#0369A1]">Midday Calibration</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#0369A1] bg-sky-200/80 px-2.5 py-0.5 rounded-full font-mono">12:00 - 13:00</span>
                </div>

                <div className="space-y-2 mt-4">
                  {dailyRoutines.midday.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoutineItem('midday', item.id)}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-sky-200/60 cursor-pointer transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-[#075985]' : 'text-[#0369A1]'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-sky-200/70 rounded-2xl text-[11px] text-[#0369A1] font-medium border border-sky-300">
                <strong>Rule:</strong> Never enter the afternoon with unresolved client blockers. Follow up on pending approvals.
              </div>
            </div>

            {/* EOD Wrap Up - Pink / Lilac Card */}
            <div className="bg-[#FCE7F3] p-6 rounded-[28px] border border-[#FBCFE8] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#FBCFE8]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DB2777]" />
                    <h3 className="font-bold text-sm text-[#9D174D]">End of Day (EOD)</h3>
                  </div>
                  <span className="text-[11px] font-bold text-[#9D174D] bg-pink-200/80 px-2.5 py-0.5 rounded-full font-mono">
                    {userProfile.endOfShiftWindowStart || '17:00'} - {userProfile.endOfShiftWindowEnd || userProfile.endOfShiftTime || '18:00'}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  {dailyRoutines.eod.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleRoutineItem('eod', item.id)}
                      className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-pink-200/60 cursor-pointer transition-colors"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-[#DB2777] shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs font-semibold ${item.completed ? 'line-through text-pink-700/80' : 'text-[#9D174D]'}`}>
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-pink-200/70 rounded-2xl text-[11px] text-[#9D174D] font-medium border border-pink-300">
                <strong>Rule:</strong> Send formatted EOD recaps so clients start their mornings informed without needing to ping you.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. Timeline & Schedule Defense Tab */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#18191D]">Today's Operating Timeline</h3>
                <p className="text-xs text-[#797E8B]">Unifying internal operations and client-dedicated deep work blocks</p>
              </div>
              <span className="text-xs font-bold text-[#166534] bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1 rounded-full">
                Calendar Shield Active
              </span>
            </div>
            
            <div className="space-y-3">
              {timeBlocks.map((block, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-[28px] border transition-all flex items-start justify-between ${block.cardColor}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-2xl bg-white/70 text-xs font-mono font-bold shrink-0">
                      {block.time}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#18191D]">{block.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/80">
                          {block.category}
                        </span>
                        <span className="text-[11px] font-medium opacity-80">Duration: {block.duration}</span>
                        <span className="text-[11px] capitalize opacity-80">• {block.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {block.status === 'in_progress' && (
                    <button
                      onClick={() => startTimer({ notes: block.title })}
                      className="px-4 py-2 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Run Timer
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Today's Logged Time */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#18191D]">Logged Sessions Today</h3>
              <button onClick={() => setTimeModalOpen(true)} className="text-xs font-bold text-[#18191D] hover:underline">
                + Add Log
              </button>
            </div>

            <div className="p-5 bg-white rounded-[28px] border border-[#ECE6DD] space-y-3 shadow-xs">
              {todayTimeLogs.length > 0 ? (
                todayTimeLogs.map(log => (
                  <div key={log.id} className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#18191D]">
                      <span>{log.clientName}</span>
                      <span className="font-mono text-[#5B21B6] font-extrabold">{log.durationMinutes} mins</span>
                    </div>
                    <p className="text-[#797E8B] text-[11px]">{log.notes}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-[#797E8B]">
                  No sessions logged yet today. Use the Live Timer or Log Time button.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* 4. Weekly Drive File Audit Tab */}
      {activeTab === 'drive_audit' && (
        <WeeklyDriveAuditTab 
          clients={clients} 
          userFullName={userProfile.fullName} 
        />
      )}

      {/* Add Client Routine Modal */}
      {showAddRoutineModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[32px] border border-[#ECE6DD] p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-[#18191D]">Add Routine for Client</h3>
            <form onSubmit={handleAddRoutine} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#18191D] mb-1">Target Client</label>
                <select
                  value={newRoutineClientId}
                  onChange={e => setNewRoutineClientId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-xs font-semibold text-[#18191D]"
                >
                  {activeClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#18191D] mb-1">Routine / Task Title</label>
                <input
                  type="text"
                  value={newRoutineText}
                  onChange={e => setNewRoutineText(e.target.value)}
                  placeholder="e.g., Daily SEO telemetry check & Slack sync"
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-xs text-[#18191D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18191D] mb-1">Phase</label>
                  <select
                    value={newRoutinePhase}
                    onChange={e => setNewRoutinePhase(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-xs font-semibold text-[#18191D]"
                  >
                    <option value="opening">Opening (Morning)</option>
                    <option value="midday">Midday (Afternoon)</option>
                    <option value="eod">EOD (Wrap-Up)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#18191D] mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    value={newRoutineMinutes}
                    onChange={e => setNewRoutineMinutes(Number(e.target.value))}
                    min="5"
                    max="180"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl text-xs text-[#18191D]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddRoutineModal(false)}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#ECE6DD] text-[#797E8B] rounded-full text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <TaskModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
      <TimeModal isOpen={timeModalOpen} onClose={() => setTimeModalOpen(false)} />

    </div>
  );
}
