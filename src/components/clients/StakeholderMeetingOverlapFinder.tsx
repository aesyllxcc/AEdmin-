import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Sparkles, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import { Client } from '@/types';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  timezone: string;
  city: string;
  workStartHour: number; // 9 = 9 AM
  workEndHour: number;   // 17 = 5 PM
}

interface StakeholderMeetingOverlapFinderProps {
  client: Client;
}

export const StakeholderMeetingOverlapFinder: React.FC<StakeholderMeetingOverlapFinderProps> = ({ client }) => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([
    {
      id: 'st_1',
      name: client.primaryContact,
      role: 'Principal / Client',
      timezone: client.timezone || 'America/New_York',
      city: 'New York (EST)',
      workStartHour: 9,
      workEndHour: 18
    },
    {
      id: 'st_2',
      name: 'Sarah Jenkins',
      role: 'Lead Investor / Board Member',
      timezone: 'Europe/London',
      city: 'London (GMT)',
      workStartHour: 9,
      workEndHour: 17
    },
    {
      id: 'st_3',
      name: 'Kenji Sato',
      role: 'APAC Managing Partner',
      timezone: 'Asia/Tokyo',
      city: 'Tokyo (JST)',
      workStartHour: 9,
      workEndHour: 18
    }
  ]);

  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newTimezone, setNewTimezone] = useState('America/Los_Angeles');
  const [newCity, setNewCity] = useState('San Francisco (PST)');
  const [meetingDuration, setMeetingDuration] = useState<30 | 45 | 60>(30);
  const [copiedSlot, setCopiedSlot] = useState<string | null>(null);

  const timezonesList = [
    { value: 'America/New_York', city: 'New York (EST/EDT, UTC-5)' },
    { value: 'America/Los_Angeles', city: 'San Francisco / LA (PST/PDT, UTC-8)' },
    { value: 'America/Chicago', city: 'Chicago (CST/CDT, UTC-6)' },
    { value: 'Europe/London', city: 'London (GMT/BST, UTC+0)' },
    { value: 'Europe/Paris', city: 'Paris / Berlin (CET/CEST, UTC+1)' },
    { value: 'Asia/Dubai', city: 'Dubai (GST, UTC+4)' },
    { value: 'Asia/Singapore', city: 'Singapore (SGT, UTC+8)' },
    { value: 'Asia/Manila', city: 'Manila (PHT, UTC+8)' },
    { value: 'Asia/Tokyo', city: 'Tokyo (JST, UTC+9)' },
    { value: 'Australia/Sydney', city: 'Sydney (AEST/AEDT, UTC+10)' }
  ];

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const matchedTz = timezonesList.find(t => t.value === newTimezone);
    const newPerson: Stakeholder = {
      id: `st_${Date.now()}`,
      name: newName.trim(),
      role: newRole.trim() || 'Stakeholder',
      timezone: newTimezone,
      city: matchedTz ? matchedTz.city : newCity,
      workStartHour: 9,
      workEndHour: 18
    };

    setStakeholders([...stakeholders, newPerson]);
    setNewName('');
    setNewRole('');
  };

  const handleRemoveStakeholder = (id: string) => {
    if (stakeholders.length <= 1) return;
    setStakeholders(stakeholders.filter(s => s.id !== id));
  };

  // Calculate timezone offsets relative to UTC
  const getHourInTz = (utcHour: number, tz: string) => {
    const d = new Date();
    d.setUTCHours(utcHour, 0, 0, 0);
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      hour12: false
    });
    const hourVal = parseInt(formatter.format(d), 10);
    return isNaN(hourVal) ? (utcHour % 24) : hourVal;
  };

  // Find best overlap windows across all 24 UTC hours
  const evaluatedHours = Array.from({ length: 24 }, (_, utcHour) => {
    const scores = stakeholders.map(s => {
      const localHour = getHourInTz(utcHour, s.timezone);
      if (localHour >= s.workStartHour && localHour < s.workEndHour) {
        return { status: 'prime', localHour, person: s.name };
      } else if ((localHour >= 7 && localHour < s.workStartHour) || (localHour >= s.workEndHour && localHour <= 21)) {
        return { status: 'acceptable', localHour, person: s.name };
      } else {
        return { status: 'sleep', localHour, person: s.name };
      }
    });

    const isAllPrime = scores.every(s => s.status === 'prime');
    const isFeasible = scores.every(s => s.status === 'prime' || s.status === 'acceptable');
    const hasSleep = scores.some(s => s.status === 'sleep');

    return {
      utcHour,
      scores,
      isAllPrime,
      isFeasible,
      hasSleep
    };
  });

  const bestHours = evaluatedHours.filter(h => h.isFeasible);

  const formatLocalTime = (utcHour: number, tz: string) => {
    const d = new Date();
    d.setUTCHours(utcHour, 0, 0, 0);
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(d);
  };

  const copyProposedSlot = (utcHour: number) => {
    const lines = stakeholders.map(s => `• ${s.name} (${s.role}): ${formatLocalTime(utcHour, s.timezone)}`).join('\n');
    const text = `Proposed ${meetingDuration}-minute Meeting Window:\n${lines}\n\nAgenda: Executive Strategic Alignment`;
    navigator.clipboard.writeText(text);
    setCopiedSlot(`slot_${utcHour}`);
    setTimeout(() => setCopiedSlot(null), 2000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-[#ECE6DD] shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#ECE6DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 flex items-center gap-1 uppercase">
              <Globe className="w-3 h-3" />
              Global Meeting Intelligence
            </span>
            <span className="text-xs text-stone-500 font-medium">Multi-Timezone Overlap Solver</span>
          </div>
          <h3 className="text-xl font-extrabold text-[#18191D] mt-1">
            Stakeholder Meeting Overlap Finder
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Identify friction-free meeting windows across multi-continent participants without waking anyone up.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-2xl border border-[#ECE6DD] text-xs font-bold">
          {[30, 45, 60].map(dur => (
            <button
              key={dur}
              onClick={() => setMeetingDuration(dur as any)}
              className={`px-3 py-1 rounded-xl transition-all ${
                meetingDuration === dur ? 'bg-[#18191D] text-white shadow-xs' : 'text-stone-500 hover:text-black'
              }`}
            >
              {dur} Min
            </button>
          ))}
        </div>
      </div>

      {/* Stakeholders List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Active Meeting Participants ({stakeholders.length})
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stakeholders.map((person) => {
            const now = new Date();
            const currentLocalTime = new Intl.DateTimeFormat('en-US', {
              timeZone: person.timezone,
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            }).format(now);

            return (
              <div key={person.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DD] flex items-start justify-between gap-2 relative group">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 text-[10px] font-black flex items-center justify-center">
                      {person.name.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-[#18191D]">{person.name}</span>
                  </div>
                  <p className="text-[11px] text-stone-500">{person.role}</p>
                  <div className="flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span className="text-[11px] font-semibold text-stone-700">{person.city}</span>
                  </div>
                  <span className="inline-block text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-1">
                    Now: {currentLocalTime}
                  </span>
                </div>

                {stakeholders.length > 1 && (
                  <button
                    onClick={() => handleRemoveStakeholder(person.id)}
                    className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 transition-opacity p-1"
                    title="Remove participant"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Stakeholder Form */}
      <form onSubmit={handleAddStakeholder} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DD] flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-bold text-stone-700 shrink-0">Add Participant:</span>
        <input
          type="text"
          required
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Full Name (e.g. Alex Rivera)"
          className="text-xs p-2 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none flex-1 min-w-[150px]"
        />
        <input
          type="text"
          value={newRole}
          onChange={e => setNewRole(e.target.value)}
          placeholder="Role (e.g. Legal Counsel)"
          className="text-xs p-2 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none flex-1 min-w-[130px]"
        />
        <select
          value={newTimezone}
          onChange={e => {
            setNewTimezone(e.target.value);
            const found = timezonesList.find(t => t.value === e.target.value);
            if (found) setNewCity(found.city);
          }}
          className="text-xs p-2 bg-white rounded-xl border border-[#ECE6DD] focus:outline-none flex-1 min-w-[180px]"
        >
          {timezonesList.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.city}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-[#18191D] hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {/* 24-Hour Overlap Heat Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            24-Hour Global Timeline Overlap Matrix
          </h4>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-stone-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Prime Working Hours (9 AM - 6 PM)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              Acceptable Buffer (7-9 AM / 6-9 PM)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
              Sleep / Off-Hours
            </span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="min-w-[700px] border border-[#ECE6DD] rounded-2xl overflow-hidden bg-white">
            {stakeholders.map(person => (
              <div key={person.id} className="flex items-center border-b border-[#ECE6DD] last:border-0 hover:bg-[#FAF8F5]/50 transition-colors">
                <div className="w-48 p-3 text-xs font-bold text-[#18191D] truncate border-r border-[#ECE6DD] bg-[#FAF8F5]/30">
                  {person.name}
                  <span className="block text-[10px] text-stone-400 font-normal truncate">{person.city}</span>
                </div>
                <div className="flex-1 grid grid-cols-24 gap-0.5 p-1">
                  {Array.from({ length: 24 }).map((_, utcHour) => {
                    const localH = getHourInTz(utcHour, person.timezone);
                    const isPrime = localH >= person.workStartHour && localH < person.workEndHour;
                    const isBuffer = (localH >= 7 && localH < person.workStartHour) || (localH >= person.workEndHour && localH <= 21);

                    return (
                      <div
                        key={utcHour}
                        title={`UTC ${utcHour}:00 -> Local ${localH}:00 for ${person.name}`}
                        className={`h-7 rounded-sm flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                          isPrime 
                            ? 'bg-emerald-500 text-white' 
                            : isBuffer 
                            ? 'bg-amber-300 text-amber-950' 
                            : 'bg-rose-100 text-rose-400'
                        }`}
                      >
                        {localH}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Best Windows List & Conflict Detection Matrix */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Recommended Optimal Meeting Windows ({bestHours.length} Feasible)
          </h4>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Conflict Detection Matrix Active
          </span>
        </div>

        {bestHours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bestHours.slice(0, 4).map(slot => (
              <div 
                key={slot.utcHour}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#ECE6DD] flex flex-col justify-between gap-3 hover:border-black/20 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {slot.isAllPrime ? '100% Mutual Working Hours (Zero Friction)' : 'Acceptable Buffer (Minor Deviation)'}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-stone-400">
                      UTC {slot.utcHour.toString().padStart(2, '0')}:00
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#18191D]">
                    {stakeholders.map(s => {
                      const localH = getHourInTz(slot.utcHour, s.timezone);
                      const isBuffer = (localH >= 7 && localH < s.workStartHour) || (localH >= s.workEndHour && localH <= 21);
                      return (
                        <div key={s.id} className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-stone-700 flex items-center gap-1">
                            {s.name}:
                            {isBuffer && <span className="text-[10px] text-amber-700 bg-amber-100 px-1 rounded font-normal">Early/Late</span>}
                          </span>
                          <span className="font-mono font-bold text-purple-800 bg-purple-50 px-1.5 py-0.5 rounded">
                            {formatLocalTime(slot.utcHour, s.timezone)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => copyProposedSlot(slot.utcHour)}
                  className="w-full py-2 bg-white border border-[#ECE6DD] hover:bg-stone-100 text-[#18191D] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  {copiedSlot === `slot_${slot.utcHour}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSlot === `slot_${slot.utcHour}` ? 'Copied to Clipboard!' : 'Copy Slot Invitation'}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Extreme timezone disparity detected across {stakeholders.length} participants. Consider an asynchronous executive briefing or split-session format.
            </span>
          </div>
        )}

        {/* Conflict Detection Matrix Panel */}
        <div className="p-5 bg-white rounded-2xl border border-[#ECE6DD] shadow-2xs space-y-3 mt-4">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-text-main flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              Cross-Timezone Friction & Conflict Detection Matrix
            </h5>
            <span className="text-[10px] font-bold text-stone-500 uppercase">
              Automated Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Prime Overlap Windows</span>
              <p className="text-base font-extrabold text-text-main">{evaluatedHours.filter(h => h.isAllPrime).length} Hours</p>
              <p className="text-[11px] text-text-muted">Zero-friction slots where all participants are within 9am-6pm.</p>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Buffer Overlap Windows</span>
              <p className="text-base font-extrabold text-text-main">{evaluatedHours.filter(h => h.isFeasible && !h.isAllPrime).length} Hours</p>
              <p className="text-[11px] text-text-muted">Acceptable early morning or evening hours (7-9am or 6-9pm).</p>
            </div>

            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">High Conflict Zones</span>
              <p className="text-base font-extrabold text-text-main">{evaluatedHours.filter(h => h.hasSleep).length} Hours</p>
              <p className="text-[11px] text-text-muted">Avoid completely: overlaps with deep night (10pm-6am) for 1+ stakeholder.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
