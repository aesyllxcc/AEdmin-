import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Sun, 
  Moon, 
  Plane, 
  Clock, 
  MapPin, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Settings2, 
  CheckCircle2, 
  AlertCircle,
  Coffee,
  ChevronRight,
  TrendingUp,
  Compass,
  Search,
  Sliders,
  RotateCcw,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { Client } from '@/types';
import { 
  getClientLiveTime, 
  getClientEffectiveLocation, 
  getClientPlainExplanation, 
  formatMinutesToTime,
  parseTimeToMinutes 
} from '@/utils/timezoneUtils';

interface GlobalClockGridProps {
  clients: Client[];
  freelancerTimezone: string;
  onOpenCommsPlanner: (client: Client) => void;
  onOpenMeetingFinder: (client: Client) => void;
  onOpenClientGlobalSettings: (client: Client) => void;
  onToggleTravelMode: (client: Client) => void;
  onOpenQuickConverter?: () => void;
}

export const GlobalClockGrid: React.FC<GlobalClockGridProps> = ({
  clients,
  freelancerTimezone,
  onOpenCommsPlanner,
  onOpenMeetingFinder,
  onOpenClientGlobalSettings,
  onToggleTravelMode,
  onOpenQuickConverter
}) => {
  // Live tick every second
  const [realTimeDate, setRealTimeDate] = useState(new Date());
  const [isSimulatingTime, setIsSimulatingTime] = useState(false);
  const [simulatedMinutes, setSimulatedMinutes] = useState(14 * 60); // 2:00 PM default
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'working' | 'sleeping' | 'traveling'>('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTimeDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute effective active date
  let effectiveDate = realTimeDate;
  if (isSimulatingTime) {
    const simulated = new Date(realTimeDate);
    simulated.setHours(Math.floor(simulatedMinutes / 60));
    simulated.setMinutes(simulatedMinutes % 60);
    simulated.setSeconds(0);
    effectiveDate = simulated;
  }

  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');

  // Filter clients by search & status
  const filteredClients = activeClients.filter(client => {
    const loc = getClientEffectiveLocation(client);
    const live = getClientLiveTime(client, effectiveDate, freelancerTimezone);

    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.country.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'available') return live.status === 'preferred_comms';
    if (statusFilter === 'working') return live.status === 'working' || live.status === 'preferred_comms';
    if (statusFilter === 'sleeping') return live.status === 'sleeping';
    if (statusFilter === 'traveling') return loc.isTravel;

    return true;
  });

  const availableCount = activeClients.filter(c => getClientLiveTime(c, effectiveDate, freelancerTimezone).status === 'preferred_comms').length;
  const workingCount = activeClients.filter(c => ['working', 'preferred_comms'].includes(getClientLiveTime(c, effectiveDate, freelancerTimezone).status)).length;
  const travelingCount = activeClients.filter(c => c.isTravelModeActive).length;

  return (
    <div className="space-y-6">
      
      {/* Interactive Time Scrubber / Simulator Banner */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#ECE6DD] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
              isSimulatingTime ? 'bg-amber-100 text-amber-800' : 'bg-purple-100 text-purple-800'
            }`}>
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-[#18191D]">
                  {isSimulatingTime ? 'Time Simulation Mode (Scrubbing)' : 'Live Real-Time World Clocks'}
                </h3>
                {isSimulatingTime ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Simulating {formatMinutesToTime(simulatedMinutes)} HQ
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-stone-500">
                {isSimulatingTime 
                  ? 'All clocks below are previewing what each client\'s time and reachability will be at this exact hour.'
                  : 'Live ticking seconds synchronized with your headquarters.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSimulatingTime ? (
              <button
                onClick={() => setIsSimulatingTime(false)}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Live Time</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setSimulatedMinutes(realTimeDate.getHours() * 60 + realTimeDate.getMinutes());
                  setIsSimulatingTime(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-stone-600" />
                <span>Scrub Time of Day</span>
              </button>
            )}
          </div>
        </div>

        {/* Time Slider & Quick Preset Jumpers */}
        {isSimulatingTime && (
          <div className="pt-2 border-t border-[#ECE6DD] space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-stone-700">
              <span className="text-[11px] text-stone-500 font-sans">Simulate Your HQ Hour:</span>
              <span className="text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200">
                {formatMinutesToTime(simulatedMinutes)} ({freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'HQ'})
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1439"
              step="15"
              value={simulatedMinutes}
              onChange={(e) => setSimulatedMinutes(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Quick Jumps:</span>
              {[
                { label: '9:00 AM (Morning)', mins: 9 * 60 },
                { label: '12:00 PM (Noon)', mins: 12 * 60 },
                { label: '3:00 PM (Afternoon)', mins: 15 * 60 },
                { label: '6:00 PM (EOD)', mins: 18 * 60 },
                { label: '10:00 PM (Night)', mins: 22 * 60 }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSimulatedMinutes(p.mins)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                    Math.abs(simulatedMinutes - p.mins) < 10
                      ? 'bg-purple-600 text-white'
                      : 'bg-[#FAF8F5] text-stone-700 border border-[#ECE6DD] hover:border-purple-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, city, country, or code..."
            className="w-full pl-8.5 pr-3 py-2 rounded-xl bg-white border border-[#ECE6DD] text-xs font-medium text-[#18191D] placeholder:text-stone-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              statusFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-[#ECE6DD] hover:bg-stone-50'
            }`}
          >
            All ({activeClients.length})
          </button>

          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              statusFilter === 'available'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Open Comms ({availableCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('working')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              statusFilter === 'working'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-blue-800 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>Working ({workingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('sleeping')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              statusFilter === 'sleeping'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-purple-800 border border-purple-200 hover:bg-purple-50'
            }`}
          >
            <Moon className="w-3 h-3" />
            <span>Asleep</span>
          </button>

          <button
            onClick={() => setStatusFilter('traveling')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
              statusFilter === 'traveling'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-800 border border-amber-200 hover:bg-amber-50'
            }`}
          >
            <Plane className="w-3 h-3" />
            <span>Traveling ({travelingCount})</span>
          </button>
        </div>
      </div>

      {/* Client World Clocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4.5">
        {filteredClients.map(client => {
          const live = getClientLiveTime(client, effectiveDate, freelancerTimezone);
          const loc = getClientEffectiveLocation(client);
          const hasLearnedPatterns = client.learnedPatterns && client.learnedPatterns.length > 0;
          const plainExplanation = getClientPlainExplanation(client, live);

          return (
            <div 
              key={client.id}
              className="bg-white rounded-2xl border border-[#ECE6DD] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 group relative overflow-hidden"
            >
              {/* Subtle top indicator bar */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  live.status === 'preferred_comms' ? 'bg-emerald-500' :
                  live.status === 'working' ? 'bg-blue-500' :
                  live.status === 'traveling' ? 'bg-amber-500' :
                  live.status === 'sleeping' ? 'bg-purple-400' : 'bg-stone-300'
                }`} 
              />

              <div>
                {/* Client header & location */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl select-none" role="img" aria-label={loc.country}>
                      {loc.flagEmoji}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-[#18191D] group-hover:text-purple-700 transition-colors">
                          {client.name}
                        </h3>
                        {loc.isTravel && (
                          <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center gap-0.5">
                            <Plane className="w-2.5 h-2.5" /> Travel
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{loc.city}, {loc.country}</span>
                        <span className="text-stone-300">•</span>
                        <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded text-[10px]">
                          {live.timeDiffLabel}
                        </span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenClientGlobalSettings(client)}
                    className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                    title="Configure Global Times & Working Hours"
                  >
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Clock Display */}
                <div className="mt-4 pt-3 border-t border-[#F2EFE9] flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black text-[#18191D] tracking-tight font-mono">
                        {live.timeStr.split(' ')[0]}
                      </span>
                      {!isSimulatingTime && (
                        <span className="text-xs font-bold text-stone-400 font-mono">
                          :{live.secondsStr}
                        </span>
                      )}
                      <span className="text-xs font-black text-purple-800 ml-1">
                        {live.timeStr.split(' ')[1]}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                      {live.dateStr} ({loc.timezone.split('/')[1]?.replace('_', ' ') || loc.timezone})
                    </p>
                  </div>

                  {/* Day / Night visual pill */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#ECE6DD]">
                    {live.isDaytime ? (
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                    <span className="text-xs text-stone-700">
                      {live.isDaytime ? 'Daytime' : 'Night'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Plain-English Explanation */}
              <div className="space-y-2.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE6DD]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Reachability:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${live.statusColor}`}>
                    {live.statusLabel}
                  </span>
                </div>

                {/* Plain English explanation box */}
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-lg border border-[#ECE6DD] font-sans">
                  {plainExplanation}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#ECE6DD]">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Working Hours</span>
                    <span className="font-semibold text-stone-800">{live.workingHoursLabel}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Prime Comms</span>
                    <span className="font-semibold text-stone-800">{live.preferredCommsLabel}</span>
                  </div>
                </div>

                {loc.isTravel && loc.travelReason && (
                  <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="font-bold block">✈️ Travel Override:</span>
                    <span>{loc.travelReason}</span>
                    {loc.travelEndDate && <span className="block text-[10px] text-amber-700 mt-0.5">Until {loc.travelEndDate}</span>}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => onOpenCommsPlanner(client)}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition-colors border border-purple-200/60"
                  title="Plan smart communication window"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                  <span>Message</span>
                </button>

                <button
                  onClick={() => onOpenMeetingFinder(client)}
                  className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors border border-blue-200/60"
                  title="Find optimal meeting overlap"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Meet</span>
                </button>

                <button
                  onClick={() => onToggleTravelMode(client)}
                  className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-colors border ${
                    loc.isTravel 
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300' 
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                  }`}
                  title={loc.isTravel ? "Deactivate travel mode" : "Activate travel mode"}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>{loc.isTravel ? 'In Travel' : 'Travel'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#ECE6DD] p-8">
          <Globe className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-stone-800">No matching clients found</h3>
          <p className="text-xs text-stone-500 mt-1">Try clearing your search query or switching your status filter.</p>
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
            className="mt-3 px-3.5 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-200"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
