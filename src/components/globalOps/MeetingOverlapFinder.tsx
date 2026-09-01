import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  Sparkles, 
  Check, 
  Copy, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  MapPin, 
  Sun, 
  Moon,
  ChevronDown
} from 'lucide-react';
import { Client } from '@/types';
import { findMeetingOverlaps, getClientEffectiveLocation } from '@/utils/timezoneUtils';

interface MeetingOverlapFinderProps {
  clients: Client[];
  freelancerTimezone: string;
  defaultSelectedClientId?: string | null;
}

export const MeetingOverlapFinder: React.FC<MeetingOverlapFinderProps> = ({
  clients,
  freelancerTimezone,
  defaultSelectedClientId
}) => {
  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');
  
  // Selected clients for overlap analysis
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(() => {
    if (defaultSelectedClientId) return [defaultSelectedClientId];
    return activeClients.slice(0, 2).map(c => c.id);
  });

  const [meetingDuration, setMeetingDuration] = useState<number>(25);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('Executive Strategic Sync & Sprint Alignment');

  const selectedClients = activeClients.filter(c => selectedClientIds.includes(c.id));

  // Calculate overlaps
  const overlapSlots = findMeetingOverlaps(
    selectedClients.length > 0 ? selectedClients : activeClients, 
    freelancerTimezone, 
    meetingDuration
  );

  const toggleClientSelection = (id: string) => {
    if (selectedClientIds.includes(id)) {
      if (selectedClientIds.length > 1) {
        setSelectedClientIds(prev => prev.filter(cId => cId !== id));
      }
    } else {
      setSelectedClientIds(prev => [...prev, id]);
    }
  };

  const selectAllClients = () => {
    setSelectedClientIds(activeClients.map(c => c.id));
  };

  const selectedSlot = selectedSlotIndex !== null ? overlapSlots[selectedSlotIndex] : overlapSlots.find(s => s.overlapScore === 'excellent') || overlapSlots[3];

  // Generate copyable calendar invite snippet
  const generateInviteSnippet = () => {
    if (!selectedSlot) return '';
    const clientLines = selectedSlot.clientTimes.map(ct => `• ${ct.clientName} (${ct.city}): ${ct.localTime}`).join('\n');

    return `📅 MEETING INVITATION: ${meetingTitle}\n\n` +
      `⏱️ Duration: ${meetingDuration} minutes\n` +
      `📍 Freelancer Time (${freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Local'}): ${selectedSlot.freelancerTime}\n\n` +
      `🌍 CLIENT LOCAL CONVERTED TIMES:\n${clientLines}\n\n` +
      `🔗 Meeting Link: https://meet.google.com/aedmin-exec-sync\n` +
      `📝 Agenda:\n` +
      `1. Review active sprint milestones & deliverables (10m)\n` +
      `2. Address pending approvals & blockers (10m)\n` +
      `3. Confirm next weekly priorities (5m)\n\n` +
      `*Converted with AEDMIN Global Times*`;
  };

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(generateInviteSnippet());
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#18191D] flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Meeting Overlap Finder
          </h2>
          <p className="text-xs text-[#797E8B]">
            Automated multi-timezone meeting scheduler & cross-client availability optimizer
          </p>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#ECE6DD] text-xs font-semibold">
          <span className="text-stone-400 text-[11px] px-2">Duration:</span>
          {[15, 25, 30, 45, 60].map(dur => (
            <button
              key={dur}
              onClick={() => setMeetingDuration(dur)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                meetingDuration === dur 
                  ? 'bg-blue-600 text-white font-bold shadow-xs' 
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {dur}m
            </button>
          ))}
        </div>
      </div>

      {/* Client Participant Selector Pills */}
      <div className="bg-white rounded-2xl border border-[#ECE6DD] p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#18191D]">Select Meeting Participants:</span>
          <button
            onClick={selectAllClients}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Select All ({activeClients.length})
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {activeClients.map(client => {
            const isSelected = selectedClientIds.includes(client.id);
            const loc = getClientEffectiveLocation(client);
            return (
              <button
                key={client.id}
                onClick={() => toggleClientSelection(client.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-900 border-blue-400 font-bold shadow-xs' 
                    : 'bg-[#FAF8F5] text-stone-500 border-[#ECE6DD] hover:border-stone-300'
                }`}
              >
                <span className="text-base">{loc.flagEmoji}</span>
                <span>{client.name}</span>
                <span className="text-[10px] text-stone-400">({loc.city})</span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 24-Hour Overlap Heatmap Grid */}
      <div className="bg-white rounded-2xl border border-[#ECE6DD] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#797E8B] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Availability Heatmap (Your Time: {freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Local'})
          </h3>

          <div className="flex items-center gap-3 text-[11px] font-medium text-stone-500">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Acceptable</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Off-Hours</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Sleeping</span>
          </div>
        </div>

        {/* Time slots scrollable / grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {overlapSlots.map((slot, idx) => {
            const isSelected = selectedSlot === slot;
            const isOptimal = slot.overlapScore === 'excellent';
            const isGood = slot.overlapScore === 'good';
            const isFair = slot.overlapScore === 'fair';

            return (
              <button
                key={idx}
                onClick={() => setSelectedSlotIndex(idx)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected 
                    ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/50 shadow-sm' 
                    : isOptimal
                    ? 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-500'
                    : isGood
                    ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400'
                    : isFair
                    ? 'bg-amber-50/30 border-amber-200 hover:border-amber-400'
                    : 'bg-stone-50/50 border-stone-200 text-stone-400 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#18191D] font-mono">
                    {slot.freelancerTime}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    isOptimal ? 'bg-emerald-500' : isGood ? 'bg-blue-500' : isFair ? 'bg-amber-500' : 'bg-purple-400'
                  }`} />
                </div>

                <div className="mt-2 space-y-1">
                  {slot.clientTimes.slice(0, 3).map((ct, cIdx) => (
                    <div key={cIdx} className="text-[10px] text-stone-600 flex items-center justify-between truncate">
                      <span className="truncate">{ct.flagEmoji} {ct.city}:</span>
                      <span className="font-mono font-medium ml-1 shrink-0">{ct.localTime.split(' ')[0]}</span>
                    </div>
                  ))}
                  {slot.clientTimes.length > 3 && (
                    <div className="text-[9px] text-stone-400 italic">
                      +{slot.clientTimes.length - 3} more...
                    </div>
                  )}
                </div>

                {isOptimal && (
                  <div className="mt-2 text-[9px] font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded text-center">
                    ★ Best Overlap
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Slot Detailed Breakdown & Invite Generator */}
      {selectedSlot && (
        <div className="bg-white rounded-2xl border border-[#ECE6DD] p-5 space-y-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#ECE6DD]">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Selected Meeting Slot</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  selectedSlot.overlapScore === 'excellent' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                  selectedSlot.overlapScore === 'good' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                  selectedSlot.overlapScore === 'fair' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-stone-100 text-stone-800 border-stone-300'
                }`}>
                  {selectedSlot.overlapScore === 'excellent' ? '★ Prime Multi-Timezone Overlap' : selectedSlot.overlapScore.toUpperCase()}
                </span>
              </div>
              <h3 className="text-lg font-black text-[#18191D] mt-0.5">
                {selectedSlot.freelancerTime} ({freelancerTimezone.split('/')[1]?.replace('_', ' ') || 'Your Time'})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">{selectedSlot.recommendation}</p>
            </div>

            <button
              onClick={handleCopyInvite}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedInvite ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedInvite ? 'Calendar Invite Copied!' : 'Copy Multi-Timezone Invite'}</span>
            </button>
          </div>

          {/* Participant breakdown grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {selectedSlot.clientTimes.map(ct => (
              <div key={ct.clientId} className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE6DD] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{ct.flagEmoji}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    ct.status === 'optimal' ? 'bg-emerald-100 text-emerald-800' :
                    ct.status === 'acceptable' ? 'bg-blue-100 text-blue-800' :
                    ct.status === 'sleeping' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {ct.status}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#18191D]">{ct.clientName}</h4>
                <p className="text-[11px] text-stone-500">{ct.city}</p>
                <div className="text-sm font-black font-mono text-[#18191D] pt-1">
                  {ct.localTime}
                </div>
              </div>
            ))}
          </div>

          {/* Formatted Invite Snippet Preview */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Formatted Calendar Invite Preview
            </span>
            <pre className="text-xs font-mono bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE6DD] text-stone-700 whitespace-pre-wrap leading-relaxed">
              {generateInviteSnippet()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
