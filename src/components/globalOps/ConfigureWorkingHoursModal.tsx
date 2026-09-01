import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Globe, 
  Building2, 
  User, 
  Calendar, 
  Sparkles, 
  Save, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  Sun, 
  Moon, 
  Briefcase, 
  ShieldAlert, 
  Users,
  Coffee,
  Plane
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Client, ClientStakeholder, ClientHoliday } from '@/types';
import { COMMON_TIMEZONES } from '@/utils/timezoneUtils';
import { ALL_COUNTRIES, findCountryByNameOrCode } from '@/utils/countryData';
import { CountrySelect } from '@/components/common/CountrySelect';

interface ConfigureWorkingHoursModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'freelancer' | 'clients' | 'stakeholders' | 'holidays';
}

export const ConfigureWorkingHoursModal: React.FC<ConfigureWorkingHoursModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'freelancer'
}) => {
  const { 
    userProfile, 
    updateUserProfile, 
    clients, 
    updateClient, 
    holidays, 
    addHoliday, 
    deleteHoliday 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'freelancer' | 'clients' | 'stakeholders' | 'holidays'>(initialTab);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Freelancer HQ State
  const [userCountry, setUserCountry] = useState(userProfile.country || 'United States');
  const [userCountryCode, setUserCountryCode] = useState(userProfile.countryCode || 'US');
  const [userFlagEmoji, setUserFlagEmoji] = useState(userProfile.flagEmoji || '🇺🇸');
  const [userCity, setUserCity] = useState(userProfile.city || 'New York');
  const [userTimezone, setUserTimezone] = useState(userProfile.timezone?.split(' ')[0] || userProfile.defaultTimezone || 'America/New_York');
  const [workingHoursStart, setWorkingHoursStart] = useState(userProfile.workingHoursStart || '08:30');
  const [workingHoursEnd, setWorkingHoursEnd] = useState(userProfile.workingHoursEnd || '17:30');
  const [businessHoursStart, setBusinessHoursStart] = useState(userProfile.businessHoursStart || '08:00');
  const [businessHoursEnd, setBusinessHoursEnd] = useState(userProfile.businessHoursEnd || '18:00');
  const [endOfShiftTime, setEndOfShiftTime] = useState(userProfile.endOfShiftTime || '17:30');
  const [endOfShiftWindowStart, setEndOfShiftWindowStart] = useState(userProfile.endOfShiftWindowStart || '17:00');
  const [endOfShiftWindowEnd, setEndOfShiftWindowEnd] = useState(userProfile.endOfShiftWindowEnd || '18:00');
  const [workingDays, setWorkingDays] = useState<string[]>(userProfile.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  // Selected Client for editing
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Client form states
  const [cliCountry, setCliCountry] = useState(selectedClient?.country || 'United States');
  const [cliCity, setCliCity] = useState(selectedClient?.city || 'New York');
  const [cliTimezone, setCliTimezone] = useState(selectedClient?.timezone || 'America/New_York');
  const [cliWorkingHoursStart, setCliWorkingHoursStart] = useState(selectedClient?.workingHoursStart || '09:00');
  const [cliWorkingHoursEnd, setCliWorkingHoursEnd] = useState(selectedClient?.workingHoursEnd || '17:30');
  const [cliBusinessHoursStart, setCliBusinessHoursStart] = useState(selectedClient?.businessHoursStart || '08:30');
  const [cliBusinessHoursEnd, setCliBusinessHoursEnd] = useState(selectedClient?.businessHoursEnd || '18:00');
  const [cliEndOfShiftTime, setCliEndOfShiftTime] = useState(selectedClient?.endOfShiftTime || '17:30');
  const [cliCommsStart, setCliCommsStart] = useState(selectedClient?.preferredCommsStart || '10:00');
  const [cliCommsEnd, setCliCommsEnd] = useState(selectedClient?.preferredCommsEnd || '16:00');
  const [cliMeetingStart, setCliMeetingStart] = useState(selectedClient?.meetingAvailabilityStart || '10:30');
  const [cliMeetingEnd, setCliMeetingEnd] = useState(selectedClient?.meetingAvailabilityEnd || '16:00');

  // Stakeholders State
  const [stakeholderModalClient, setStakeholderModalClient] = useState<string>(clients[0]?.id || '');
  const [newStakeholderName, setNewStakeholderName] = useState('');
  const [newStakeholderRole, setNewStakeholderRole] = useState('');
  const [newStakeholderCountry, setNewStakeholderCountry] = useState('United States');
  const [newStakeholderCity, setNewStakeholderCity] = useState('New York');
  const [newStakeholderTimezone, setNewStakeholderTimezone] = useState('America/New_York');
  const [newStakeholderWorkStart, setNewStakeholderWorkStart] = useState('09:00');
  const [newStakeholderWorkEnd, setNewStakeholderWorkEnd] = useState('17:00');
  const [newStakeholderNotes, setNewStakeholderNotes] = useState('');

  // Holidays state
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState(new Date().toISOString().split('T')[0]);
  const [newHolidayCountry, setNewHolidayCountry] = useState('United States');
  const [newHolidayCountryCode, setNewHolidayCountryCode] = useState('US');
  const [newHolidayImpact, setNewHolidayImpact] = useState<'full_closure' | 'bank_holiday' | 'observance'>('full_closure');
  const [newHolidayIsRecurring, setNewHolidayIsRecurring] = useState(true);
  const [newHolidayIsCustom, setNewHolidayIsCustom] = useState(false);
  const [newHolidayNotes, setNewHolidayNotes] = useState('');
  const [newHolidayAffectedClients, setNewHolidayAffectedClients] = useState<string[]>(clients.map(c => c.id));

  // Sync client when selectedClientId changes
  const handleClientSelectChange = (id: string) => {
    setSelectedClientId(id);
    const target = clients.find(c => c.id === id);
    if (target) {
      setCliCountry(target.country || 'United States');
      setCliCity(target.city || 'New York');
      setCliTimezone(target.timezone || 'America/New_York');
      setCliWorkingHoursStart(target.workingHoursStart || '09:00');
      setCliWorkingHoursEnd(target.workingHoursEnd || '17:30');
      setCliBusinessHoursStart(target.businessHoursStart || '08:30');
      setCliBusinessHoursEnd(target.businessHoursEnd || '18:00');
      setCliEndOfShiftTime(target.endOfShiftTime || '17:30');
      setCliCommsStart(target.preferredCommsStart || '10:00');
      setCliCommsEnd(target.preferredCommsEnd || '16:00');
      setCliMeetingStart(target.meetingAvailabilityStart || '10:30');
      setCliMeetingEnd(target.meetingAvailabilityEnd || '16:00');
    }
  };

  if (!isOpen) return null;

  const handleSaveFreelancerHQ = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      country: userCountry,
      countryCode: userCountryCode,
      flagEmoji: userFlagEmoji,
      city: userCity,
      timezone: userTimezone,
      defaultTimezone: userTimezone,
      workingHoursStart,
      workingHoursEnd,
      businessHoursStart,
      businessHoursEnd,
      endOfShiftTime,
      endOfShiftWindowStart,
      endOfShiftWindowEnd,
      workingDays
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveClientHours = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    const countryObj = findCountryByNameOrCode(cliCountry);
    updateClient(selectedClientId, {
      country: cliCountry,
      countryCode: countryObj?.code || 'US',
      flagEmoji: countryObj?.flag || '🇺🇸',
      city: cliCity,
      timezone: cliTimezone,
      workingHoursStart: cliWorkingHoursStart,
      workingHoursEnd: cliWorkingHoursEnd,
      businessHoursStart: cliBusinessHoursStart,
      businessHoursEnd: cliBusinessHoursEnd,
      endOfShiftTime: cliEndOfShiftTime,
      preferredCommsStart: cliCommsStart,
      preferredCommsEnd: cliCommsEnd,
      meetingAvailabilityStart: cliMeetingStart,
      meetingAvailabilityEnd: cliMeetingEnd
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStakeholderName.trim() || !stakeholderModalClient) return;
    const targetCli = clients.find(c => c.id === stakeholderModalClient);
    if (!targetCli) return;

    const countryObj = findCountryByNameOrCode(newStakeholderCountry);
    const newStakeholder: ClientStakeholder = {
      id: `stk_${Date.now()}`,
      clientId: stakeholderModalClient,
      clientName: targetCli.name,
      name: newStakeholderName.trim(),
      role: newStakeholderRole.trim() || 'Key Executive Stakeholder',
      country: newStakeholderCountry,
      countryCode: countryObj?.code || 'US',
      city: newStakeholderCity,
      flagEmoji: countryObj?.flag || '🇺🇸',
      timezone: newStakeholderTimezone,
      workingHoursStart: newStakeholderWorkStart,
      workingHoursEnd: newStakeholderWorkEnd,
      availabilityNotes: newStakeholderNotes.trim(),
      isActive: true
    };

    const currentStakeholders = targetCli.stakeholders || [];
    updateClient(stakeholderModalClient, {
      stakeholders: [...currentStakeholders, newStakeholder]
    });

    setNewStakeholderName('');
    setNewStakeholderRole('');
    setNewStakeholderNotes('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleDeleteStakeholder = (clientId: string, stakeholderId: string) => {
    const targetCli = clients.find(c => c.id === clientId);
    if (!targetCli || !targetCli.stakeholders) return;
    updateClient(clientId, {
      stakeholders: targetCli.stakeholders.filter(s => s.id !== stakeholderId)
    });
  };

  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName.trim()) return;

    const newHolidayObj: ClientHoliday = {
      id: `hol_${Date.now()}`,
      name: newHolidayName.trim(),
      date: newHolidayDate,
      countryName: newHolidayCountry,
      countryCode: newHolidayCountryCode,
      impact: newHolidayImpact,
      isRecurring: newHolidayIsRecurring,
      isCustom: newHolidayIsCustom,
      category: newHolidayIsCustom ? 'custom_observance' : newHolidayIsRecurring ? 'annual_recurring' : 'national',
      notes: newHolidayNotes.trim(),
      affectedClientIds: newHolidayAffectedClients
    };

    addHoliday(newHolidayObj);
    setNewHolidayName('');
    setNewHolidayNotes('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const allStakeholders: ClientStakeholder[] = clients.flatMap(c => c.stakeholders || []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day: string) => {
    setWorkingDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-[#ECE6DD] max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-[#ECE6DD] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[#18191D]">Timezone & Availability Hub</h2>
                {savedSuccess && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Saved & Cascaded!
                  </span>
                )}
              </div>
              <p className="text-xs text-[#797E8B]">
                Configure Freelancer HQ, client SLAs, stakeholder windows, and recurring annual holidays.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-xl hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-2 bg-[#FAF7F2] border-b border-[#ECE6DD] overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('freelancer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'freelancer'
                ? 'bg-white text-purple-900 shadow-xs border border-purple-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <User className="w-4 h-4 text-purple-600" />
            <span>Freelancer HQ Base</span>
          </button>

          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'clients'
                ? 'bg-white text-blue-900 shadow-xs border border-blue-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Client Timezones & SLAs</span>
          </button>

          <button
            onClick={() => setActiveTab('stakeholders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'stakeholders'
                ? 'bg-white text-emerald-900 shadow-xs border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Stakeholder Overlaps ({allStakeholders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'holidays'
                ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Holidays ({holidays.length})</span>
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 custom-scrollbar">
          
          {/* TAB 1: FREELANCER HQ BASE */}
          {activeTab === 'freelancer' && (
            <form onSubmit={handleSaveFreelancerHQ} className="space-y-6">
              
              {/* Highlight Banner */}
              <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div className="text-xs text-purple-950">
                  <p className="font-bold">Global Freelancer HQ Operating System</p>
                  <p className="mt-0.5 text-purple-800 leading-relaxed">
                    Changes saved here directly update the <strong>Freelancer HQ Base card</strong>, Quick Time Converter, 24h Timeline, Workday Schedules, Deadlines, and Availability scoring across the entire studio.
                  </p>
                </div>
              </div>

              {/* Geographic Location & Timezone */}
              <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191D] flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  Freelancer Location & Timezone
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Full Countries Dropdown */}
                  <div>
                    <CountrySelect
                      label="Country (All 200+ Countries)"
                      value={userCountry}
                      onChange={(info) => {
                        setUserCountry(info.country);
                        setUserCountryCode(info.countryCode);
                        setUserFlagEmoji(info.flagEmoji);
                        setUserTimezone(info.timezone);
                      }}
                      showTimezoneHint
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider mb-1.5">
                      Base City / Headquarters
                    </label>
                    <input
                      type="text"
                      value={userCity}
                      onChange={e => setUserCity(e.target.value)}
                      placeholder="e.g. New York, Manila, London"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-semibold text-[#18191D] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider mb-1.5">
                      IANA Timezone
                    </label>
                    <select
                      value={userTimezone}
                      onChange={e => setUserTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-semibold text-[#18191D] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    >
                      {COMMON_TIMEZONES.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.flag} {tz.city} — {tz.label}
                        </option>
                      ))}
                      {ALL_COUNTRIES.map(c => (
                        <option key={`tz_${c.code}`} value={c.timezone}>
                          {c.flag} {c.name} ({c.timezone})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Operating Schedules & SLA Windows */}
              <div className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#18191D] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Working Hours, Business SLA, & End-of-Shift
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* 1. Working Hours */}
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18191D] flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                        Working Hours
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        Active Focus
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">Core execution and deliverable development window.</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Start</label>
                        <input
                          type="time"
                          value={workingHoursStart}
                          onChange={e => setWorkingHoursStart(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">End</label>
                        <input
                          type="time"
                          value={workingHoursEnd}
                          onChange={e => setWorkingHoursEnd(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Business Hours */}
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18191D] flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-600" />
                        Business Hours
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        Client SLA
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">Public operating window for client communications & SLAs.</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Start</label>
                        <input
                          type="time"
                          value={businessHoursStart}
                          onChange={e => setBusinessHoursStart(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">End</label>
                        <input
                          type="time"
                          value={businessHoursEnd}
                          onChange={e => setBusinessHoursEnd(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. End-of-Shift Hours */}
                  <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18191D] flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-emerald-600" />
                        End-of-Shift Window
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        Daily Recaps
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">Trigger EOD executive briefings, time audits & handoffs.</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Start</label>
                        <input
                          type="time"
                          value={endOfShiftWindowStart}
                          onChange={e => setEndOfShiftWindowStart(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Target End</label>
                        <input
                          type="time"
                          value={endOfShiftWindowEnd}
                          onChange={e => {
                            setEndOfShiftWindowEnd(e.target.value);
                            setEndOfShiftTime(e.target.value);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Working Days Selector */}
                <div className="pt-3 border-t border-[#ECE6DD]">
                  <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider mb-2">
                    Active Working Days
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(d => {
                      const isSelected = workingDays.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggleDay(d)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-900'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-stone-500 font-medium">
                  {userFlagEmoji} Operating from {userCity}, {userCountry} ({userTimezone})
                </span>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#121316] hover:bg-black text-white text-xs font-bold rounded-full flex items-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Freelancer HQ Hours</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: CLIENT TIMEZONES & SLAS */}
          {activeTab === 'clients' && (
            <div className="space-y-6">
              
              {/* Client Selector Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider">
                  Select Client Account
                </label>
                <div className="flex flex-wrap gap-2">
                  {clients.filter(c => !c.isArchived).map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleClientSelectChange(c.id)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all border ${
                        selectedClientId === c.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-stone-700 border-[#ECE6DD] hover:border-blue-300'
                      }`}
                    >
                      <span>{c.flagEmoji || '🌐'}</span>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Client Form */}
              {selectedClient && (
                <form onSubmit={handleSaveClientHours} className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{selectedClient.flagEmoji || '🌐'}</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#18191D]">{selectedClient.name} Operating Configuration</h4>
                        <p className="text-xs text-stone-500">Timezone, availability, and comms SLA windows</p>
                      </div>
                    </div>
                    {selectedClient.isTravelModeActive && (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1">
                        <Plane className="w-3.5 h-3.5" /> Travel Mode Active ({selectedClient.travelCity})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <CountrySelect
                        label="Client Country (200+ Countries)"
                        value={cliCountry}
                        onChange={(info) => {
                          setCliCountry(info.country);
                          setCliTimezone(info.timezone);
                        }}
                        showTimezoneHint
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider mb-1.5">
                        Client City
                      </label>
                      <input
                        type="text"
                        value={cliCity}
                        onChange={e => setCliCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-semibold text-[#18191D]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#18191D] uppercase tracking-wider mb-1.5">
                        Client Timezone
                      </label>
                      <select
                        value={cliTimezone}
                        onChange={e => setCliTimezone(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#ECE6DD] rounded-2xl text-xs font-semibold text-[#18191D]"
                      >
                        {COMMON_TIMEZONES.map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.flag} {tz.city} ({tz.label})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    {/* Working Hours */}
                    <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2">
                      <span className="text-xs font-bold text-[#18191D] block">Client Working Hours</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block">Start</label>
                          <input
                            type="time"
                            value={cliWorkingHoursStart}
                            onChange={e => setCliWorkingHoursStart(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block">End</label>
                          <input
                            type="time"
                            value={cliWorkingHoursEnd}
                            onChange={e => setCliWorkingHoursEnd(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferred Comms Window */}
                    <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2">
                      <span className="text-xs font-bold text-[#18191D] block">Prime Comms Window</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block">Start</label>
                          <input
                            type="time"
                            value={cliCommsStart}
                            onChange={e => setCliCommsStart(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block">End</label>
                          <input
                            type="time"
                            value={cliCommsEnd}
                            onChange={e => setCliCommsEnd(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Meeting Availability Window */}
                    <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2">
                      <span className="text-xs font-bold text-[#18191D] block">Meeting Availability</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block">Start</label>
                          <input
                            type="time"
                            value={cliMeetingStart}
                            onChange={e => setCliMeetingStart(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-stone-500 uppercase block">End</label>
                          <input
                            type="time"
                            value={cliMeetingEnd}
                            onChange={e => setCliMeetingEnd(e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full flex items-center gap-2 shadow-xs transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update {selectedClient.name} Operating Rules</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}

          {/* TAB 3: STAKEHOLDER TIMEZONES */}
          {activeTab === 'stakeholders' && (
            <div className="space-y-6">
              
              {/* Add Stakeholder Form */}
              <form onSubmit={handleAddStakeholder} className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Executive Stakeholder Timezone
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Client Account</label>
                    <select
                      value={stakeholderModalClient}
                      onChange={e => setStakeholderModalClient(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                    >
                      {clients.filter(c => !c.isArchived).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Stakeholder Name</label>
                    <input
                      type="text"
                      value={newStakeholderName}
                      onChange={e => setNewStakeholderName(e.target.value)}
                      placeholder="e.g. Sarah Lin (CTO)"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Role / Department</label>
                    <input
                      type="text"
                      value={newStakeholderRole}
                      onChange={e => setNewStakeholderRole(e.target.value)}
                      placeholder="e.g. Head of Growth, Lead Counsel"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <CountrySelect
                      label="Country"
                      value={newStakeholderCountry}
                      onChange={(info) => {
                        setNewStakeholderCountry(info.country);
                        setNewStakeholderTimezone(info.timezone);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newStakeholderCity}
                      onChange={e => setNewStakeholderCity(e.target.value)}
                      placeholder="e.g. London, Austin"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Working Start</label>
                    <input
                      type="time"
                      value={newStakeholderWorkStart}
                      onChange={e => setNewStakeholderWorkStart(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Working End</label>
                    <input
                      type="time"
                      value={newStakeholderWorkEnd}
                      onChange={e => setNewStakeholderWorkEnd(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <input
                    type="text"
                    value={newStakeholderNotes}
                    onChange={e => setNewStakeholderNotes(e.target.value)}
                    placeholder="Optional availability note (e.g. Prefers Slack async updates before 11 AM)"
                    className="flex-1 mr-3 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Stakeholder
                  </button>
                </div>
              </form>

              {/* Stakeholders List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Tracked Client Stakeholders ({allStakeholders.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allStakeholders.map(stk => (
                    <div key={stk.id} className="p-4 bg-white rounded-2xl border border-[#ECE6DD] flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stk.flagEmoji || '👤'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#18191D]">{stk.name}</span>
                            <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full font-semibold">
                              {stk.clientName}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">{stk.role} • {stk.city || stk.country || 'Global'}</p>
                          <p className="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">
                            ⏰ {stk.workingHoursStart} - {stk.workingHoursEnd} ({stk.timezone?.split('/')[1]?.replace('_', ' ') || stk.timezone})
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteStakeholder(stk.clientId, stk.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                        title="Remove stakeholder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {allStakeholders.length === 0 && (
                    <div className="col-span-2 p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-400 text-xs">
                      No external stakeholders configured yet. Add team members, board chairs, or executive admins above.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: RECURRING & CUSTOM HOLIDAYS */}
          {activeTab === 'holidays' && (
            <div className="space-y-6">
              
              {/* Add Holiday Form */}
              <form onSubmit={handleAddHolidaySubmit} className="bg-white p-5 rounded-2xl border border-[#ECE6DD] space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Recurring Annual or Custom Holiday
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Holiday / Closure Name</label>
                    <input
                      type="text"
                      value={newHolidayName}
                      onChange={e => setNewHolidayName(e.target.value)}
                      placeholder="e.g. Labor Day, Studio Winter Shut-Down"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Observance Date</label>
                    <input
                      type="date"
                      value={newHolidayDate}
                      onChange={e => setNewHolidayDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <CountrySelect
                      label="Country / Jurisdiction"
                      value={newHolidayCountry}
                      onChange={(info) => {
                        setNewHolidayCountry(info.country);
                        setNewHolidayCountryCode(info.countryCode);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Closure Impact</label>
                    <select
                      value={newHolidayImpact}
                      onChange={e => setNewHolidayImpact(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="full_closure">Full Studio & Office Closure</option>
                      <option value="bank_holiday">Bank Holiday (Markets Closed)</option>
                      <option value="observance">Optional Cultural Observance</option>
                    </select>
                  </div>

                  {/* Recurring Toggle */}
                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                      <input
                        type="checkbox"
                        checked={newHolidayIsRecurring}
                        onChange={e => setNewHolidayIsRecurring(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>Recurring Annual Holiday</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                      <input
                        type="checkbox"
                        checked={newHolidayIsCustom}
                        onChange={e => setNewHolidayIsCustom(e.target.checked)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span>Custom Studio Closure</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <input
                    type="text"
                    value={newHolidayNotes}
                    onChange={e => setNewHolidayNotes(e.target.value)}
                    placeholder="Optional notes or client SLA notice requirement..."
                    className="flex-1 mr-3 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Holiday
                  </button>
                </div>
              </form>

              {/* Holidays List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Tracked Holidays & Observances ({holidays.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {holidays.map(h => (
                    <div key={h.id} className="p-4 bg-white rounded-2xl border border-[#ECE6DD] flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#18191D]">{h.name}</span>
                          {h.isRecurring && (
                            <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full font-bold">
                              Annual Recurring
                            </span>
                          )}
                          {h.isCustom && (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">
                              Custom Closure
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          📅 {h.date} • {h.countryName} ({h.countryCode}) • {h.impact.replace('_', ' ')}
                        </p>
                        {h.notes && <p className="text-[10px] text-stone-400 italic mt-0.5">{h.notes}</p>}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteHoliday(h.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                        title="Delete holiday"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
