import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  MessageSquare, 
  Check, 
  Copy, 
  AlertCircle, 
  FileText, 
  Calendar, 
  CheckCircle2,
  ChevronRight,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Client } from '@/types';
import { 
  getClientLiveTime, 
  getClientEffectiveLocation, 
  generateSmartCommsRecommendations,
  convertFreelancerToClientTime
} from '@/utils/timezoneUtils';

interface SmartCommsPlannerProps {
  clients: Client[];
  freelancerTimezone: string;
  selectedClientId?: string | null;
  onSelectClient?: (client: Client) => void;
}

export const SmartCommsPlanner: React.FC<SmartCommsPlannerProps> = ({
  clients,
  freelancerTimezone,
  selectedClientId,
  onSelectClient
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'eod' | 'approval' | 'morning' | 'followup'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customDraft, setCustomDraft] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [targetClient, setTargetClient] = useState<Client>(() => {
    if (selectedClientId) {
      const found = clients.find(c => c.id === selectedClientId);
      if (found) return found;
    }
    return clients[0] || {} as Client;
  });

  const activeClients = clients.filter(c => !c.isArchived && c.status !== 'archived');
  const recommendations = generateSmartCommsRecommendations(activeClients, freelancerTimezone);

  const targetLive = getClientLiveTime(targetClient, new Date(), freelancerTimezone);
  const targetLoc = getClientEffectiveLocation(targetClient);

  // Filter recommendations
  const filteredRecs = recommendations.filter(rec => {
    if (activeCategory === 'eod') return rec.actionType === 'send_eod_report';
    if (activeCategory === 'approval') return rec.actionType === 'request_approval';
    if (activeCategory === 'morning') return rec.actionType === 'send_update';
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Predefined smart dynamic templates with dual-timezone headers
  const templates = [
    {
      id: 'tmpl_eod',
      title: 'End of Day (EOD) Async Briefing',
      description: 'Clean recap of completed deliverables, pending signoffs, and tomorrow roadmap',
      content: `Hi ${targetClient.intelligence?.executiveProfile?.preferredName || targetClient.primaryContact || 'there'},\n\nHere is your daily operational summary (${targetLoc.city} local time: ${targetLive.dateStr}):\n\n✅ COMPLETED TODAY:\n• Core deliverables triaged and filed in Google Drive\n• Priority inbox sweep & high-value stakeholder triage\n\n📌 IN FLIGHT FOR TOMORROW:\n• Next milestone sprint kickoff\n• Calendar buffers verified\n\nLet me know if you need any adjustments before your local morning!`
    },
    {
      id: 'tmpl_approval',
      title: 'Urgent Wire / Deliverable Approval Request',
      description: 'Polite, high-clarity sign-off prompt with timezone deadline',
      content: `Hi ${targetClient.intelligence?.executiveProfile?.preferredName || targetClient.primaryContact || 'there'},\n\n[ACTION REQUIRED] Ready for your quick review:\n\n• Item: Final sprint milestone deliverable\n• Link: ${targetClient.googleDriveFolderUrl || 'https://drive.google.com'}\n• Sign-off Deadline: 17:00 ${targetLoc.city} time (${targetLoc.timezone.split('/')[1]?.replace('_', ' ') || 'local'})\n\nOnce approved, I will immediately execute the next phase.`
    },
    {
      id: 'tmpl_sync',
      title: 'Quick 15-Minute Sync Proposal',
      description: 'Proposes meeting options explicitly converted to client’s local timezone',
      content: `Hi ${targetClient.intelligence?.executiveProfile?.preferredName || targetClient.primaryContact || 'there'},\n\nWould you have 15 minutes for a quick alignment sync this week?\n\nHere are 2 optimal slots converted to your local time (${targetLoc.city}):\n• Option A: Tomorrow at 11:00 AM ${targetLoc.city} time\n• Option B: Thursday at 03:30 PM ${targetLoc.city} time\n\nLet me know which works best and I will dispatch the calendar invite!`
    },
    {
      id: 'tmpl_holiday',
      title: 'Holiday Ahead Operational Notice',
      description: 'Advance notification of upcoming regional bank holidays or closures',
      content: `Hi ${targetClient.intelligence?.executiveProfile?.preferredName || targetClient.primaryContact || 'there'},\n\nHeads-up on upcoming operational coverage: taking note of the upcoming holiday in ${targetLoc.country}. Our studio has scheduled all critical deliverables ahead of the closure so your operations remain uninterrupted.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-[#18191D] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Smart Communication Planner
          </h2>
          <p className="text-xs text-[#797E8B]">
            AI-driven dispatch windows, response SLA optimizations, and dual-timezone message generators
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Client Selector */}
          <select
            value={targetClient.id}
            onChange={(e) => {
              const cli = activeClients.find(c => c.id === e.target.value);
              if (cli) {
                setTargetClient(cli);
                if (onSelectClient) onSelectClient(cli);
              }
            }}
            className="text-xs font-semibold bg-white border border-[#ECE6DD] rounded-xl px-3 py-2 text-[#18191D] focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {activeClients.map(c => {
              const loc = getClientEffectiveLocation(c);
              return (
                <option key={c.id} value={c.id}>
                  {loc.flagEmoji} {c.name} ({loc.city})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Target Client Status Banner */}
      <div className="bg-white rounded-2xl border border-[#ECE6DD] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{targetLoc.flagEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#18191D]">{targetClient.name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${targetLive.statusColor}`}>
                {targetLive.statusLabel}
              </span>
            </div>
            <p className="text-xs text-[#797E8B] mt-0.5">
              Current local time in {targetLoc.city}: <strong className="text-[#18191D] font-mono">{targetLive.timeStr}</strong> ({targetLive.timeDiffLabel})
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#ECE6DD]">
            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Prime Comms Window</span>
            <span className="font-semibold text-stone-800">{targetLive.preferredCommsLabel}</span>
          </div>
          <div className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#ECE6DD]">
            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Response SLA</span>
            <span className="font-semibold text-stone-800">{targetClient.responseSlaHours || 4} Hours</span>
          </div>
        </div>
      </div>

      {/* Intelligent Dispatch Suggestions Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#797E8B] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            Active Dispatch Recommendations ({filteredRecs.length})
          </h3>
          
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#ECE6DD] text-[11px] font-semibold">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${activeCategory === 'all' ? 'bg-white text-[#18191D] shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('eod')}
              className={`px-2.5 py-1 rounded-lg transition-all ${activeCategory === 'eod' ? 'bg-white text-[#18191D] shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              EOD Recaps
            </button>
            <button
              onClick={() => setActiveCategory('approval')}
              className={`px-2.5 py-1 rounded-lg transition-all ${activeCategory === 'approval' ? 'bg-white text-[#18191D] shadow-xs' : 'text-stone-500 hover:text-stone-900'}`}
            >
              Approvals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredRecs.length === 0 ? (
            <div className="col-span-2 p-6 bg-white rounded-2xl border border-[#ECE6DD] text-center text-xs text-stone-500">
              No urgent dispatch recommendations for this filter. All clients operating within normal cadence.
            </div>
          ) : (
            filteredRecs.map((rec, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[#ECE6DD] p-4 space-y-3 shadow-xs hover:border-purple-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{rec.flagEmoji}</span>
                    <div>
                      <h4 className="text-xs font-bold text-[#18191D]">{rec.clientName}</h4>
                      <p className="text-[11px] text-stone-500">{rec.city} • Suggested: <strong>{rec.suggestedClientTime}</strong></p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    rec.urgency === 'now' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    rec.urgency === 'wait_for_morning' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-blue-100 text-blue-800 border-blue-300'
                  }`}>
                    {rec.urgency === 'now' ? '⚡ Dispatch Now' : '⏳ Queue for Morning'}
                  </span>
                </div>

                <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF8F5] p-2.5 rounded-xl border border-[#ECE6DD]">
                  {rec.reason}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => {
                      setCustomDraft(rec.templateSnippet);
                      setSelectedTemplate(`rec_${idx}`);
                    }}
                    className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1"
                  >
                    Load into Composer <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => handleCopy(rec.templateSnippet, `rec_${idx}`)}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    {copiedId === `rec_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === `rec_${idx}` ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dual Time Message Composer */}
      <div className="bg-white rounded-2xl border border-[#ECE6DD] p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#ECE6DD]">
          <div>
            <h3 className="text-sm font-bold text-[#18191D] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              Smart Dual-Time Message Composer
            </h3>
            <p className="text-xs text-[#797E8B]">
              Compose message tailored to {targetClient.name} with automatically verified local timestamps
            </p>
          </div>

          {/* Quick template buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {templates.map(tmpl => (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(tmpl.id);
                  setCustomDraft(tmpl.content);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedTemplate === tmpl.id 
                    ? 'bg-purple-100 text-purple-900 border-purple-300 font-bold' 
                    : 'bg-[#FAF8F5] text-stone-600 border-[#ECE6DD] hover:bg-stone-100'
                }`}
              >
                {tmpl.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <textarea
            value={customDraft || templates[0].content}
            onChange={(e) => setCustomDraft(e.target.value)}
            rows={7}
            placeholder="Type your message or select a template above..."
            className="w-full text-xs font-mono p-3.5 rounded-xl border border-[#ECE6DD] bg-[#FAF8F5] text-[#18191D] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Timezone validated: {targetLoc.city} ({targetLoc.timezone})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(customDraft || templates[0].content, 'composer_copy')}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedId === 'composer_copy' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'composer_copy' ? 'Copied to Clipboard!' : 'Copy Formatted Draft'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
