import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppLayout } from "./components/layout/AppLayout";
import CommandCenter from "./pages/CommandCenter";
import Workday from "./pages/Workday";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Operations from "./pages/Operations";
import GlobalOperations from "./pages/GlobalOperations";
import TimeTracking from "./pages/TimeTracking";
import Services from "./pages/Services";
import Finance from "./pages/Finance";
import Approvals from "./pages/Approvals";
import Knowledge from "./pages/Knowledge";
import AESmartWrite from "./pages/AESmartWrite";
import Reports from "./pages/Reports";
import Opportunities from "./pages/Opportunities";
import ClientPortal from "./pages/ClientPortal";
import PublicClientPortal from "./pages/PublicClientPortal";
import Settings from "./pages/Settings";
import SetupWizard from "./pages/SetupWizard";
import Login from "./pages/Login";
import PlatformAdmin from "./pages/PlatformAdmin";
import { FirstTimePasswordModal } from "./components/modals/FirstTimePasswordModal";

function AuthenticatedAppRoutes() {
  const { isSetupCompleted, currentUser, isLoading, isSuperAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-stone-800 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSetupCompleted) {
    return <SetupWizard />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <>
      {/* Mandatory First-Time Password Verification Modal for provisioned accounts */}
      <FirstTimePasswordModal />

      <Routes>
        {/* Internal Operating System App Routes */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/workday" element={<Workday />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:clientId" element={<ClientDetail />} />
          <Route path="/global-times" element={<GlobalOperations />} />
          <Route path="/global-ops" element={<GlobalOperations />} />
          <Route path="/global-operations" element={<GlobalOperations />} />
          <Route path="/operations" element={<Operations />} />
          <Route path="/smart-write" element={<AESmartWrite />} />
          <Route path="/composer" element={<Navigate to="/smart-write" replace />} />
          <Route path="/templates" element={<Navigate to="/smart-write" replace />} />
          <Route path="/time" element={<TimeTracking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/portal" element={<ClientPortal />} />
          <Route path="/settings" element={<Settings />} />

          {/* Super Admin Sole Owner Platform Control Hub */}
          <Route 
            path="/platform-admin" 
            element={isSuperAdmin ? <PlatformAdmin /> : <Navigate to="/" replace />} 
          />
          <Route 
            path="/saas-admin" 
            element={isSuperAdmin ? <PlatformAdmin /> : <Navigate to="/" replace />} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Standalone Client Portal Routes (No login or operator layout required) */}
            <Route path="/portal/:token" element={<PublicClientPortal />} />
            <Route path="/portal/client/:clientId" element={<PublicClientPortal />} />
            <Route path="/p/:token" element={<PublicClientPortal />} />

            {/* Internal Authenticated Operating System Routes */}
            <Route path="/*" element={<AuthenticatedAppRoutes />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
