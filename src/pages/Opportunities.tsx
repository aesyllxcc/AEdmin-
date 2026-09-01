import React, { useState } from "react";
import { 
  TrendingUp, 
  Plus, 
  Search, 
  DollarSign, 
  User, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  X, 
  Trash2, 
  Sparkles,
  Layers,
  ChevronRight,
  Webhook,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Share2,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Play
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Opportunity } from "@/types";

export default function Opportunities() {
  const { opportunities, addOpportunity, updateOpportunity, deleteOpportunity, addClient } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [tallyModalOpen, setTallyModalOpen] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [ingestSuccessMessage, setIngestSuccessMessage] = useState<string | null>(null);

  // New Opportunity Form State
  const [prospectName, setProspectName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [estimatedValue, setEstimatedValue] = useState(4500);
  const [stage, setStage] = useState<Opportunity['stage']>("lead");
  const [type, setType] = useState<Opportunity['type']>("referral");
  const [confidencePercentage, setConfidencePercentage] = useState(50);
  const [serviceInterest, setServiceInterest] = useState("Executive Assistance & Operations");
  const [source, setSource] = useState("Tally.so Inbound Form");
  const [notes, setNotes] = useState("");
  const [nextFollowUpDate, setNextFollowUpDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);

  // Tally Simulation / Payload State
  const [rawTallyJson, setRawTallyJson] = useState("");

  const stages: { id: Opportunity['stage']; label: string; color: string }[] = [
    { id: 'lead', label: 'Lead Identified', color: 'bg-gray-100 text-gray-800' },
    { id: 'discovery', label: 'Discovery Call', color: 'bg-blue-100 text-blue-800' },
    { id: 'proposal', label: 'Proposal Sent', color: 'bg-purple-100 text-purple-800' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-amber-100 text-amber-800' },
    { id: 'won', label: 'Won / Signed', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'lost', label: 'Closed / Lost', color: 'bg-rose-100 text-rose-800' }
  ];

  const totalPipelineValue = opportunities.filter(o => o.stage !== 'lost').reduce((acc, o) => acc + (o.estimatedValue || 0), 0);
  const weightedPipelineValue = opportunities.filter(o => o.stage !== 'lost' && o.stage !== 'won').reduce((acc, o) => acc + ((o.estimatedValue || 0) * ((o.confidencePercentage || 0) / 100)), 0);
  const wonValue = opportunities.filter(o => o.stage === 'won').reduce((acc, o) => acc + (o.estimatedValue || 0), 0);

  const webhookEndpoint = `${window.location.origin}/api/tally-webhook`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectName.trim()) return;

    addOpportunity({
      prospectName,
      company: company || prospectName,
      email,
      type,
      stage,
      estimatedValue: Number(estimatedValue),
      serviceInterest,
      source,
      nextFollowUpDate,
      notes,
      confidencePercentage: Number(confidencePercentage)
    });

    setModalOpen(false);
    setProspectName("");
    setCompany("");
    setEmail("");
    setNotes("");
  };

  // Helper to ingest from Tally simulator
  const handleIngestTallyPreset = (preset: { name: string; company: string; email: string; budget: number; scope: string; notes: string }) => {
    addOpportunity({
      prospectName: preset.name,
      company: preset.company,
      email: preset.email,
      type: 'lead',
      stage: 'lead',
      estimatedValue: preset.budget,
      serviceInterest: preset.scope,
      source: 'Tally.so Form (Inbound)',
      nextFollowUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      notes: preset.notes,
      confidencePercentage: 60
    });

    setIngestSuccessMessage(`Successfully ingested lead for "${preset.name}" from Tally.so into your pipeline!`);
    setTimeout(() => setIngestSuccessMessage(null), 4000);
  };

  const handleParseCustomTallyPayload = () => {
    if (!rawTallyJson.trim()) return;
    try {
      const parsed = JSON.parse(rawTallyJson);
      let name = "Tally Prospect";
      let companyName = "New Venture";
      let emailAddr = "";
      let budgetVal = 4500;
      let service = "Executive Assistance & Operations";
      let messageNotes = "Ingested via custom Tally webhook payload.";

      if (parsed.data && Array.isArray(parsed.data.fields)) {
        for (const f of parsed.data.fields) {
          const label = (f.label || '').toLowerCase();
          const val = f.value;
          if (label.includes('name')) name = String(val);
          else if (label.includes('company') || label.includes('organization')) companyName = String(val);
          else if (label.includes('email')) emailAddr = String(val);
          else if (label.includes('budget') || label.includes('fee')) budgetVal = Number(val) || 4500;
          else if (label.includes('service') || label.includes('help')) service = String(val);
          else if (label.includes('note') || label.includes('message') || label.includes('detail')) messageNotes = String(val);
        }
      } else {
        name = parsed.name || parsed.prospectName || name;
        companyName = parsed.company || companyName;
        emailAddr = parsed.email || emailAddr;
        budgetVal = Number(parsed.budget || parsed.estimatedValue) || budgetVal;
        service = parsed.service || parsed.serviceInterest || service;
        messageNotes = parsed.notes || parsed.message || messageNotes;
      }

      addOpportunity({
        prospectName: name,
        company: companyName,
        email: emailAddr,
        type: 'lead',
        stage: 'lead',
        estimatedValue: budgetVal,
        serviceInterest: service,
        source: 'Tally.so Webhook',
        nextFollowUpDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        notes: messageNotes,
        confidencePercentage: 55
      });

      setRawTallyJson("");
      setIngestSuccessMessage(`Successfully parsed & added "${name}" from Tally.so payload!`);
      setTimeout(() => setIngestSuccessMessage(null), 4000);
    } catch (err) {
      alert("Invalid JSON format. Please ensure valid Tally webhook JSON.");
    }
  };

  const handleConvertToClient = (opp: Opportunity) => {
    updateOpportunity(opp.id, { stage: 'won' });
    const code = opp.prospectName.substring(0, 2).toUpperCase() + Math.floor(Math.random() * 89 + 10);
    const token = `${opp.prospectName.toLowerCase().replace(/[^a-z0-9]/g, '')}-vault-${Math.floor(Math.random() * 89999 + 10000)}`;

    addClient({
      name: opp.prospectName,
      company: opp.company,
      code: code,
      email: opp.email || `${opp.prospectName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: "+1 (555) 000-0000",
      primaryContact: opp.prospectName,
      status: 'active',
      contractType: 'retainer',
      monthlyRetainerFee: opp.estimatedValue,
      hourlyRate: 150,
      purchasedHours: Math.max(15, Math.round(opp.estimatedValue / 150)),
      relationshipHealth: 'exceptional',
      onboardingProgress: 0,
      portalToken: token,
      portalCustomNotes: `Welcome ${opp.prospectName}. Your executive deliverables, monthly retainer hours, and active sign-offs are tracked live below.`,
      onboardingPhases: [
        {
          id: 1,
          name: "Phase 1: Welcome & Executive Setup",
          description: "Systems access, 1Password credentials, and async communication norms",
          completed: false,
          items: [
            { id: 'ob-1', title: 'Collect Google Workspace & 1Password access', completed: false },
            { id: 'ob-2', title: 'Schedule kickoff & communications alignment sync', completed: false },
            { id: 'ob-3', title: 'Send unique Public Client Workspace Portal link', completed: false }
          ]
        }
      ],
      avatarColor: 'bg-[#DCFCE7]',
      intelligence: {
        executiveProfile: {
          preferredName: opp.prospectName,
          timezone: 'America/New_York (EST)',
          communicationStyle: 'Direct, async updates via Slack/Email with weekly digest.',
          meetingPreferences: 'Mornings, agenda required in advance.',
          decisionMakingStyle: 'Options-oriented with pros/cons.',
          reportingPreferences: 'Weekly Friday briefing.'
        },
        businessProfile: {
          company: opp.company,
          industry: 'Professional Services / Venture / Tech',
          website: 'https://example.com',
          coreServices: opp.serviceInterest,
          currentGoals: 'Scale executive bandwidth and operational cadence.',
          keyChallenges: 'Calendar fragmentation and deliverable bottlenecks.',
          keyTeamMembers: 'Executive Team',
          primaryVendors: 'Google Workspace, Slack, Notion',
          coreSystems: 'Google Drive, Slack, Notion'
        },
        relationshipProfile: {
          hobbies: 'Fitness, Travel',
          interests: 'Strategy, Tech & AI',
          travelPreferences: 'Aisle seat, boutique hotels',
          favoriteRestaurants: 'Farm-to-table',
          giftIdeas: 'Executive stationary, specialty coffee',
          personalNotes: opp.notes || 'Converted from Business Development pipeline.'
        },
        lifestyleContext: {},
        memoryVault: [
          {
            id: `mv-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            title: 'Client Onboarding from Pipeline',
            content: `Converted from Opportunity Pipeline. Target scope: ${opp.serviceInterest}. Deal value: $${opp.estimatedValue}/mo. Portal Key: ${token}`,
            category: 'context',
            visibility: 'internal_only'
          }
        ]
      }
    });

    setIngestSuccessMessage(`Converted "${opp.prospectName}" to an Active Client Workspace with unique public portal link: /portal/${token}`);
    setTimeout(() => setIngestSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-2 border-b border-[#ECE6DD]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#18191D] text-white">
              Business Development & Pipeline
            </span>
            <span className="text-xs text-[#797E8B] font-medium">
              ${totalPipelineValue.toLocaleString()} Active Pipeline • ${Math.round(weightedPipelineValue).toLocaleString()} Weighted
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#18191D] mt-2">
            Inbound Leads & Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-[#797E8B] mt-1 font-medium">
            Connect your Tally.so intake forms to automatically ingest inbound client leads, track discovery calls, and convert won proposals into client workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTallyModalOpen(true)}
            className="px-4 py-2.5 bg-[#FAF7F2] border border-[#ECE6DD] hover:bg-[#ECE6DD] text-[#18191D] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Webhook className="w-3.5 h-3.5 text-[#5B21B6]" />
            Tally.so Integration
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Opportunity
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {ingestSuccessMessage && (
        <div className="p-4 bg-[#DCFCE7] border border-[#BBF7D0] rounded-2xl text-xs text-[#166534] font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#166534]" />
            <span>{ingestSuccessMessage}</span>
          </div>
          <button onClick={() => setIngestSuccessMessage(null)} className="text-[#166534] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-[#FEF9C3] p-5 rounded-[28px] border border-[#FEF08A] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#854D0E]">Total Pipeline Value</span>
          <div className="text-3xl font-black text-[#18191D] mt-1">${totalPipelineValue.toLocaleString()}</div>
          <p className="text-xs text-[#854D0E] mt-1">{opportunities.length} active opportunities</p>
        </div>

        <div className="bg-[#EDE9FE] p-5 rounded-[28px] border border-[#DDD6FE] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B21B6]">Weighted Forecast</span>
          <div className="text-3xl font-black text-[#18191D] mt-1">${Math.round(weightedPipelineValue).toLocaleString()}</div>
          <p className="text-xs text-[#5B21B6] mt-1">Probability-adjusted revenue</p>
        </div>

        <div className="bg-[#DCFCE7] p-5 rounded-[28px] border border-[#BBF7D0] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#166534]">Closed / Won Deals</span>
          <div className="text-3xl font-black text-[#18191D] mt-1">${wonValue.toLocaleString()}</div>
          <p className="text-xs text-[#166534] mt-1">Converted retainer MRR</p>
        </div>

        <div className="bg-[#E0F2FE] p-5 rounded-[28px] border border-[#BAE6FD] shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0369A1]">Win Rate</span>
          <div className="text-3xl font-black text-[#18191D] mt-1">
            {opportunities.length > 0 ? Math.round((opportunities.filter(o => o.stage === 'won').length / opportunities.length) * 100) : 0}%
          </div>
          <p className="text-xs text-[#0369A1] mt-1">Conversion efficiency</p>
        </div>
      </div>

      {/* Tally.so Quick Banner */}
      <div className="p-5 bg-white rounded-[28px] border border-[#ECE6DD] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center font-bold text-xs shrink-0">
            <Webhook className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#18191D]">Tally.so Lead Intake Integration</h3>
            <p className="text-xs text-[#797E8B]">
              Directly sync your Tally contact / intake forms into this pipeline without manual data entry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyWebhook}
            className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#ECE6DD] text-[#18191D] border border-[#ECE6DD] rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            {copiedWebhook ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedWebhook ? 'Copied Webhook!' : 'Copy Webhook URL'}
          </button>
          <button
            onClick={() => setTallyModalOpen(true)}
            className="px-4 py-2 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Setup Guide & Simulator
          </button>
        </div>
      </div>

      {/* Kanban Board of Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map(st => {
          const stageOpps = opportunities.filter(o => o.stage === st.id);
          const stageTotal = stageOpps.reduce((acc, o) => acc + (o.estimatedValue || 0), 0);

          return (
            <div key={st.id} className="bg-white p-4 rounded-[28px] border border-[#ECE6DD] flex flex-col min-h-[480px] shadow-xs">
              
              <div className="pb-3 border-b border-[#ECE6DD] mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#18191D] truncate">{st.label}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#ECE6DD]">
                    {stageOpps.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-[#797E8B] mt-1 font-bold">
                  ${(stageTotal || 0).toLocaleString()}
                </div>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {stageOpps.map(opp => (
                  <div 
                    key={opp.id} 
                    className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] hover:border-black/30 transition-all space-y-2 group shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18191D] group-hover:text-black transition-colors">
                        {opp.prospectName}
                      </span>
                      <button
                        onClick={() => deleteOpportunity(opp.id)}
                        className="opacity-0 group-hover:opacity-100 text-[#797E8B] hover:text-rose-600 transition-opacity"
                        title="Delete Opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#797E8B] font-medium">{opp.company}</p>

                    {opp.source && (
                      <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#ECE6DD] text-[#5B21B6]">
                        {opp.source}
                      </span>
                    )}

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-mono font-bold text-[#18191D]">${(opp.estimatedValue || 0).toLocaleString()}/mo</span>
                      <span className="text-[10px] font-semibold text-[#797E8B]">{opp.confidencePercentage || 0}% Prob</span>
                    </div>

                    {/* Stage Selector */}
                    <div className="pt-2 border-t border-[#ECE6DD] flex items-center justify-between gap-1">
                      <select
                        value={opp.stage ?? 'lead'}
                        onChange={e => updateOpportunity(opp.id, { stage: e.target.value as Opportunity['stage'] })}
                        className="text-[10px] font-semibold bg-white border border-[#ECE6DD] rounded-xl px-2 py-1 focus:outline-none w-full text-[#18191D]"
                      >
                        {stages.map(s => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>

                    {opp.stage === 'won' && (
                      <button
                        onClick={() => handleConvertToClient(opp)}
                        className="w-full mt-1.5 py-1.5 bg-[#18191D] hover:bg-black text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition-all shadow-2xs"
                      >
                        <Sparkles className="w-3 h-3 text-[#10B981]" /> Create Client Portal
                      </button>
                    )}

                  </div>
                ))}

                {stageOpps.length === 0 && (
                  <div className="py-12 text-center text-[11px] text-[#797E8B] italic">
                    No deals in this stage
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Tally.so Integration & Webhook Setup Modal */}
      {tallyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] border border-[#ECE6DD] shadow-2xl max-w-2xl w-full p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#5B21B6] flex items-center justify-center font-bold">
                  <Webhook className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18191D]">Tally.so Integration & Webhook Center</h3>
                  <p className="text-xs text-[#797E8B]">Automatic inbound client lead ingestion</p>
                </div>
              </div>
              <button onClick={() => setTallyModalOpen(false)} className="p-2 text-[#797E8B] hover:text-[#18191D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Webhook Endpoint */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-2">
              <span className="text-xs font-bold text-[#18191D] block">1. Your Webhook Endpoint URL</span>
              <p className="text-xs text-[#797E8B]">
                In your Tally form settings, go to <strong>Integrations → Webhooks</strong> and paste this exact endpoint:
              </p>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={webhookEndpoint} 
                  className="flex-1 px-3 py-2 bg-white border border-[#ECE6DD] rounded-xl text-xs font-mono text-[#18191D]"
                />
                <button
                  onClick={handleCopyWebhook}
                  className="px-4 py-2 bg-[#18191D] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  {copiedWebhook ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedWebhook ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Step 2: Field Mapping Table */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#18191D] block">2. Recommended Tally Field Labels</span>
              <p className="text-xs text-[#797E8B]">
                AEDMIN's parser automatically detects and matches these form field questions in your Tally form:
              </p>

              <div className="border border-[#ECE6DD] rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#FAF7F2] border-b border-[#ECE6DD] text-[#797E8B] font-bold">
                    <tr>
                      <th className="p-3">Tally Form Question / Label</th>
                      <th className="p-3">Matched Opportunity Field</th>
                      <th className="p-3">Example Input</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#ECE6DD]">
                    <tr>
                      <td className="p-3 font-semibold text-[#18191D]">Full Name / Your Name</td>
                      <td className="p-3 font-mono text-[#5B21B6]">prospectName</td>
                      <td className="p-3 text-[#797E8B]">Elena Rostova</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#18191D]">Company / Organization</td>
                      <td className="p-3 font-mono text-[#5B21B6]">company</td>
                      <td className="p-3 text-[#797E8B]">Rostova Capital</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#18191D]">Work Email</td>
                      <td className="p-3 font-mono text-[#5B21B6]">email</td>
                      <td className="p-3 text-[#797E8B]">elena@rostova.vc</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#18191D]">Monthly Retainer Budget ($)</td>
                      <td className="p-3 font-mono text-[#5B21B6]">estimatedValue</td>
                      <td className="p-3 text-[#797E8B]">5500</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#18191D]">Services Needed / Scope</td>
                      <td className="p-3 font-mono text-[#5B21B6]">serviceInterest</td>
                      <td className="p-3 text-[#797E8B]">Executive Assistance & LP Sync</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step 3: Instant Live Simulator & Presets */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-[#18191D] block">3. Test / Simulate Inbound Tally Submissions</span>
              <p className="text-xs text-[#797E8B]">
                Click any preset below to simulate an incoming lead directly into your pipeline:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleIngestTallyPreset({
                    name: "Julian Sterling",
                    company: "Sterling Ventures Fund II",
                    email: "julian@sterlingvc.com",
                    budget: 6000,
                    scope: "LP Summit Logistics & Executive Operations",
                    notes: "Inbound via Tally Intake Form: Needs fractional executive chief of staff support for 25 portfolio companies."
                  })}
                  className="p-3.5 bg-[#FAF7F2] hover:bg-[#ECE6DD] border border-[#ECE6DD] rounded-2xl text-left transition-all space-y-1 group"
                >
                  <span className="text-xs font-bold text-[#18191D] group-hover:text-black flex items-center justify-between">
                    VC Managing Partner <Play className="w-3 h-3 text-[#5B21B6] fill-current" />
                  </span>
                  <p className="text-[11px] text-[#797E8B]">Julian Sterling • $6,000/mo</p>
                </button>

                <button
                  onClick={() => handleIngestTallyPreset({
                    name: "Seraphina Lin",
                    company: "Hyperion AI Systems",
                    email: "seraphina@hyperionai.io",
                    budget: 5200,
                    scope: "AI Workflow Engineering & Security SOPs",
                    notes: "Inbound via Tally Intake Form: Looking for retainer support for AI workflow implementation and executive scheduling defense."
                  })}
                  className="p-3.5 bg-[#FAF7F2] hover:bg-[#ECE6DD] border border-[#ECE6DD] rounded-2xl text-left transition-all space-y-1 group"
                >
                  <span className="text-xs font-bold text-[#18191D] group-hover:text-black flex items-center justify-between">
                    AI Tech Founder <Play className="w-3 h-3 text-[#5B21B6] fill-current" />
                  </span>
                  <p className="text-[11px] text-[#797E8B]">Seraphina Lin • $5,200/mo</p>
                </button>

                <button
                  onClick={() => handleIngestTallyPreset({
                    name: "Alexander Vance",
                    company: "Aethelgard Holdings",
                    email: "alex@aethelgard.com",
                    budget: 7500,
                    scope: "Full Studio Retainer & Strategic Ops",
                    notes: "Inbound via Tally Intake Form: High-net-worth family office executive operations and governance."
                  })}
                  className="p-3.5 bg-[#FAF7F2] hover:bg-[#ECE6DD] border border-[#ECE6DD] rounded-2xl text-left transition-all space-y-1 group"
                >
                  <span className="text-xs font-bold text-[#18191D] group-hover:text-black flex items-center justify-between">
                    Family Office Director <Play className="w-3 h-3 text-[#5B21B6] fill-current" />
                  </span>
                  <p className="text-[11px] text-[#797E8B]">Alexander Vance • $7,500/mo</p>
                </button>
              </div>
            </div>

            {/* Custom JSON Payload Ingest */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE6DD] space-y-3">
              <span className="text-xs font-bold text-[#18191D] block">4. Or Paste Raw Tally JSON Payload</span>
              <textarea
                rows={3}
                value={rawTallyJson}
                onChange={e => setRawTallyJson(e.target.value)}
                placeholder='Paste raw JSON from Tally Webhook payload tester here...'
                className="w-full p-2.5 bg-white border border-[#ECE6DD] rounded-xl text-xs font-mono text-[#18191D] focus:outline-none"
              />
              <button
                onClick={handleParseCustomTallyPayload}
                disabled={!rawTallyJson.trim()}
                className="px-4 py-2 bg-[#18191D] hover:bg-black disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" /> Parse & Ingest Lead
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setTallyModalOpen(false)}
                className="px-5 py-2.5 bg-[#18191D] hover:bg-black text-white rounded-full text-xs font-bold"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Standard Add Opportunity Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-[32px] border border-[#ECE6DD] shadow-2xl max-w-lg w-full p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
              <h3 className="text-base font-bold text-[#18191D]">Add Pipeline Opportunity</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-[#797E8B] hover:text-[#18191D]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#18191D] mb-1">Prospect Name</label>
                  <input 
                    type="text" 
                    value={prospectName} 
                    onChange={e => setProspectName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl font-medium text-[#18191D]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18191D] mb-1">Company / Entity</label>
                  <input 
                    type="text" 
                    value={company} 
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Rostova Venture Studio"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl font-medium text-[#18191D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#18191D] mb-1">Contact Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    placeholder="elena@rostova.vc"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl font-medium text-[#18191D]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18191D] mb-1">Estimated Value ($/mo)</label>
                  <input 
                    type="number" 
                    value={estimatedValue} 
                    onChange={e => setEstimatedValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl font-mono text-[#18191D]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#18191D] mb-1">Stage</label>
                  <select 
                    value={stage} 
                    onChange={e => setStage(e.target.value as Opportunity['stage'])}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl font-medium text-[#18191D]"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#18191D] mb-1">Confidence ({confidencePercentage}%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="5" 
                    value={confidencePercentage} 
                    onChange={e => setConfidencePercentage(Number(e.target.value))}
                    className="w-full accent-black mt-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#18191D] mb-1">Service Scope & Notes</label>
                <textarea 
                  rows={2} 
                  value={notes} 
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Key deliverables, timeline, and strategic requirements..."
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#ECE6DD] rounded-xl font-medium text-[#18191D]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECE6DD]">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 border border-[#ECE6DD] rounded-full text-[#797E8B] hover:bg-[#FAF7F2] font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#18191D] hover:bg-black text-white font-bold rounded-full shadow-xs">
                  Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
