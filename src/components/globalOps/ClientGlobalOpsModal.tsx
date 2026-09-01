import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  Clock, 
  Plane, 
  Sparkles, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  MessageSquare, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Client } from '@/types';
import { COMMON_TIMEZONES } from '@/utils/timezoneUtils';
import { ALL_COUNTRIES, findCountryByNameOrCode } from '@/utils/countryData';

interface ClientGlobalOpsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientId: string, updates: Partial<Client>) => void;
}

export const ClientGlobalOpsModal: React.FC<ClientGlobalOpsModalProps> = ({
  client,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen || !client) return null;

  const [timezone, setTimezone] = useState(client.timezone || 'America/New_York');
  const [city, setCity] = useState(client.city || 'New York');
  const [country, setCountry] = useState(client.country || 'United States');
  const [countryCode, setCountryCode] = useState(client.countryCode || 'US');
  const [flagEmoji, setFlagEmoji] = useState(client.flagEmoji || '🇺🇸');

  const [workingHoursStart, setWorkingHoursStart] = useState(client.workingHoursStart || '09:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState(client.workingHoursEnd || '17:30');
  const [preferredCommsStart, setPreferredCommsStart] = useState(client.preferredCommsStart || '10:00');
  const [preferredCommsEnd, setPreferredCommsEnd] = useState(client.preferredCommsEnd || '16:30');
  const [meetingAvailabilityStart, setMeetingAvailabilityStart] = useState(client.meetingAvailabilityStart || '10:30');
  const [meetingAvailabilityEnd, setMeetingAvailabilityEnd] = useState(client.meetingAvailabilityEnd || '16:00');

  // Travel Mode fields
  const [isTravelModeActive, setIsTravelModeActive] = useState(Boolean(client.isTravelModeActive));
  const [travelCity, setTravelCity] = useState(client.travelCity || '');
  const [travelCountry, setTravelCountry] = useState(client.travelCountry || '');
  const [travelTimezone, setTravelTimezone] = useState(client.travelTimezone || 'Europe/Paris');
  const [travelStartDate, setTravelStartDate] = useState(client.travelStartDate || '');
  const [travelEndDate, setTravelEndDate] = useState(client.travelEndDate || '');
  const [travelReason, setTravelReason] = useState(client.travelReason || '');

  // Learned Patterns
  const [learnedPatterns, setLearnedPatterns] = useState(client.learnedPatterns || [
    { pattern: 'Responds fastest to Slack messages in late morning', confidence: 'high', observedTimes: '10:30 - 11:45' }
  ]);
  const [newPatternText, setNewPatternText] = useState('');

  const handleTimezoneSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tzValue = e.target.value;
    setTimezone(tzValue);
    const match = COMMON_TIMEZONES.find(t => t.value === tzValue);
    if (match) {
      setCity(match.city);
      setCountry(match.country);
      setCountryCode(match.code);
      setFlagEmoji(match.flag);
    }
  };

  const handleAddPattern = () => {
    if (!newPatternText.trim()) return;
    setLearnedPatterns(prev => [
      ...prev,
      { pattern: newPatternText.trim(), confidence: 'high', observedTimes: 'Observed by Assistant' }
    ]);
    setNewPatternText('');
  };

  const handleDeletePattern = (idx: number) => {
    setLearnedPatterns(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(client.id, {
      timezone,
      city,
      country,
      countryCode,
      flagEmoji,
      workingHoursStart,
      workingHoursEnd,
      preferredCommsStart,
      preferredCommsEnd,
      meetingAvailabilityStart,
      meetingAvailabilityEnd,
      isTravelModeActive,
      travelCity: isTravelModeActive ? travelCity : undefined,
      travelCountry: isTravelModeActive ? travelCountry : undefined,
      travelTimezone: isTravelModeActive ? travelTimezone : undefined,
      travelStartDate: isTravelModeActive ? travelStartDate : undefined,
      travelEndDate: isTravelModeActive ? travelEndDate : undefined,
      travelReason: isTravelModeActive ? travelReason : undefined,
      learnedPatterns
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-[#ECE6DD] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{flagEmoji}</span>
            <div>
              <h2 className="text-base font-bold text-[#18191D]">Global Operations Intelligence</h2>
              <p className="text-xs text-[#797E8B]">Configure timezone, working windows, and travel parameters for {client.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Location & Timezone */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Primary Timezone & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Timezone Preset</label>
                <select
                  value={timezone}
                  onChange={handleTimezoneSelectChange}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] bg-white focus:ring-2 focus:ring-purple-500"
                >
                  {COMMON_TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>
                      {tz.flag} {tz.city} ({tz.label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">IANA Timezone String</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] font-mono focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Country (Full Global Directory)</label>
                <select
                  value={country}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    setCountry(selectedName);
                    const found = findCountryByNameOrCode(selectedName);
                    if (found) {
                      setCountryCode(found.code);
                      setFlagEmoji(found.flag);
                      if (found.timezone && !timezone) {
                        setTimezone(found.timezone);
                      }
                    }
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] bg-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a country...</option>
                  {ALL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">Flag & Code</label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-1 bg-stone-100 rounded-lg border border-stone-200">{flagEmoji || '🌐'}</span>
                  <input
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                    placeholder="ISO Code"
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] font-mono uppercase focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Operating Windows */}
          <div className="space-y-3 pt-3 border-t border-[#ECE6DD]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Operating & Availability Windows (Client Local Time)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE6DD] space-y-2">
                <span className="text-[11px] font-bold text-stone-700 block">Working Hours</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="time"
                    value={workingHoursStart}
                    onChange={(e) => setWorkingHoursStart(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-[#ECE6DD] bg-white font-mono"
                  />
                  <input
                    type="time"
                    value={workingHoursEnd}
                    onChange={(e) => setWorkingHoursEnd(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE6DD] space-y-2">
                <span className="text-[11px] font-bold text-stone-700 block">Prime Comms Window</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="time"
                    value={preferredCommsStart}
                    onChange={(e) => setPreferredCommsStart(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-[#ECE6DD] bg-white font-mono"
                  />
                  <input
                    type="time"
                    value={preferredCommsEnd}
                    onChange={(e) => setPreferredCommsEnd(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE6DD] space-y-2">
                <span className="text-[11px] font-bold text-stone-700 block">Meeting Availability</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="time"
                    value={meetingAvailabilityStart}
                    onChange={(e) => setMeetingAvailabilityStart(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-[#ECE6DD] bg-white font-mono"
                  />
                  <input
                    type="time"
                    value={meetingAvailabilityEnd}
                    onChange={(e) => setMeetingAvailabilityEnd(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-[#ECE6DD] bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Travel Mode */}
          <div className="space-y-3 pt-3 border-t border-[#ECE6DD]">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" />
                Active Executive Travel Mode
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                <input
                  type="checkbox"
                  checked={isTravelModeActive}
                  onChange={(e) => setIsTravelModeActive(e.target.checked)}
                  className="rounded border-[#ECE6DD] text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Travel Mode Active</span>
              </label>
            </div>

            {isTravelModeActive && (
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-amber-900 block mb-1">Destination City</label>
                    <input
                      type="text"
                      placeholder="e.g. Paris, Tokyo"
                      value={travelCity}
                      onChange={(e) => setTravelCity(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-900 block mb-1">Destination Country</label>
                    <select
                      value={travelCountry}
                      onChange={(e) => {
                        const sel = e.target.value;
                        setTravelCountry(sel);
                        const match = findCountryByNameOrCode(sel);
                        if (match && match.timezone) {
                          setTravelTimezone(match.timezone);
                        }
                      }}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                    >
                      <option value="">Select country...</option>
                      {ALL_COUNTRIES.map(c => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-900 block mb-1">Temporary Timezone</label>
                    <select
                      value={travelTimezone}
                      onChange={(e) => setTravelTimezone(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                    >
                      {COMMON_TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.flag} {tz.city} ({tz.value})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-amber-900 block mb-1">Travel Return Date</label>
                    <input
                      type="date"
                      value={travelEndDate}
                      onChange={(e) => setTravelEndDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-900 block mb-1">Mission / Reason</label>
                    <input
                      type="text"
                      placeholder="e.g. European Partner Summit"
                      value={travelReason}
                      onChange={(e) => setTravelReason(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Learned Behavioral Patterns */}
          <div className="space-y-3 pt-3 border-t border-[#ECE6DD]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Learned Client Behavioral Patterns
            </h3>

            <div className="space-y-2">
              {learnedPatterns.map((pat, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF8F5] border border-[#ECE6DD] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                    <span className="text-stone-800 font-medium">{pat.pattern}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePattern(idx)}
                    className="text-stone-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add custom behavioral observation (e.g. Signs off deliverables at 3 PM)..."
                  value={newPatternText}
                  onChange={(e) => setNewPatternText(e.target.value)}
                  className="flex-1 text-xs p-2.5 rounded-xl border border-[#ECE6DD] focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleAddPattern}
                  className="px-3 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-[#ECE6DD] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save Global Ops Parameters</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
