import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LiveTimerBar } from "@/components/timer/LiveTimerBar";
import { QuickActionModal } from "@/components/modals/QuickActionModal";
import { AppTourModal } from "@/components/modals/AppTourModal";
import { useAuth } from "@/context/AuthContext";
import { getWorkspacesRegistry } from "@/utils/workspaceManager";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function AppLayout() {
  const { inspectedTenantId, setInspectedTenantId, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const workspaces = getWorkspacesRegistry();
  const inspectedWorkspace = inspectedTenantId ? workspaces.find(w => w.id === inspectedTenantId) : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18191D] flex font-sans antialiased selection:bg-[#F6D5EE] relative p-3 sm:p-5 md:p-6 lg:p-7 flex-col">
      
      {/* Super Admin Inspection Mode Alert Banner */}
      {isSuperAdmin && inspectedTenantId && (
        <div className="w-full max-w-[1720px] mx-auto mb-4 bg-amber-500 text-stone-950 font-medium px-5 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg border border-amber-400 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm">Super Admin Inspection Mode:</span>{' '}
              <span className="text-sm">
                Viewing isolated workspace of <strong className="underline">{inspectedWorkspace?.name || inspectedTenantId}</strong> ({inspectedWorkspace?.ownerFullName || 'Tenant'}).
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setInspectedTenantId(null);
              navigate('/platform-admin');
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-stone-950 text-white hover:bg-stone-800 text-xs font-semibold tracking-wide transition-all shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit Inspection & Return to Admin Hub
          </button>
        </div>
      )}

      {/* Outer App Container with Soft Outer Border & Rounded Frame */}
      <div className="w-full max-w-[1720px] mx-auto bg-[#FAF7F2] rounded-[36px] flex relative min-h-[calc(100vh-3rem)]">
        
        {/* Intelly-Style Matte Black Rounded Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-64 lg:ml-68 flex flex-col min-h-screen pl-6 sm:pl-8 pr-2 sm:pr-4 pb-4">
          <Header />
          <main className="flex-1 pt-6 pb-24 overflow-x-hidden">
            <div className="max-w-[1340px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Global Real-Time Floating Session Widget */}
      <LiveTimerBar />

      {/* Global Quick Action Menu */}
      <QuickActionModal />

      {/* Global App Tour & Interactive Feature Guide */}
      <AppTourModal />
    </div>
  );
}
