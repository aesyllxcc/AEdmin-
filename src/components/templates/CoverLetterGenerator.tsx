import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Save, 
  RotateCcw, 
  Send, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  FileCode,
  Building2,
  User,
  Zap,
  Briefcase
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ManagedTemplate } from '@/types';

export function CoverLetterGenerator() {
  const { templates, saveGeneratedDraft, userProfile } = useApp();

  // Cover letter templates
  const coverLetterTemplates = templates.filter(
    t => !t.isArchived && (t.category === 'cover_letter' || t.category === 'proposal' || t.category === 'client_communication')
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    coverLetterTemplates[0]?.id || templates[0]?.id || ''
  );

  // Input modes: paste vs file upload
  const [inputMode, setInputMode] = useState<'paste' | 'upload'>('paste');
  const [jobDescriptionText, setJobDescriptionText] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Extracted or customizable metadata
  const [companyName, setCompanyName] = useState<string>('Acme Ventures');
  const [roleTitle, setRoleTitle] = useState<string>('Fractional Chief of Staff');
  const [hiringManager, setHiringManager] = useState<string>('Hiring Team');
  const [tone, setTone] = useState<'executive' | 'persuasive' | 'conversational' | 'concise'>('executive');
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([
    'Executive Calendar Defense & Inbox Zero Protocols',
    'Cross-functional Strategic Initiative Delivery',
    'Financial Modeling & Board Deck Synthesis'
  ]);

  // Output workspace
  const [generatedOutput, setGeneratedOutput] = useState<string>('');
  const [outreachVariant, setOutreachVariant] = useState<'cover_letter' | 'short_outreach'>('cover_letter');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableStrengths = [
    'Executive Calendar Defense & Inbox Zero Protocols',
    'Cross-functional Strategic Initiative Delivery',
    'Financial Modeling & Board Deck Synthesis',
    'Multi-entity Operating Rhythms & SOP Architecture',
    'High-Stakes Client & Stakeholder Governance',
    'Vendor Negotiations & Operational Cost Optimization',
    'Asynchronous Project Leadership & Notion/Slack Workflows'
  ];

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setJobDescriptionText(text);
        autoParseJobDescription(text);
      }
    };
    reader.readAsText(file);
  };

  // Smart heuristic parser to extract company, role, manager hints
  const autoParseJobDescription = (text: string) => {
    // Look for Role / Title hints
    const roleMatches = text.match(/(?:title|role|position|looking for a|hiring a)\s*[:–-]?\s*([A-Za-z0-9\s]{4,35})/i);
    if (roleMatches && roleMatches[1]) {
      const cleaned = roleMatches[1].trim().split(/[\n,\.]/)[0];
      if (cleaned.length > 3) setRoleTitle(cleaned);
    }

    // Look for Company hints
    const companyMatches = text.match(/(?:at|company|about)\s+([A-Z][A-Za-z0-9\s&]{2,25})/);
    if (companyMatches && companyMatches[1]) {
      const cleaned = companyMatches[1].trim().split(/[\n,\.]/)[0];
      if (cleaned.length > 2) setCompanyName(cleaned);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const chosenTemplate = templates.find(t => t.id === selectedTemplateId);
      const myName = userProfile.fullName || 'Alex Vance';
      const myAgency = userProfile.agencyName || 'AEDMIN Executive Ops';

      // Parse keywords from JD
      const jd = jobDescriptionText.toLowerCase();
      let keyPainPoint = "streamlining cross-functional operations and leadership workload";
      if (jd.includes('scale') || jd.includes('growth')) keyPainPoint = "scaling operational infrastructure through high-velocity growth phases";
      if (jd.includes('asynchronous') || jd.includes('remote')) keyPainPoint = "establishing robust asynchronous communication rhythms and async documentation";
      if (jd.includes('fundraising') || jd.includes('board') || jd.includes('investor')) keyPainPoint = "orchestrating investor data rooms, board deck materials, and executive briefings";

      if (outreachVariant === 'short_outreach') {
        const shortPitch = `Hi ${hiringManager},\n\nI noticed your search for a ${roleTitle} at ${companyName} and wanted to reach out directly.\n\nOver the past 5+ years, I’ve partnered with fast-moving founders and executives to handle ${keyPainPoint}.\n\nHighlights of what I bring to ${companyName}:\n${selectedStrengths.map(s => `• ${s}`).join('\n')}\n\nI’d love to connect for 10 minutes to share how we can hit the ground running with zero onboarding friction.\n\nBest,\n${myName}\n${myAgency}`;
        setGeneratedOutput(shortPitch);
      } else if (chosenTemplate) {
        // Use chosen template with variable substitution
        let result = chosenTemplate.content;
        const replacements: Record<string, string> = {
          hiring_manager: hiringManager,
          company_name: companyName,
          role_title: roleTitle,
          core_pain_point: keyPainPoint,
          strength_1: selectedStrengths[0] || 'Executive calendar defense & workflow triage',
          strength_2: selectedStrengths[1] || 'Cross-functional initiative alignment',
          your_name: myName,
          agency_name: myAgency,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };

        Object.entries(replacements).forEach(([k, v]) => {
          const regex = new RegExp(`\\{\\{${k}\\}\\}`, 'g');
          result = result.replace(regex, v);
        });

        setGeneratedOutput(result);
      } else {
        // Default formal cover letter
        const fullLetter = `${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\n${hiringManager}\n${companyName}\n\nRE: Application for ${roleTitle}\n\nDear ${hiringManager},\n\nI am writing to express my strong interest in the ${roleTitle} position with ${companyName}. Having closely reviewed your requirements, I am confident that my track record in executive operations and strategic project management will deliver immediate leverage to your leadership team.\n\nIn my work with high-growth organizations, I have specialized in ${keyPainPoint}. By implementing rigorous operating rhythms and proactive systems, I ensure executive priorities translate into measurable outcomes with minimal friction.\n\nKey Strategic Capabilities I Bring to ${companyName}:\n${selectedStrengths.map(s => `• ${s}`).join('\n')}\n\nI welcome the opportunity to discuss how my background aligns with ${companyName}'s strategic milestones for this quarter.\n\nSincerely,\n\n${myName}\n${myAgency}`;
        setGeneratedOutput(fullLetter);
      }

      setIsGenerating(false);
    }, 400);
  };

  const toggleStrength = (s: string) => {
    setSelectedStrengths(prev => 
      prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedOutput], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportMd = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedOutput], { type: 'text/markdown;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `cover_letter_${companyName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveDraft = () => {
    const chosenTemplate = templates.find(t => t.id === selectedTemplateId);
    
    saveGeneratedDraft({
      title: `${roleTitle} Cover Letter (${companyName})`,
      templateId: chosenTemplate?.id || 'cover_letter_custom',
      templateTitle: chosenTemplate?.title || 'Cover Letter Generator',
      category: 'cover_letter',
      content: generatedOutput,
      variablesUsed: {
        company_name: companyName,
        role_title: roleTitle,
        hiring_manager: hiringManager,
        tone: tone
      },
      status: 'draft'
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Introduction Banner */}
      <div className="p-5 rounded-[24px] bg-gradient-to-br from-[#18191D] via-[#16171B] to-[#121316] border border-white/10 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Intelligent Cover Letter & Outreach Generator
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Read pasted or uploaded Job Descriptions to synthesize tailored, persuasive pitches based on your templates. 100% editable output.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setJobDescriptionText(`We are looking for a Fractional Chief of Staff / Operations Lead at Stripe to partner with executive leadership on scaling our engineering operations, unblocking cross-functional roadmaps, and running quarterly business reviews. Requirements: 5+ years in high-growth tech operations, calendar defense, and async communication.`);
              setCompanyName('Stripe');
              setRoleTitle('Fractional Chief of Staff');
              setHiringManager('Head of Operations');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-stone-300 transition-colors"
          >
            Load Sample Job Posting
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: JD Input & Configuration (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Job Description Ingestion Card */}
          <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-600" />
                1. Job Description Source
              </span>

              {/* Mode Toggle */}
              <div className="flex items-center bg-[#FDFBF7] p-1 rounded-xl border border-border-subtle text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    inputMode === 'paste' ? 'bg-sidebar-bg text-white shadow-2xs' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                    inputMode === 'upload' ? 'bg-sidebar-bg text-white shadow-2xs' : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  Upload File
                </button>
              </div>
            </div>

            {inputMode === 'paste' ? (
              <div>
                <textarea
                  rows={6}
                  value={jobDescriptionText}
                  onChange={e => {
                    setJobDescriptionText(e.target.value);
                    autoParseJobDescription(e.target.value);
                  }}
                  placeholder="Paste the full job posting, LinkedIn description, or client outreach brief here..."
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans leading-relaxed custom-scrollbar"
                />
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-purple-200 hover:border-purple-400 bg-purple-50/20 p-6 rounded-2xl text-center cursor-pointer transition-colors space-y-2"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept=".txt,.md,.pdf,.docx,.doc" 
                  className="hidden" 
                />
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-text-main">
                  {uploadedFileName ? `Loaded: ${uploadedFileName}` : 'Click or Drag & Drop Job Description'}
                </p>
                <p className="text-[11px] text-text-muted">
                  Supports .TXT, .MD, .DOCX, and job posting exports
                </p>
              </div>
            )}

            {/* Quick detected role & company */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-purple-600" />
                  Target Company
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-text-main font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
                  <Briefcase className="w-3 h-3 text-blue-600" />
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={roleTitle}
                  onChange={e => setRoleTitle(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-text-main font-semibold"
                />
              </div>
            </div>

          </div>

          {/* 2. Template Selection & Match Customization */}
          <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs space-y-4">
            <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-600" />
              2. Template & Pitch Style
            </span>

            {/* Template Selection */}
            <div>
              <label className="block text-[11px] font-semibold text-text-muted mb-1">
                Base Template Structure
              </label>
              <select
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
                className="w-full bg-[#FDFBF7] border border-border-subtle rounded-xl px-3 py-2 text-xs font-semibold text-text-main focus:outline-none"
              >
                {coverLetterTemplates.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Hiring Manager & Format Variant */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-emerald-600" />
                  Recipient / Manager
                </label>
                <input
                  type="text"
                  value={hiringManager}
                  onChange={e => setHiringManager(e.target.value)}
                  placeholder="e.g. Jane Smith"
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs text-text-main"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-muted mb-1">
                  Output Format
                </label>
                <select
                  value={outreachVariant}
                  onChange={e => setOutreachVariant(e.target.value as any)}
                  className="w-full bg-[#FDFBF7] border border-border-subtle rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-main focus:outline-none"
                >
                  <option value="cover_letter">Full Formal Cover Letter</option>
                  <option value="short_outreach">Short Direct Outreach (LinkedIn/Email)</option>
                </select>
              </div>
            </div>

            {/* Highlighted Strengths Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="block text-[11px] font-semibold text-text-muted">
                Key Value Highlights to Feature ({selectedStrengths.length} selected)
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar p-2 bg-[#FDFBF7] rounded-xl border border-border-subtle">
                {availableStrengths.map((strength, idx) => {
                  const isChecked = selectedStrengths.includes(strength);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleStrength(strength)}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        isChecked ? 'bg-purple-50 text-purple-950 font-semibold' : 'text-text-muted hover:bg-white'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{strength}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 rounded-2xl bg-[#121316] hover:bg-[#202227] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#F6D5EE]" />
              {isGenerating ? 'Synthesizing Tailored Pitch...' : 'Generate Personalized Cover Letter'}
            </button>

          </div>

        </div>

        {/* Right Side: Live Output Editor Canvas (Never Locked) (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          
          <div className="p-5 rounded-[24px] bg-white border border-border-subtle shadow-xs flex-1 flex flex-col min-h-[580px]">
            
            {/* Header & Output Toolbars */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-main flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-emerald-600" />
                    Generated Output Canvas
                  </span>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full font-semibold">
                    100% Fully Editable
                  </span>
                </div>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Content is never locked. Refine, add paragraphs, or customize prior to export.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                <button
                  type="button"
                  onClick={handleExportMd}
                  className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-purple-600" /> .MD
                </button>

                <button
                  type="button"
                  onClick={handleExportTxt}
                  className="px-3 py-1.5 rounded-xl bg-[#FDFBF7] hover:bg-gray-100 border border-border-subtle text-text-main text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" /> .TXT
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Draft
                </button>
              </div>
            </div>

            {/* Editable Text Canvas */}
            <div className="flex-1 relative flex flex-col">
              <textarea
                value={generatedOutput}
                onChange={e => setGeneratedOutput(e.target.value)}
                placeholder="Click 'Generate Personalized Cover Letter' on the left, or begin typing your custom pitch directly here..."
                className="w-full flex-1 min-h-[440px] bg-[#FDFBF7] border border-border-subtle rounded-2xl p-5 text-xs text-text-main font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400/50 resize-none custom-scrollbar"
              />
            </div>

            {/* Footer Stats & Notification */}
            <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-3 text-xs text-text-muted">
              <div className="flex items-center gap-3">
                <span>{generatedOutput.split(/\s+/).filter(Boolean).length} Words</span>
                <span>•</span>
                <span>{generatedOutput.length} Characters</span>
                <span>•</span>
                <span>~{Math.max(1, Math.ceil(generatedOutput.split(/\s+/).filter(Boolean).length / 200))} min read</span>
              </div>

              {savedSuccess && (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved to Generated Drafts!
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
