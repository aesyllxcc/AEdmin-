import React from 'react';
import { X, BookOpen, ExternalLink, Calendar, User, Tag, Copy, Check } from 'lucide-react';
import { ClientKnowledgeDocument } from '../../types';

interface ClientKnowledgeModalProps {
  document: ClientKnowledgeDocument | null;
  onClose: () => void;
}

export const ClientKnowledgeModal: React.FC<ClientKnowledgeModalProps> = ({ document, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!document) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold">
                {document.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Updated {document.lastUpdated}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> {document.author}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {document.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Copy markdown content"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm leading-relaxed">
          {document.summary && (
            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-950 text-xs sm:text-sm font-medium">
              <strong>Executive Summary: </strong>
              {document.summary}
            </div>
          )}

          {document.externalResourceUrl && (
            <a
              href={document.externalResourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-amber-300" />
              Open Primary Cloud Vault / Resource
            </a>
          )}

          <div className="prose prose-slate max-w-none text-xs sm:text-sm whitespace-pre-line font-mono bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70">
            {document.content}
          </div>

          {document.tags && document.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-slate-100">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {document.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-colors"
          >
            Close Reader
          </button>
        </div>

      </div>
    </div>
  );
};
