import React, { useState } from 'react';
import { 
  Activity, 
  Clock, 
  Sun, 
  Moon, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { Client } from '@/types';
import { 
  getClientLiveTime, 
  getClientEffectiveLocation, 
  parseTimeToMinutes,
  formatMinutesToTime
} from '@/utils/timezoneUtils';

interface ClientCoverageTimelineProps {
  clients: Client[];
  freelancerTimezone: string;
}

export const ClientCoverageTimeline: React.FC<ClientCoverageTimelineProps> = ({
  clients,
  freelancerTimezone
}) => {
  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);

  const now = new Date();
  const currentFreelancerHour = now.getHours();
  const currentFreelancerMin = now.getMinutes();
  const currentFreelancerPositionPercent = ((currentFreelancerHour * 60 + currentFreelancerMin) / 1440) * 100;

  // 24 hours array (0 to 23)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper to compute client state at a specific freelancer hour
  const getClientHourState = (client: Client, freelancerHour: number) => {
    const loc = getClientEffectiveLocation(client);
    const dateAtHour = new Date();
    dateAtHour.setHours(freelancerHour, 0, 0, 0);

    let cHour = 0;
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: loc.timezone,
        hour: '2-digit',
        hour12: false
      }).formatToParts(dateAtHour);
      cHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
    } catch {
      cHour = freelancerHour;
    }

    const cMins = cHour * 60;
    const workStart = parseTimeToMinutes(client.workingHoursStart || '09:00');
    const workEnd = parseTimeToMinutes(client.workingHoursEnd || '17:30');
    const commsStart = parseTimeToMinutes(client.preferredCommsStart || '10:00');
    const commsEnd = parseTimeToMinutes(client.preferredCommsEnd || '16:30');

    if (cHour >= 22 || cHour < 7) {
      return { type: 'sleep', label: 'Sleeping', color: 'bg-purple-900/20 text-purple-900 border-purple-200' };
    }
    if (cMins >= commsStart && cMins <= commsEnd) {
      return { type: 'prime', label: 'Prime Comms', color: 'bg-emerald-500 text-white' };
    }
    if (cMins >= workStart && cMins <= workEnd) {
      return { type: 'work', label: 'Active Work', color: 'bg-blue-500 text-white' };
    }
    return { type: 'off', label: 'Off-Hours', color: 'bg-stone-200 text-stone-600' };
  };

  // Calculate active clients count at current time
  const activeCountNow = activeClients.filter(c => {
    const live = getClientLiveTime(c, now, freelancerTimezone);
    return live.status === 'working' || live.status === 'preferred_comms';
  }).length;

  return (
    <div className="bg-white rounded-2xl border border-[#ECE6DD] p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ECE6DD]">
        <div>
          <h3 className="text-sm font-bold text-[#18191D] flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            24-Hour Client Coverage Timeline
          </h3>
          <p className="text-xs text-[#797E8B]">
            Global orbit synchronized to your timezone ({freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Local'})
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-stone-600">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-emerald-500 inline-block" /> Prime Comms</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-blue-500 inline-block" /> Working Hours</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-purple-200 border border-purple-300 inline-block" /> Sleeping</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-stone-200 inline-block" /> Off-Hours</span>
        </div>
      </div>

      {/* Interactive 24-Hour Scrubber Bar */}
      <div className="space-y-4">
        {/* Timeline Header Row (Hours: 00:00 to 23:00) */}
        <div className="relative pt-6">
          <div className="grid grid-cols-24 gap-0.5 text-center text-[10px] font-mono text-stone-400 select-none">
            {hours.map(h => (
              <div 
                key={h}
                onMouseEnter={() => setHoveredHour(h)}
                onMouseLeave={() => setHoveredHour(null)}
                className={`py-1 cursor-pointer transition-colors ${
                  hoveredHour === h ? 'text-blue-600 font-bold bg-blue-50 rounded' :
                  h === currentFreelancerHour ? 'text-red-600 font-bold' : ''
                }`}
              >
                {h % 3 === 0 ? `${h.toString().padStart(2, '0')}:00` : '·'}
              </div>
            ))}
          </div>

          {/* Red LIVE NOW indicator line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none flex flex-col items-center"
            style={{ left: `${currentFreelancerPositionPercent}%` }}
          >
            <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full absolute -top-4 whitespace-nowrap shadow-xs animate-pulse">
              NOW ({formatMinutesToTime(currentFreelancerHour * 60 + currentFreelancerMin)})
            </span>
          </div>
        </div>

        {/* Client Rows */}
        <div className="space-y-3 pt-2">
          {activeClients.map(client => {
            const loc = getClientEffectiveLocation(client);
            const live = getClientLiveTime(client, now, freelancerTimezone);

            return (
              <div key={client.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{loc.flagEmoji}</span>
                    <span className="font-bold text-[#18191D]">{client.name}</span>
                    <span className="text-[11px] text-stone-500">({loc.city} • {live.timeDiffLabel})</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-stone-400 font-medium">Local Time:</span>
                    <strong className="text-stone-800 font-mono">{live.timeStr}</strong>
                  </div>
                </div>

                {/* 24 Hour blocks */}
                <div className="grid grid-cols-24 gap-0.5 h-6 rounded-lg overflow-hidden border border-[#ECE6DD] bg-stone-100 p-0.5">
                  {hours.map(h => {
                    const st = getClientHourState(client, h);
                    const isHovered = hoveredHour === h;
                    const isCurrent = h === currentFreelancerHour;

                    return (
                      <div
                        key={h}
                        onMouseEnter={() => setHoveredHour(h)}
                        onMouseLeave={() => setHoveredHour(null)}
                        className={`h-full rounded-xs transition-all relative cursor-pointer ${
                          st.type === 'prime' ? 'bg-emerald-500 hover:brightness-110' :
                          st.type === 'work' ? 'bg-blue-500 hover:brightness-110' :
                          st.type === 'sleep' ? 'bg-purple-100/90 hover:bg-purple-200' :
                          'bg-stone-200 hover:bg-stone-300'
                        } ${isHovered ? 'ring-2 ring-blue-600 z-10' : ''}`}
                        title={`${client.name} at ${h}:00 (Your time) -> ${st.label}`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Studio Global Orbit Analytics Footer */}
      <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#ECE6DD] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            {activeCountNow}
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#18191D]">
              Active Client Orbit Right Now
            </h4>
            <p className="text-[11px] text-stone-500">
              {activeCountNow} of {activeClients.length} accounts are currently in active local working or prime response windows.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-white border border-[#ECE6DD] text-stone-700 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            20-Hour Continuous Global Bandwidth
          </span>
        </div>
      </div>
    </div>
  );
};
