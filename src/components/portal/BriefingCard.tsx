import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Target, 
  FileText,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { ExecutiveBriefing } from '../../types';

interface BriefingCardProps {
  briefing: ExecutiveBriefing;
  defaultExpanded?: boolean;
}

export const BriefingCard: React.FC<BriefingCardProps> = ({ briefing, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const getTypeBadge = (type: ExecutiveBriefing['type']) => {
    switch (type) {
      case 'weekly_briefing':
        return {
          label: 'Weekly Strategic Briefing',
          bg: 'bg-blue-50/80 border-blue-200/60 text-blue-900',
          icon: <Target className="w-3.5 h-3.5 text-blue-600" />
        };
      case 'quick_checkin':
        return {
          label: 'Async Check-In',
          bg: 'bg-emerald-50/80 border-emerald-200/60 text-emerald-900',
          icon: <Clock className="w-3.5 h-3.5 text-emerald-600" />
        };
      case 'eod_report':
        return {
          label: 'End-of-Day Recap',
          bg: 'bg-indigo-50/80 border-indigo-200/60 text-indigo-900',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
        };
      case 'monthly_review':
        return {
          label: 'Monthly Strategic Review',
          bg: 'bg-purple-50/80 border-purple-200/60 text-purple-900',
          icon: <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
        };
      default:
        return {
          label: 'Executive Summary',
          bg: 'bg-slate-100/80 border-slate-200/60 text-slate-900',
          icon: <Sparkles className="w-3.5 h-3.5 text-slate-700" />
        };
    }
  };

  const badge = getTypeBadge(briefing.type);

  return (
    <div className="group relative rounded-2xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden">
      {/* Top Header Row */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 sm:p-6 cursor-pointer select-none transition-colors hover:bg-slate-50/50"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.bg}`}>
              {badge.icon}
              {badge.label}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {new Date(briefing.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
            <span>{isExpanded ? 'Collapse Brief' : 'Read Executive Brief'}</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-200 transition-colors">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-black transition-colors">
          {briefing.title}
        </h3>
        
        {briefing.headline && (
          <p className="mt-1.5 text-sm font-medium text-slate-700 leading-snug">
            {briefing.headline}
          </p>
        )}

        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 sm:line-clamp-3">
          {briefing.summary}
        </p>

        {/* Quick Metrics Snapshot if present */}
        {briefing.metricsSnapshot && briefing.metricsSnapshot.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-100">
            {briefing.metricsSnapshot.map((metric, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                  {metric.label}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">
                  {metric.value}
                </span>
                {metric.trend && (
                  <span className="text-[10px] font-medium text-emerald-700 block truncate">
                    {metric.trend}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Strategic Deep Dive */}
      {isExpanded && (
        <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100/90 space-y-6 bg-slate-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
          
          {/* Key Accomplishments & Momentum */}
          {briefing.winsAndAccomplishments && briefing.winsAndAccomplishments.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Key Accomplishments & Momentum
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-2 pl-7">
                {briefing.winsAndAccomplishments.map((win, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{win}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Strategic Priorities */}
          {briefing.currentPriorities && briefing.currentPriorities.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Current In-Flight Priorities & Business Impact
                </h4>
              </div>
              <div className="space-y-2 pl-7">
                {briefing.currentPriorities.map((pri) => (
                  <div 
                    key={pri.id} 
                    className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{pri.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          pri.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pri.status === 'awaiting_input'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {pri.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-700">Outcome Impact:</strong> {pri.businessImpact}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                      Lead: {pri.owner === 'assistant' ? 'Chief of Staff / Ops' : 'Executive Lead'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risks & Strategic Mitigation */}
          {briefing.risksAndBlockers && briefing.risksAndBlockers.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Risks & Mitigation Plan
                </h4>
              </div>
              <div className="space-y-2 pl-7">
                {briefing.risksAndBlockers.map((rb, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs">
                    <p className="font-bold text-amber-950">Potential Risk: {rb.risk}</p>
                    <p className="text-amber-900/90 mt-0.5"><strong className="text-amber-950">Impact:</strong> {rb.impact}</p>
                    <p className="text-emerald-900 font-semibold mt-1"><strong className="text-emerald-950">Mitigation:</strong> {rb.mitigationPlan}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Critical Decisions Needed */}
          {briefing.decisionsNeeded && briefing.decisionsNeeded.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                  Decisions Requiring Client Input
                </h4>
              </div>
              <div className="space-y-1.5 pl-7">
                {briefing.decisionsNeeded.map((dec, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-950 font-medium flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600 mt-0.5 shrink-0" />
                    <span>{dec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps Cadence */}
          {briefing.nextSteps && briefing.nextSteps.length > 0 && (
            <div className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Upcoming Milestone Rhythm:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                  {briefing.nextSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
