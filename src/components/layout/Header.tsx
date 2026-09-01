import React, { useState, useRef, useEffect } from "react";
import { 
  Search, 
  Bell, 
  Plus, 
  Calendar, 
  AlertTriangle, 
  ArrowRight, 
  FileCheck, 
  Sparkles, 
  X,
  CheckCircle2,
  Zap,
  ShieldAlert,
  Clock,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { generateActionableNotifications, ActionableNotification } from "@/utils/notificationIntelligence";

export function Header() {
  const { setQuickActionOpen, openTour, tasks, approvals, clients, userProfile } = useApp();
  const { currentUser, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'decision_approval' | 'risk_escalation' | 'deadline_action' | 'blocker_opportunity'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate prioritized actionable notifications
  const allNotifications = generateActionableNotifications(tasks, approvals, clients, userProfile);
  
  const filteredNotifications = activeCategoryFilter === 'all' 
    ? allNotifications 
    : allNotifications.filter(n => n.category === activeCategoryFilter);

  const decisionsCount = allNotifications.filter(n => n.category === 'decision_approval').length;
  const risksCount = allNotifications.filter(n => n.category === 'risk_escalation').length;
  const deadlinesCount = allNotifications.filter(n => n.category === 'deadline_action').length;
  const opportunitiesCount = allNotifications.filter(n => n.category === 'blocker_opportunity').length;
  const criticalCount = allNotifications.filter(n => n.urgency === 'critical').length;

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/operations?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between gap-4 py-2 bg-[#FAF7F2]/95 backdrop-blur-md">
      
      {/* Pill Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center bg-white border border-[#ECE6DD] rounded-full pl-2 pr-4 py-1.5 shadow-xs transition-all focus-within:border-black/30">
          
          {/* Pink Search Icon Pill */}
          <div className="w-8 h-8 rounded-full bg-[#F6D5EE] text-[#18191D] flex items-center justify-center shrink-0 mr-2.5">
            <Search className="w-4 h-4" />
          </div>

          {/* Search Input */}
          <input 
            type="text" 
            value={searchQuery ?? ''}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search tasks, clients, projects, or SOPs..." 
            className="w-full bg-transparent text-xs font-semibold text-[#18191D] placeholder:text-[#8E929E] focus:outline-none"
          />

        </div>
      </div>

      {/* Right Header Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        
        {/* Workspace Isolation Badge */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#ECE6DD] text-xs font-semibold shadow-2xs">
          <div className={`w-2 h-2 rounded-full ${isSuperAdmin ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
          <span className="text-stone-700 max-w-[140px] truncate">
            {isSuperAdmin ? 'Master Platform' : (currentUser?.fullName ? `${currentUser.fullName}'s Workspace` : 'Private Workspace')}
          </span>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
            {currentUser?.subscriptionTier || (isSuperAdmin ? 'Enterprise' : 'Active')}
          </span>
        </div>

        {/* Black Pill "Quick Actions" Button */}
        <button
          onClick={() => setQuickActionOpen(true)}
          className="px-5 py-2.5 bg-[#121316] hover:bg-black text-white rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Actions</span>
        </button>

        {/* Global Tour & Help Guide Trigger */}
        <button
          type="button"
          onClick={() => openTour()}
          className="w-10 h-10 rounded-full bg-white border border-[#ECE6DD] flex items-center justify-center text-[#18191D] hover:bg-[#FAF7F2] transition-colors relative shadow-xs group"
          aria-label="App Tour & Tutorial Guide"
          title="App Tour, Tutorials & Feature Guide"
        >
          <HelpCircle className="w-4 h-4 text-stone-700 group-hover:text-black transition-colors" />
        </button>

        {/* Actionable Notifications Radar Trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-full bg-white border border-[#ECE6DD] flex items-center justify-center text-[#18191D] hover:bg-[#FAF7F2] transition-colors relative shadow-xs"
            aria-label="Actionable Notifications"
            title="Actionable Radar & Notifications"
          >
            <Bell className="w-4 h-4" />
            {allNotifications.length > 0 && (
              <span className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full ${criticalCount > 0 ? 'bg-rose-500 animate-pulse ring-2 ring-white' : 'bg-purple-600 ring-2 ring-white'}`} />
            )}
          </button>

          {/* Notifications Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-[420px] max-w-[92vw] bg-white rounded-[28px] border border-[#ECE6DD] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              
              {/* Header with Title & Summary */}
              <div className="flex items-center justify-between pb-3 border-b border-[#ECE6DD]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#18191D]">Actionable Outcomes Radar</span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold">
                    {allNotifications.length} Action Items
                  </span>
                  {criticalCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                      {criticalCount} Critical
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#8E929E] hover:text-[#18191D] p-1 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categorical Filter Pills */}
              <div className="grid grid-cols-4 gap-1 my-3 p-1 bg-[#FAF7F2] rounded-2xl text-[10px] font-semibold text-center">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`py-1 rounded-xl transition-all ${activeCategoryFilter === 'all' ? 'bg-white text-[#18191D] shadow-xs font-bold' : 'text-[#797E8B] hover:text-[#18191D]'}`}
                >
                  All ({allNotifications.length})
                </button>
                <button
                  onClick={() => setActiveCategoryFilter('risk_escalation')}
                  className={`py-1 rounded-xl transition-all ${activeCategoryFilter === 'risk_escalation' ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200' : 'text-[#797E8B] hover:text-[#18191D]'}`}
                >
                  Risks ({risksCount})
                </button>
                <button
                  onClick={() => setActiveCategoryFilter('decision_approval')}
                  className={`py-1 rounded-xl transition-all ${activeCategoryFilter === 'decision_approval' ? 'bg-purple-50 text-purple-800 font-bold border border-purple-200' : 'text-[#797E8B] hover:text-[#18191D]'}`}
                >
                  Approvals ({decisionsCount})
                </button>
                <button
                  onClick={() => setActiveCategoryFilter('deadline_action')}
                  className={`py-1 rounded-xl transition-all ${activeCategoryFilter === 'deadline_action' ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' : 'text-[#797E8B] hover:text-[#18191D]'}`}
                >
                  Deadlines ({deadlinesCount})
                </button>
              </div>

              {/* Scrollable Notification Items List */}
              <div className="max-h-[380px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                
                {filteredNotifications.map(item => (
                  <div 
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                      item.urgency === 'critical'
                        ? 'bg-rose-50/60 border-rose-200 text-rose-950'
                        : item.category === 'decision_approval'
                        ? 'bg-purple-50/60 border-purple-200 text-purple-950'
                        : item.category === 'blocker_opportunity'
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-yellow-50/60 border-yellow-200 text-yellow-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        {item.category === 'risk_escalation' && <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />}
                        {item.category === 'decision_approval' && <FileCheck className="w-4 h-4 text-purple-600 shrink-0" />}
                        {item.category === 'deadline_action' && <Clock className="w-4 h-4 text-amber-600 shrink-0" />}
                        {item.category === 'blocker_opportunity' && <Zap className="w-4 h-4 text-emerald-600 shrink-0" />}
                        <span>{item.source}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badgeText}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-[#18191D] leading-tight">{item.title}</h4>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">{item.description}</p>
                    </div>

                    {/* Forward-moving Action Button */}
                    <div className="pt-1.5 flex items-center justify-between">
                      {item.timeContext && (
                        <span className="text-[10px] font-mono text-stone-500 font-semibold">{item.timeContext}</span>
                      )}
                      <Link
                        to={item.actionUrl}
                        onClick={() => setNotificationsOpen(false)}
                        className="ml-auto text-[11px] font-bold px-3 py-1 bg-[#18191D] hover:bg-black text-white rounded-full flex items-center gap-1 transition-all shadow-2xs hover:scale-102"
                      >
                        <span>{item.actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="py-8 text-center text-[#8E929E]">
                    <Sparkles className="w-6 h-6 mx-auto text-[#10B981] mb-2" />
                    <p className="font-bold text-[#18191D] text-xs">Radar Clear</p>
                    <p className="text-[11px] text-[#797E8B] mt-0.5">No immediate risks, blockers, or pending decisions.</p>
                  </div>
                )}

              </div>

              {/* Footer Action */}
              <div className="pt-3 border-t border-[#ECE6DD] mt-3 flex items-center justify-between text-xs">
                <Link
                  to="/workday"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#18191D] font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  Open Workday Operating Cadence <ArrowRight className="w-3 h-3" />
                </Link>
                <Link
                  to="/global-operations"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-purple-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  Global Ops Hub <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}
