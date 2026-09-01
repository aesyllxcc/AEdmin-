import React, { useState } from 'react';
import { 
  Calendar, 
  Plane, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Client, ClientHoliday } from '@/types';
import { getClientEffectiveLocation } from '@/utils/timezoneUtils';

interface GlobalHolidaysTravelHubProps {
  clients: Client[];
  holidays: ClientHoliday[];
  onAddHoliday: (holiday: Omit<ClientHoliday, 'id'>) => void;
  onDeleteHoliday: (id: string) => void;
  onToggleTravelMode: (client: Client) => void;
  onOpenClientSettings: (client: Client) => void;
}

export const GlobalHolidaysTravelHub: React.FC<GlobalHolidaysTravelHubProps> = ({
  clients,
  holidays,
  onAddHoliday,
  onDeleteHoliday,
  onToggleTravelMode,
  onOpenClientSettings
}) => {
  const [activeTab, setActiveTab] = useState<'holidays' | 'travel'>('holidays');
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayCountry, setNewHolidayCountry] = useState('US');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayImpact, setNewHolidayImpact] = useState<'full_closure' | 'bank_holiday' | 'observance'>('full_closure');

  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');
  const travelingClients = activeClients.filter(c => c.isTravelModeActive);

  // Group holidays by date
  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayName || !newHolidayDate) return;

    const affected = activeClients
      .filter(c => (c.countryCode || 'US') === newHolidayCountry)
      .map(c => c.id);

    const countryNameMap: Record<string, string> = {
      'US': 'United States',
      'GB': 'United Kingdom',
      'JP': 'Japan',
      'FR': 'France',
      'DE': 'Germany',
      'AU': 'Australia',
      'SG': 'Singapore',
      'PH': 'Philippines'
    };

    onAddHoliday({
      name: newHolidayName,
      date: newHolidayDate,
      countryCode: newHolidayCountry,
      countryName: countryNameMap[newHolidayCountry] || newHolidayCountry,
      impact: newHolidayImpact,
      affectedClientIds: affected
    });

    setNewHolidayName('');
    setNewHolidayDate('');
    setShowAddHolidayModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#ECE6DD] p-5 space-y-5 shadow-xs">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#ECE6DD]">
        <div>
          <h3 className="text-sm font-bold text-[#18191D] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            Global Holidays & Client Travel Schedules
          </h3>
          <p className="text-xs text-[#797E8B]">
            Automated conflict warnings, bank holiday coverage buffers, and temporary timezone overrides
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#FAF8F5] p-1 rounded-xl border border-[#ECE6DD] text-xs font-semibold flex items-center gap-1">
            <button
              onClick={() => setActiveTab('holidays')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'holidays' ? 'bg-white text-[#18191D] shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Public Holidays ({sortedHolidays.length})
            </button>
            <button
              onClick={() => setActiveTab('travel')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'travel' ? 'bg-white text-[#18191D] shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Active Travel ({travelingClients.length})
            </button>
          </div>

          {activeTab === 'holidays' && (
            <button
              onClick={() => setShowAddHolidayModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Holiday</span>
            </button>
          )}
        </div>
      </div>

      {/* Holidays Tab Content */}
      {activeTab === 'holidays' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {sortedHolidays.map(hol => {
              const affectedClients = activeClients.filter(c => hol.affectedClientIds?.includes(c.id) || (c.countryCode || 'US') === hol.countryCode);
              const flagEmoji = hol.countryCode === 'US' ? '🇺🇸' : hol.countryCode === 'GB' ? '🇬🇧' : hol.countryCode === 'JP' ? '🇯🇵' : hol.countryCode === 'FR' ? '🇫🇷' : hol.countryCode === 'DE' ? '🇩🇪' : '🌍';

              return (
                <div key={hol.id} className="bg-[#FAF8F5] p-3.5 rounded-xl border border-[#ECE6DD] space-y-2 relative group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flagEmoji}</span>
                      <div>
                        <h4 className="text-xs font-bold text-[#18191D]">{hol.name}</h4>
                        <p className="text-[11px] text-stone-500">{hol.countryName} • <strong className="font-mono text-stone-700">{hol.date}</strong></p>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteHoliday(hol.id)}
                      className="text-stone-300 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Holiday"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#ECE6DD]">
                    <span className={`px-1.5 py-0.5 rounded font-semibold ${
                      hol.impact === 'full_closure' ? 'bg-red-100 text-red-800' :
                      hol.impact === 'bank_holiday' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {hol.impact === 'full_closure' ? 'Full Closure' : hol.impact === 'bank_holiday' ? 'Bank Holiday' : 'Observance'}
                    </span>

                    <span className="text-stone-500 font-medium">
                      Affects: {affectedClients.map(c => c.name).join(', ') || 'Regional'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Travel Tab Content */}
      {activeTab === 'travel' && (
        <div className="space-y-4">
          {travelingClients.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] space-y-2">
              <Plane className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-stone-700">No Clients Currently in Travel Mode</p>
              <p className="text-[11px] text-stone-500 max-w-md mx-auto">
                When an executive travels internationally, activate Travel Mode to automatically shift their operating timezone and apply buffer alerts.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {travelingClients.map(client => {
                const loc = getClientEffectiveLocation(client);
                return (
                  <div key={client.id} className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{loc.flagEmoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-amber-950">{client.name}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                              ✈️ Travel Active
                            </span>
                          </div>
                          <p className="text-xs text-amber-800 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Temporary Hub: <strong>{loc.city}, {loc.country}</strong> ({loc.timezone})
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleTravelMode(client)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
                      >
                        End Travel Mode
                      </button>
                    </div>

                    <div className="bg-white/80 p-3 rounded-lg border border-amber-200/80 text-xs space-y-1 text-amber-900">
                      <div className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Travel Mission: {client.travelReason || 'International Client Business Trip'}
                      </div>
                      {client.travelEndDate && (
                        <p className="text-[11px] text-amber-700">
                          Scheduled return date: <strong>{client.travelEndDate}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick Activate Travel for Other Clients */}
          <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#ECE6DD] space-y-2">
            <h4 className="text-xs font-bold text-[#18191D]">Activate Travel Mode for Any Client</h4>
            <div className="flex flex-wrap gap-2">
              {activeClients.filter(c => !c.isTravelModeActive).map(client => (
                <button
                  key={client.id}
                  onClick={() => onOpenClientSettings(client)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#ECE6DD] hover:border-amber-400 text-xs font-medium text-stone-700 flex items-center gap-1.5 transition-colors"
                >
                  <Plane className="w-3.5 h-3.5 text-stone-400" />
                  <span>Configure {client.name} Travel</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Holiday Modal */}
      {showAddHolidayModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#ECE6DD] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECE6DD]">
              <h3 className="text-sm font-bold text-[#18191D] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-600" />
                Add Public Holiday
              </h3>
              <button onClick={() => setShowAddHolidayModal(false)} className="text-stone-400 hover:text-stone-800 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHoliday} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Holiday Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Labor Day, Summer Bank Holiday"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Country</label>
                  <select
                    value={newHolidayCountry}
                    onChange={(e) => setNewHolidayCountry(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="US">🇺🇸 United States</option>
                    <option value="GB">🇬🇧 United Kingdom</option>
                    <option value="JP">🇯🇵 Japan</option>
                    <option value="FR">🇫🇷 France</option>
                    <option value="DE">🇩🇪 Germany</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="SG">🇸🇬 Singapore</option>
                    <option value="PH">🇵🇭 Philippines</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Impact Level</label>
                <select
                  value={newHolidayImpact}
                  onChange={(e) => setNewHolidayImpact(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#ECE6DD] focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="full_closure">Full Business Closure</option>
                  <option value="bank_holiday">Bank Holiday / Limited Hours</option>
                  <option value="observance">Observance / Normal Working</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddHolidayModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
