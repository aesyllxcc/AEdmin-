import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  ExternalLink,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Client } from '@/types';

interface NotifyClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  publishedHighlights?: string[];
  pendingApprovalsCount?: number;
  portalUrl: string;
}

export function NotifyClientModal({
  isOpen,
  onClose,
  client,
  publishedHighlights = [],
  pendingApprovalsCount = 0,
  portalUrl
}: NotifyClientModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'slack' | 'email' | 'sms'>('slack');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const firstName = client.primaryContact ? client.primaryContact.split(' ')[0] : client.name;
  const pConfig = client.portalConfig || {};
  const statusHeadline = pConfig.pulseStatusText || 'Q3 Deliverables & Milestones Updated';
  const highlights = (pConfig.keyHighlights && pConfig.keyHighlights.length > 0)
    ? pConfig.keyHighlights
    : (publishedHighlights.length > 0 ? publishedHighlights : [
        'Strategic milestones progressed on schedule',
        pendingApprovalsCount > 0 ? `${pendingApprovalsCount} deliverable ready for your 1-click review` : 'All approvals cleared',
        'Capacity and retainer hours defended for current sprint'
      ]);

  // Slack / Teams format
  const slackText = `*Executive Briefing Update for ${client.company}* ⚡
Hi ${firstName}, your private executive briefing portal has been updated with the latest progress:

• *Status:* ${statusHeadline}
${highlights.map(h => `• ${h}`).join('\n')}
${pendingApprovalsCount > 0 ? `\n*Action Requested:* You have *${pendingApprovalsCount} deliverable sign-off* pending your 1-click review in the portal.` : ''}

👉 *Review in 60 seconds:* ${portalUrl}
_Let me know if you need any adjustments or strategic priority shifts._`;

  // Email format
  const emailSubject = `Executive Briefing Update — ${client.name} (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
  const emailBody = `Hi ${firstName},

I have updated your private Executive Briefing Portal with our latest progress and deliverables for ${client.company}.

Quick 60-Second Snapshot:
• Status: ${statusHeadline}
${highlights.map(h => `• ${h}`).join('\n')}

${pendingApprovalsCount > 0 ? `Action Requested: There is ${pendingApprovalsCount} deliverable pending your review and sign-off.\n\n` : ''}You can review the full summary, approve deliverables in 1 click, or submit new priority requests directly here:
${portalUrl}

Best regards,
Your Executive Lead`;

  // SMS / WhatsApp format
  const smsText = `Hi ${firstName}, your executive briefing for ${client.name} is updated. Review highlights & greenlight deliverables in 60s here: ${portalUrl}`;

  const currentText = selectedFormat === 'slack' ? slackText : selectedFormat === 'email' ? `Subject: ${emailSubject}\n\n${emailBody}` : smsText;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white max-w-2xl w-full rounded-[32px] border border-white/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] p-6 sm:p-8 space-y-6 text-slate-900 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Client Update Ready to Share
                </h2>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Published Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Your portal snapshot has been saved. Copy the executive update below to notify {client.primaryContact}.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={() => setSelectedFormat('slack')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedFormat === 'slack'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            Slack / Teams
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('email')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedFormat === 'email'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            Email Memo
          </button>

          <button
            type="button"
            onClick={() => setSelectedFormat('sms')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedFormat === 'sms'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            SMS / WhatsApp
          </button>
        </div>

        {/* Preview Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Message Content Preview ({selectedFormat.toUpperCase()})</span>
            <span className="text-[11px] text-slate-400">Editable before sending</span>
          </div>

          <div className="relative">
            <textarea
              rows={selectedFormat === 'sms' ? 4 : 9}
              readOnly
              value={currentText}
              className="w-full p-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl font-mono text-xs text-slate-800 focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <a
            href={portalUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 underline underline-offset-2"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            Preview Live Client URL
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Done
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Formatted Update</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
