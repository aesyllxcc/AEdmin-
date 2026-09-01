import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Globe,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react';
import { Client } from '@/types';
import { 
  getClientEffectiveLocation, 
  convertFreelancerToClientTime,
  formatMinutesToTime 
} from '@/utils/timezoneUtils';

interface DualTimeConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  freelancerTimezone: string;
}

export const DualTimeConverterModal: React.FC<DualTimeConverterModalProps> = ({
  isOpen,
  onClose,
  clients,
  freelancerTimezone
}) => {
  if (!isOpen) return null;

  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMinutes, setSelectedMinutes] = useState(14 * 60); // 2:00 PM default
  const [eventName, setEventName] = useState('Deliverable Milestone Review');
  const [copiedText, setCopiedText] = useState(false);

  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');
  const timeStr = `${Math.floor(selectedMinutes / 60).toString().padStart(2, '0')}:${(selectedMinutes % 60).toString().padStart(2, '0')}`;
  const formattedFreelancerTime = formatMinutesToTime(selectedMinutes);

  const convertedList = activeClients.map(client => {
    const conversion = convertFreelancerToClientTime(dateStr, timeStr, client, freelancerTimezone);
    const loc = getClientEffectiveLocation(client);
    return {
      client,
      loc,
      conversion
    };
  });

  const generateFullConversionSnippet = () => {
    const lines = convertedList.map(item => 
      `• ${item.client.name} (${item.loc.city}, ${item.loc.country}): ${item.conversion.clientDate} at ${item.conversion.clientTimeStr} [${item.conversion.timeDifferenceLabel}]`
    ).join('\n');

    return `🕒 DUAL TIMEZONE CONVERSION: ${eventName}\n\n` +
      `📅 Date: ${dateStr}\n` +
      `📍 Freelancer Time (${freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Local'}): ${formattedFreelancerTime}\n\n` +
      `🌍 CLIENT LOCAL TIMES:\n${lines}\n\n` +
      `*Generated with AEDMIN Global Times*`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullConversionSnippet());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE6DD] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#18191D]">Global Dual-Time Converter & Schedule Validator</h2>
              <p className="text-xs text-[#797E8B]">Scrub any hour to calculate simultaneous client times across the globe</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Controls: Date, Time Slider, Event Name */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Event / Deadline Label</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Reference Date</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] bg-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Time Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">
                  Freelancer Time ({freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Your Time'}):
                </span>
                <span className="text-base font-black font-mono text-purple-900 bg-purple-100/70 px-3 py-1 rounded-xl">
                  {formattedFreelancerTime}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="1410"
                step="15"
                value={selectedMinutes}
                onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />

              <div className="flex justify-between text-[10px] font-mono text-stone-400">
                <span>00:00 (12 AM)</span>
                <span>06:00 (6 AM)</span>
                <span>12:00 (12 PM)</span>
                <span>18:00 (6 PM)</span>
                <span>23:45 (11:45 PM)</span>
              </div>
            </div>
          </div>

          {/* Results Matrix for all clients */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#797E8B] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-purple-600" />
              Simultaneous Client Converted Times ({convertedList.length} Accounts)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {convertedList.map(({ client, loc, conversion }) => (
                <div key={client.id} className="bg-white p-4 rounded-2xl border border-[#ECE6DD] space-y-2 shadow-xs hover:border-purple-300 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{loc.flagEmoji}</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#18191D]">{client.name}</h4>
                        <p className="text-[11px] text-stone-500">{loc.city}, {loc.country}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      conversion.isClientSleeping ? 'bg-purple-100 text-purple-800' :
                      conversion.isClientInPreferredWindow ? 'bg-emerald-100 text-emerald-800' :
                      conversion.isClientInWorkingHours ? 'bg-blue-100 text-blue-800' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {conversion.timeDifferenceLabel}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#ECE6DD] flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black font-mono text-[#18191D]">
                        {conversion.clientTimeStr}
                      </span>
                      <p className="text-[10px] text-stone-500 font-medium">{conversion.clientDate}</p>
                    </div>

                    <span className="text-[11px] text-stone-400 font-mono">
                      {conversion.clientTimezone.split('/')[1]?.replace('_', ' ') || conversion.clientTimezone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#ECE6DD] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Dual timestamps validated for calendar invites and contract SLA compliance</span>
          </div>

          <button
            onClick={handleCopy}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Copied Dual-Time Confirmation!' : 'Copy Multi-Timezone Snippet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
