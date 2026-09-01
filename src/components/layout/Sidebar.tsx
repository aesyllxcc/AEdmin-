import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Globe,
  CalendarDays, 
  Users, 
  Briefcase, 
  Clock, 
  Layers, 
  Wallet, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  BarChart2, 
  Settings, 
  Eye,
  LogOut,
  ChevronRight,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

const generalNavItems = [
  { name: "Command center", path: "/", icon: LayoutDashboard },
  { name: "Global Times", path: "/global-times", icon: Globe },
  { name: "Schedule", path: "/workday", icon: CalendarDays },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Operations", path: "/operations", icon: Briefcase },
  { name: "AESmart Write", path: "/smart-write", icon: Sparkles },
  { name: "Statistics & reports", path: "/reports", icon: BarChart2 },
  { name: "Knowledge Base", path: "/knowledge", icon: BookOpen },
];

const toolsNavItems = [
  { name: "Time tracking", path: "/time", icon: Clock },
  { name: "Billing & Finance", path: "/finance", icon: Wallet },
  { name: "Rates & Services", path: "/services", icon: Layers },
  { name: "Approvals", path: "/approvals", icon: CheckCircle2 },
  { name: "Business Dev", path: "/opportunities", icon: TrendingUp },
  { name: "Client Portal Preview", path: "/portal", icon: Eye },
];

export function Sidebar() {
  const location = useLocation();
  const { userProfile, openTour } = useApp();
  const { currentUser, isSuperAdmin, logout } = useAuth();

  return (
    <aside className="w-64 h-[calc(100vh-3.5rem)] bg-[#121316] text-white flex flex-col rounded-[32px] fixed left-6 top-7 overflow-hidden z-30 shrink-0 shadow-2xl shadow-black/25 border border-white/5">
      
      {/* Brand Header with Intelly-Style Pink Circle Toggle */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-sans">aedmin</span>
        </Link>
        <button 
          aria-label="Toggle Sidebar"
          className="w-6 h-6 rounded-full bg-[#F6D5EE] text-[#121316] flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
        
        {/* General Section */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-[#6D717C] mb-2 tracking-wide">
            General
          </div>
          <nav className="space-y-0.5">
            {generalNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs transition-all duration-150 group relative",
                    isActive 
                      ? "text-white font-bold" 
                      : "text-[#8E929E] hover:text-white hover:bg-white/[0.04] font-medium"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-4 bg-[#F6D5EE] rounded-r-full" />
                  )}
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#F6D5EE]" : "text-[#8E929E] group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tools Section */}
        <div>
          <div className="px-3 text-[11px] font-semibold text-[#6D717C] mb-2 tracking-wide">
            Tools
          </div>
          <nav className="space-y-0.5">
            {toolsNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs transition-all duration-150 group relative",
                    isActive 
                      ? "text-white font-bold" 
                      : "text-[#8E929E] hover:text-white hover:bg-white/[0.04] font-medium"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-4 bg-[#F6D5EE] rounded-r-full" />
                  )}
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#F6D5EE]" : "text-[#8E929E] group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer Section: Settings & Profile */}
      <div className="p-4 pt-2 border-t border-white/[0.06] space-y-1">
        
        {/* Interactive App Tour / Tutorial Help Button */}
        <button
          type="button"
          onClick={() => openTour()}
          className="w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs text-[#F6D5EE] bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-all group font-semibold border border-white/5 shadow-2xs cursor-pointer text-left"
          title="Click to explore features, tutorials, and system workflows"
        >
          <div className="flex items-center gap-3 min-w-0">
            <HelpCircle className="w-4 h-4 text-[#F6D5EE] group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate">Tour & Tutorial</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#F6D5EE]/15 text-[#F6D5EE] font-bold shrink-0">
            Guide
          </span>
        </button>

        {/* Super Admin Sole Owner Platform Control */}
        {isSuperAdmin && (
          <Link
            to="/platform-admin"
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-bold transition-all group border",
              location.pathname === "/platform-admin"
                ? "bg-amber-400/20 text-amber-300 border-amber-400/30"
                : "bg-white/[0.04] text-amber-300/90 hover:bg-white/[0.08] hover:text-amber-200 border-amber-400/20"
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">Platform Admin</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-black tracking-wider uppercase shrink-0">
              Owner
            </span>
          </Link>
        )}

        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-2xl text-xs text-[#8E929E] hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-xs text-[#8E929E] hover:text-rose-400 hover:bg-white/[0.04] transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </button>

        {/* User Mini Profile */}
        <div className="pt-2 flex items-center gap-2.5 px-2">
          {userProfile.avatarUrl ? (
            <img 
              src={userProfile.avatarUrl} 
              alt={currentUser?.fullName || userProfile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-stone-800 border border-white/20 text-white text-xs font-bold flex items-center justify-center">
              {(currentUser?.fullName || userProfile.fullName).charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-bold text-white truncate">{currentUser?.fullName || userProfile.fullName}</p>
              {currentUser?.role && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-stone-800 text-stone-300 uppercase">
                  {currentUser.role}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#8E929E] truncate">{userProfile.title}</p>
          </div>
        </div>
      </div>

    </aside>
  );
}
