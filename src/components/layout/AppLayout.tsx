import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { LiveTimerBar } from "@/components/timer/LiveTimerBar";
import { QuickActionModal } from "@/components/modals/QuickActionModal";
import { AppTourModal } from "@/components/modals/AppTourModal";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#18191D] flex font-sans antialiased selection:bg-[#F6D5EE] relative p-3 sm:p-5 md:p-6 lg:p-7">
      
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
