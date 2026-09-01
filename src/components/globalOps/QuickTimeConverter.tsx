import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  Sun, 
  Moon, 
  CheckCircle2, 
  Users, 
  HelpCircle,
  Sliders,
  Share2
} from 'lucide-react';
import { Client } from '@/types';
import { 
  getClientEffectiveLocation, 
  convertFreelancerToClientTime, 
  formatMinutesToTime,
  parseTimeToMinutes
} from '@/utils/timezoneUtils';

interface QuickTimeConverterProps {
  clients: Client[];
  freelancerTimezone: string;
  onOpenCommsWithClient?: (client: Client) => void;
}

export const QuickTimeConverter: React.FC<QuickTimeConverterProps> = ({
  clients,
  freelancerTimezone,
  onOpenCommsWithClient
}) => {
  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');

  const [dateStr, setDateStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedMinutes, setSelectedMinutes] = useState(14 * 60); // 2:00 PM
  const [eventName, setEventName] = useState('Sync & Milestone Hand-off');
  const [copiedText, setCopiedText] = useState(false);
  const [sourceMode, setSourceMode] = useState<'freelancer' | string>('freelancer');

  const formattedFreelancerTime = formatMinutesToTime(selectedMinutes);
  const timeStr = `${Math.floor(selectedMinutes / 60).toString().padStart(2, '0')}:${(selectedMinutes % 60).toString().padStart(2, '0')}`;

  const presets = [
    { label: '9:00 AM (Morning)', minutes: 9 * 60 },
    { label: '12:00 PM (Noon)', minutes: 12 * 60 },
    { label: '2:00 PM (Afternoon)', minutes: 14 * 60 },
    { label: '5:00 PM (EOD)', minutes: 17 * 60 },
    { label: '8:00 PM (Evening)', minutes: 20 * 60 },
    { label: 'Live Now', minutes: new Date().getHours() * 60 + new Date().getMinutes() }
  ];

  // Convert for each client
  const conversions = activeClients.map(client => {
    const conversion = convertFreelancerToClientTime(dateStr, timeStr, client, freelancerTimezone);
    const loc = getClientEffectiveLocation(client);

    // Compute hour of converted client
    const [hStr, mStr] = (conversion.clientTimeStr.split(' ')[0] || '12:00').split(':');
    const isPM = conversion.clientTimeStr.includes('PM');
    let h = parseInt(hStr, 10);
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;
    const clientMin = h * 60 + parseInt(mStr || '0', 10);

    const workStart = parseTimeToMinutes(client.workingHoursStart || '09:00');
    const workEnd = parseTimeToMinutes(client.workingHoursEnd || '17:30');
    const commsStart = parseTimeToMinutes(client.preferredCommsStart || '10:00');
    const commsEnd = parseTimeToMinutes(client.preferredCommsEnd || '16:30');

    let availabilityBadge = {
      label: 'Off-Hours',
      color: 'bg-stone-100 text-stone-700 border-stone-200',
      icon: Moon
    };

    if (clientMin >= commsStart && clientMin <= commsEnd) {
      availabilityBadge = {
        label: 'Prime Comms Window',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: Sun
      };
    } else if (clientMin >= workStart && clientMin <= workEnd) {
      availabilityBadge = {
        label: 'Working Hours',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Sun
      };
    } else if (h >= 22 || h < 7) {
      availabilityBadge = {
        label: 'Asleep / Night',
        color: 'bg-purple-100 text-purple-800 border-purple-300',
        icon: Moon
      };
    }

    return {
      client,
      loc,
      conversion,
      availabilityBadge,
      isDaytime: h >= 6 && h < 20
    };
  });

  const generateSnippet = () => {
    const lines = conversions.map(item => 
      `• ${item.client.name} (${item.loc.city}, ${item.loc.country}): ${item.conversion.clientDate} at ${item.conversion.clientTimeStr} [${item.conversion.timeDifferenceLabel}]`
    ).join('\n');

    return `🕒 GLOBAL TIMEZONE CONVERSION: ${eventName}\n\n` +
      `📅 Date: ${dateStr}\n` +
      `📍 Freelancer HQ (${freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Local'}): ${formattedFreelancerTime}\n\n` +
      `🌍 CLIENT LOCAL TIMES:\n${lines}\n\n` +
      `*Generated with AEDMIN Global Times*`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSnippet());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Guide */}
      <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold uppercase tracking-wider">
              Instant 2-Way Converter
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Simultaneous calculations for all accounts
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#18191D] mt-1 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-purple-600" />
            Quick Time Converter
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Pick any time in your day to immediately see what time it will be for your international clients, whether they will be awake, and copy a clean time schedule for emails or messages.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs shrink-0 self-start md:self-auto"
        >
          {copiedText ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Copied Schedule!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Converted Times</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Controls & Slider */}
      <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#ECE6DD] text-xs font-medium text-[#18191D] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>Freelancer HQ Time ({freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Local'})</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={timeStr}
                onChange={(e) => {
                  if (e.target.value) {
                    const [h, m] = e.target.value.split(':').map(Number);
                    setSelectedMinutes(h * 60 + m);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#ECE6DD] text-xs font-medium text-[#18191D] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none font-mono"
              />
              <span className="text-xs font-bold px-3 py-2 bg-white rounded-xl border border-[#ECE6DD] font-mono text-purple-700 shrink-0">
                {formattedFreelancerTime}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-stone-500" />
              <span>Event / Label</span>
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Milestone hand-off, Sprint sync..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#ECE6DD] text-xs font-medium text-[#18191D] focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 outline-none"
            />
          </div>
        </div>

        {/* 24-Hour Slider */}
        <div className="pt-2 border-t border-[#ECE6DD] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              Interactive Time Slider:
            </span>
            <span className="font-mono text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full text-xs">
              {formattedFreelancerTime} (HQ)
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="1439"
            step="15"
            value={selectedMinutes}
            onChange={(e) => setSelectedMinutes(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />

          {/* Quick preset buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMinutes(preset.minutes)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  Math.abs(selectedMinutes - preset.minutes) < 10
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-[#ECE6DD] hover:border-purple-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Converted Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Simultaneous Client Converted Times ({conversions.length} Clients)
          </h3>
          <span className="text-xs text-stone-400 font-medium">
            Based on {formattedFreelancerTime} {freelancerTimezone.split('/')[1]?.replace('_', ' ')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {conversions.map(({ client, loc, conversion, availabilityBadge, isDaytime }) => {
            const BadgeIcon = availabilityBadge.icon;

            return (
              <div
                key={client.id}
                className="bg-white p-4 rounded-2xl border border-[#ECE6DD] shadow-xs hover:border-purple-300 transition-all flex flex-col justify-between space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl select-none" role="img" aria-label={loc.country}>
                      {loc.flagEmoji}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#18191D] group-hover:text-purple-700 transition-colors">
                        {client.name}
                      </h4>
                      <p className="text-[11px] text-stone-500">
                        {loc.city}, {loc.country}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${availabilityBadge.color}`}>
                    <BadgeIcon className="w-3 h-3" />
                    <span>{availabilityBadge.label}</span>
                  </span>
                </div>

                {/* Big Time Display */}
                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE6DD] flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-[#18191D] font-mono tracking-tight block">
                      {conversion.clientTimeStr}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {conversion.clientDate}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md block">
                      {conversion.timeDifferenceLabel}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                      {loc.timezone.split('/')[1]?.replace('_', ' ') || loc.timezone}
                    </span>
                  </div>
                </div>

                {/* Footer with action if comms needed */}
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    {isDaytime ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-indigo-500" />}
                    <span>{isDaytime ? 'Daytime' : 'Night'}</span>
                  </span>

                  {onOpenCommsWithClient && (
                    <button
                      onClick={() => onOpenCommsWithClient(client)}
                      className="text-purple-700 font-bold hover:underline"
                    >
                      Draft update →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
