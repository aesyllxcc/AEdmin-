import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Clock, 
  MessageSquare, 
  Users, 
  Activity, 
  Calendar, 
  Plane, 
  ArrowRightLeft, 
  Sparkles, 
  Settings, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  Sliders,
  Share2,
  Zap,
  Briefcase,
  Sun,
  Moon,
  ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Client } from '@/types';
import { GlobalClockGrid } from '@/components/globalOps/GlobalClockGrid';
import { QuickTimeConverter } from '@/components/globalOps/QuickTimeConverter';
import { ClientCoverageTimeline } from '@/components/globalOps/ClientCoverageTimeline';
import { GlobalHolidaysTravelHub } from '@/components/globalOps/GlobalHolidaysTravelHub';
import { ClientGlobalOpsModal } from '@/components/globalOps/ClientGlobalOpsModal';
import { DualTimeConverterModal } from '@/components/globalOps/DualTimeConverterModal';
import { ConfigureWorkingHoursModal } from '@/components/globalOps/ConfigureWorkingHoursModal';
import { getClientLiveTime, getFreelancerLiveTimeInfo, cleanTimezone } from '@/utils/timezoneUtils';

export default function GlobalOperations() {
  const { 
    clients, 
    userProfile, 
    holidays, 
    addHoliday, 
    deleteHoliday, 
    toggleClientTravelMode, 
    updateClientGlobalOps 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'clocks' | 'converter' | 'timeline' | 'holidays'>('clocks');
  const [selectedClientForOps, setSelectedClientForOps] = useState<Client | null>(null);
  const [isClientOpsModalOpen, setIsClientOpsModalOpen] = useState(false);
  const [isDualTimeModalOpen, setIsDualTimeModalOpen] = useState(false);
  const [isConfigureWorkingHoursOpen, setIsConfigureWorkingHoursOpen] = useState(false);
  const [configureModalTab, setConfigureModalTab] = useState<'freelancer' | 'clients' | 'stakeholders' | 'holidays'>('freelancer');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time ticking every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const freelancerTimezone = cleanTimezone(userProfile.timezone || userProfile.defaultTimezone || 'America/New_York');
  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');

  const freelancerLive = getFreelancerLiveTimeInfo(userProfile, currentTime);

  // Stats calculation
  const primeCommsCount = activeClients.filter(c => {
    const live = getClientLiveTime(c, currentTime, freelancerTimezone);
    return live.status === 'preferred_comms';
  }).length;

  const travelingCount = activeClients.filter(c => c.isTravelModeActive).length;

  const handleOpenClientSettings = (client: Client) => {
    setSelectedClientForOps(client);
    setIsClientOpsModalOpen(true);
  };

  const handleOpenConfigureHours = (tab: 'freelancer' | 'clients' | 'stakeholders' | 'holidays' = 'freelancer') => {
    setConfigureModalTab(tab);
    setIsConfigureWorkingHoursOpen(true);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      
      {/* Top Header & Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-border-subtle/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold tracking-wide">
              GLOBAL TIMES & TIMEZONE INTELLIGENCE
            </span>
            <span className="text-xs text-text-muted font-medium">
              {activeClients.length} International Clients Across {new Set(activeClients.map(c => c.country || 'Global')).size} Jurisdictions
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-main mt-1.5 flex items-center gap-3">
            Global Times
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Eliminate timezone confusion: live world clocks, instant 2-way converter, mutual meeting overlap heatmaps, and smart dispatch timing.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveSubTab('converter')}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 shadow-xs transition-all ${
              activeSubTab === 'converter'
                ? 'bg-purple-50 text-purple-900 border-purple-300'
                : 'bg-white border-[#ECE6DD] hover:border-purple-300 text-[#18191D]'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-purple-600" />
            <span>Quick Converter</span>
          </button>

          <button
            onClick={() => handleOpenConfigureHours('freelancer')}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Sliders className="w-4 h-4" />
            <span>Configure Working Hours</span>
          </button>
        </div>
      </div>

      {/* Quick Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Freelancer HQ Base Card - Interactive */}
        <div 
          onClick={() => handleOpenConfigureHours('freelancer')}
          className="bg-white p-4 rounded-2xl border border-purple-200 hover:border-purple-400 space-y-1.5 shadow-xs cursor-pointer transition-all hover:shadow-md relative group bg-gradient-to-br from-white to-purple-50/30"
          title="Click to configure Freelancer HQ Timezone & Working Hours"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{freelancerLive.effectiveFlag}</span>
              <span>Freelancer HQ Base</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${freelancerLive.statusColor}`}>
              {freelancerLive.statusBadge}
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <div className="truncate">
              <h3 className="text-base font-black text-[#18191D] font-mono truncate">
                {freelancerLive.effectiveCity}, {freelancerLive.effectiveCountry}
              </h3>
              <p className="text-xs font-bold text-purple-700 font-mono">
                {freelancerLive.timeStr} <span className="text-[10px] text-stone-400 font-normal">({freelancerTimezone})</span>
              </p>
            </div>
            <span className="text-[10px] text-purple-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-0.5">
              Edit <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          <div className="pt-1 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500 font-medium">
            <span>Hours: <strong className="text-stone-800">{freelancerLive.workingHoursLabel}</strong></span>
            <span>SLA: <strong className="text-stone-800">{freelancerLive.businessHoursLabel}</strong></span>
          </div>
        </div>

        {/* Comms Open KPI */}
        <div className="bg-white p-4 rounded-2xl border border-[#ECE6DD] space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Open for Comms Now</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-emerald-700">
              {primeCommsCount} <span className="text-xs font-medium text-stone-500">/ {activeClients.length} clients</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">In active working or comms window</p>
        </div>

        {/* Travel Mode KPI */}
        <div className="bg-white p-4 rounded-2xl border border-[#ECE6DD] space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Travel Overrides Active</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-amber-700">
              {travelingCount} <span className="text-xs font-medium text-stone-500">Accounts</span>
            </span>
            <Plane className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-[11px] text-amber-700 font-medium">Temporary timezone shifts applied</p>
        </div>

        {/* Holidays KPI */}
        <div 
          onClick={() => handleOpenConfigureHours('holidays')}
          className="bg-white p-4 rounded-2xl border border-[#ECE6DD] hover:border-blue-300 space-y-1 shadow-xs cursor-pointer transition-all"
        >
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Annual & Custom Holidays</span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-blue-700">
              {holidays.length} <span className="text-xs font-medium text-stone-500">Tracked</span>
            </span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-[11px] text-blue-700 font-medium">Across all client jurisdictions</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#ECE6DD] overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveSubTab('clocks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'clocks' 
              ? 'bg-white text-[#18191D] shadow-xs border border-[#ECE6DD]' 
              : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
          }`}
        >
          <Globe className="w-4 h-4 text-purple-600" />
          <span>World Clocks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('converter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'converter' 
              ? 'bg-white text-[#18191D] shadow-xs border border-[#ECE6DD]' 
              : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-purple-600" />
          <span>Quick Converter</span>
        </button>

        <button
          onClick={() => setActiveSubTab('timeline')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'timeline' 
              ? 'bg-white text-[#18191D] shadow-xs border border-[#ECE6DD]' 
              : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>24h Coverage Timeline</span>
        </button>

        <button
          onClick={() => setActiveSubTab('holidays')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeSubTab === 'holidays' 
              ? 'bg-white text-[#18191D] shadow-xs border border-[#ECE6DD]' 
              : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-600" />
          <span>Holidays & Travel Hub</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'clocks' && (
        <GlobalClockGrid
          clients={clients}
          freelancerTimezone={freelancerTimezone}
          onOpenCommsPlanner={(c) => {}}
          onOpenMeetingFinder={(c) => {}}
          onOpenClientGlobalSettings={handleOpenClientSettings}
          onToggleTravelMode={toggleClientTravelMode}
          onOpenQuickConverter={() => setActiveSubTab('converter')}
        />
      )}

      {activeSubTab === 'converter' && (
        <QuickTimeConverter
          clients={clients}
          freelancerTimezone={freelancerTimezone}
          onOpenCommsWithClient={(c) => {}}
        />
      )}

      {activeSubTab === 'timeline' && (
        <ClientCoverageTimeline
          clients={clients}
          freelancerTimezone={freelancerTimezone}
        />
      )}

      {activeSubTab === 'holidays' && (
        <GlobalHolidaysTravelHub
          clients={clients}
          holidays={holidays}
          onAddHoliday={addHoliday}
          onDeleteHoliday={deleteHoliday}
          onToggleTravelMode={toggleClientTravelMode}
          onOpenClientSettings={handleOpenClientSettings}
        />
      )}

      {/* Unified Working Hours & Timezone Configuration Modal */}
      <ConfigureWorkingHoursModal
        isOpen={isConfigureWorkingHoursOpen}
        onClose={() => setIsConfigureWorkingHoursOpen(false)}
        initialTab={configureModalTab}
      />

      {/* Client Specific Global Ops Modal */}
      <ClientGlobalOpsModal
        client={selectedClientForOps}
        isOpen={isClientOpsModalOpen}
        onClose={() => {
          setIsClientOpsModalOpen(false);
          setSelectedClientForOps(null);
        }}
        onSave={updateClientGlobalOps}
      />

      <DualTimeConverterModal
        isOpen={isDualTimeModalOpen}
        onClose={() => setIsDualTimeModalOpen(false)}
        clients={clients}
        freelancerTimezone={freelancerTimezone}
      />
    </div>
  );
}
