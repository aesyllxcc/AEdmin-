import React, { useState } from 'react';
import { 
  Check, 
  RotateCcw, 
  HelpCircle, 
  ExternalLink, 
  FileText, 
  Clock, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { ApprovalItem } from '../../types';

interface ApprovalReviewCardProps {
  approval: ApprovalItem;
  onUpdateStatus: (id: string, status: ApprovalItem['status'], comment?: string) => void;
  onAskQuestion: (approvalId: string, author: string, question: string) => void;
  clientName: string;
}

export const ApprovalReviewCard: React.FC<ApprovalReviewCardProps> = ({
  approval,
  onUpdateStatus,
  onAskQuestion,
  clientName
}) => {
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionText, setRevisionText] = useState('');
  const [questionOpen, setQuestionOpen] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const getStatusBadge = (status: ApprovalItem['status']) => {
    switch (status) {
      case 'approved':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"><Check className="w-3.5 h-3.5" /> Approved</span>;
      case 'revision_requested':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold"><RotateCcw className="w-3.5 h-3.5" /> Revision In Progress</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold">Declined</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Decision Required</span>;
    }
  };

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    onAskQuestion(approval.id, clientName, questionText.trim());
    setQuestionText('');
  };

  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionText.trim()) return;
    onUpdateStatus(approval.id, 'revision_requested', revisionText.trim());
    setRevisionOpen(false);
    setRevisionText('');
  };

  return (
    <div className={`rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] ${
      approval.status === 'pending'
        ? 'border-blue-200 ring-1 ring-blue-100'
        : 'border-slate-200/80'
    }`}>
      <div className="p-5 sm:p-6 space-y-4">
        {/* Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(approval.status)}
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
              {approval.type.replace('_', ' ')}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Target Date: {approval.dueDate}
            </span>
          </div>

          {approval.projectName && (
            <span className="text-xs font-semibold text-slate-500">
              Project: {approval.projectName}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-slate-900 leading-snug">
          {approval.title}
        </h4>

        {/* Deliverable Review Link Button */}
        {approval.reviewLink && (
          <div className="flex items-center gap-3">
            <a
              href={approval.reviewLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              Review Deliverable / Source Asset
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        )}

        {/* Strategic Decision Context Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {approval.context && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-1">
                Background & Context
              </span>
              <p className="text-slate-600 leading-relaxed">{approval.context}</p>
            </div>
          )}

          {approval.recommendation && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
              <span className="font-bold text-blue-950 uppercase tracking-wider text-[10px] block mb-1">
                Chief of Staff Recommendation
              </span>
              <p className="text-blue-900 leading-relaxed font-medium">{approval.recommendation}</p>
              {approval.reasoning && (
                <p className="text-slate-600 mt-1.5 text-[11px]">
                  <strong className="text-slate-800">Reasoning:</strong> {approval.reasoning}
                </p>
              )}
            </div>
          )}
        </div>

        {approval.expectedOutcomes && (
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <strong className="font-bold">Target Business Outcome: </strong>
              <span className="text-slate-700">{approval.expectedOutcomes}</span>
            </div>
          </div>
        )}

        {/* Existing Q&A Thread if any */}
        {approval.questionsAsked && approval.questionsAsked.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
              Clarification & Questions Thread ({approval.questionsAsked.length})
            </span>
            <div className="space-y-2">
              {approval.questionsAsked.map(q => (
                <div key={q.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{q.author}</span>
                    <span className="text-slate-400">{q.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{q.text}</p>
                  {q.reply && (
                    <div className="mt-1.5 pl-3 border-l-2 border-blue-400 text-slate-800 bg-blue-50/50 p-2 rounded-r-lg">
                      <span className="font-bold text-blue-950 text-[10px] block">Lead Response:</span>
                      <p>{q.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Submission Input */}
        {questionOpen && (
          <form onSubmit={handleSendQuestion} className="pt-2 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Ask a question about this deliverable:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                placeholder="Type your question or clarification request..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" /> Send
              </button>
            </div>
          </form>
        )}

        {/* Revision Input Box */}
        {revisionOpen && (
          <form onSubmit={handleRequestRevision} className="pt-2 space-y-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase">
              Specify Revisions Needed:
            </label>
            <textarea
              value={revisionText}
              onChange={e => setRevisionText(e.target.value)}
              rows={2}
              placeholder="Detail the specific adjustments, edits, or changes you'd like to see..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRevisionOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Submit Revision Request
              </button>
            </div>
          </form>
        )}

        {/* Action Decision Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {approval.status === 'pending' && (
              <>
                <button
                  onClick={() => onUpdateStatus(approval.id, 'approved', 'Approved in client briefing portal.')}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5" />
                  Approve Deliverable
                </button>
                <button
                  onClick={() => { setRevisionOpen(!revisionOpen); setQuestionOpen(false); }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Request Revision
                </button>
              </>
            )}

            <button
              onClick={() => { setQuestionOpen(!questionOpen); setRevisionOpen(false); }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Ask a Question
            </button>
          </div>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            <span>Decision Log ({approval.decisionHistory?.length || 1})</span>
            {showHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Decision History Audit Trail */}
        {showHistory && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 animate-in fade-in duration-150">
            {approval.decisionHistory?.map((dh, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-50">
                <div>
                  <span className="font-semibold text-slate-800">{dh.author}:</span> {dh.action}
                  {dh.note && <span className="italic text-slate-600 block text-[11px] mt-0.5">"{dh.note}"</span>}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(dh.timestamp).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
