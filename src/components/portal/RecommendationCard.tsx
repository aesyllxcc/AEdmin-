import React, { useState } from 'react';
import { 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  Check, 
  Clock, 
  Layers, 
  MessageSquare, 
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { StrategicRecommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: StrategicRecommendation;
  onUpdateStatus: (id: string, status: StrategicRecommendation['status'], feedback?: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onUpdateStatus
}) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState(recommendation.clientFeedback || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const getCategoryMeta = (cat: StrategicRecommendation['category']) => {
    switch (cat) {
      case 'systems_automation':
        return { label: 'Systems & Automation', color: 'bg-cyan-50 text-cyan-900 border-cyan-200/80', icon: <Zap className="w-3.5 h-3.5 text-cyan-600" /> };
      case 'cost_savings':
        return { label: 'Cost Savings & Efficiency', color: 'bg-emerald-50 text-emerald-900 border-emerald-200/80', icon: <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> };
      case 'productivity':
        return { label: 'Executive Leverage', color: 'bg-purple-50 text-purple-900 border-purple-200/80', icon: <Sparkles className="w-3.5 h-3.5 text-purple-600" /> };
      case 'business_growth':
        return { label: 'Business Growth', color: 'bg-blue-50 text-blue-900 border-blue-200/80', icon: <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> };
      default:
        return { label: 'Strategic Operations', color: 'bg-slate-100 text-slate-900 border-slate-200/80', icon: <Lightbulb className="w-3.5 h-3.5 text-slate-700" /> };
    }
  };

  const getEffortBadge = (effort: StrategicRecommendation['implementationEffort']) => {
    switch (effort) {
      case 'low':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/60">Low Effort (~2-4h)</span>;
      case 'medium':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200/60">Medium Effort (1-2w)</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 text-[10px] font-bold border border-purple-200/60">High Strategic Effort</span>;
    }
  };

  const cat = getCategoryMeta(recommendation.category);

  return (
    <div className={`rounded-2xl bg-white/95 backdrop-blur-md border transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] ${
      recommendation.status === 'greenlit'
        ? 'border-emerald-300 ring-1 ring-emerald-200/50'
        : 'border-slate-200/80 hover:border-slate-300'
    }`}>
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cat.color}`}>
              {cat.icon}
              {cat.label}
            </span>
            {getEffortBadge(recommendation.implementationEffort)}
            <span className="text-[11px] font-medium text-slate-500">
              Timeline: {recommendation.recommendedTimeline}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {recommendation.status === 'greenlit' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xs">
                <Check className="w-3.5 h-3.5" />
                Adopted & Greenlit
              </span>
            )}
            {recommendation.status === 'under_review' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                Under Review
              </span>
            )}
            {recommendation.status === 'proposed' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                Proactive Proposal
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {recommendation.title}
        </h4>

        {/* Opportunity Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {recommendation.opportunityDescription}
        </p>

        {/* Expected Impact Callout Box */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-100/90 text-xs sm:text-sm">
          <div className="flex items-start gap-2 text-slate-900">
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <strong className="font-bold text-blue-950">Expected Business Impact: </strong>
              <span className="text-slate-700 font-medium">{recommendation.expectedImpact}</span>
            </div>
          </div>
        </div>

        {/* Action Items List (Collapsible) */}
        {recommendation.actionItems && recommendation.actionItems.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <span>{isExpanded ? 'Hide Implementation Steps' : `View ${recommendation.actionItems.length} Implementation Steps`}</span>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isExpanded && (
              <div className="mt-2.5 pl-3 space-y-1.5 border-l-2 border-slate-200 text-xs text-slate-600 animate-in fade-in duration-150">
                {recommendation.actionItems.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Client Feedback Display if submitted */}
        {recommendation.clientFeedback && !feedbackOpen && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">Your Note to Lead:</span>
            <p className="italic">"{recommendation.clientFeedback}"</p>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {recommendation.status !== 'greenlit' ? (
              <button
                onClick={() => onUpdateStatus(recommendation.id, 'greenlit')}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Greenlight & Adopt Proposal
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Added to active implementation sprint
              </span>
            )}

            {recommendation.status === 'proposed' && (
              <button
                onClick={() => onUpdateStatus(recommendation.id, 'under_review')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Mark Under Review
              </button>
            )}

            <button
              onClick={() => setFeedbackOpen(!feedbackOpen)}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {recommendation.clientFeedback ? 'Update Feedback' : 'Add Strategic Note'}
            </button>
          </div>
        </div>

        {/* Feedback Input Drawer */}
        {feedbackOpen && (
          <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
              Provide Direction / Feedback on this initiative:
            </label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={2}
              placeholder="e.g. Approved with priority. Let's start with the CRM integration first..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setFeedbackOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(recommendation.id, recommendation.status, feedbackText);
                  setFeedbackOpen(false);
                }}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors"
              >
                Save Direction
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
