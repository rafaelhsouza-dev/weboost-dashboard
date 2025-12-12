import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardHome } from './pages/DashboardHome';
import { CrmPage } from './pages/CrmPage';
import { MarketingPage } from './pages/MarketingPage';
import { ClientListPage } from './pages/ClientListPage';
import { AdminClientsPage } from './pages/AdminClientsPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminServicesPage } from './pages/AdminServicesPage';
import { AdminContractsPage } from './pages/AdminContractsPage';
import { AdminPartnersPage } from './pages/AdminPartnersPage';
import { AdminEventsPage } from './pages/AdminEventsPage';
import { AdminLogsPage } from './pages/AdminLogsPage';
import { AdminReferralsPage } from './pages/AdminReferralsPage';
import { AiScraperPage } from './pages/AiScraperPage';
import { SeoAnalysisPage } from './pages/SeoAnalysisPage';
import AdminSettingsPage from "./pages/AdminSettingsPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import ClientSettingsPage from "./pages/ClientSettingsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import ClientReportsPage from "./pages/ClientReportsPage";
import { TenantDashboard } from "./pages/TenantDashboard";
import UserLogsPage from "./pages/UserLogsPage";
import { useAuthCheck } from './services/useAuth';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, sidebarCollapsed } = useApp();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      <Sidebar />
      <div 
        className={`transition-all duration-300 ease-in-out ml-0 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-72'}`}
      >
        <Header />
        <main className="p-4 md:p-8 block w-full overflow-x-auto">
          <div className="w-full min-w-[300px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[50vh] text-center">
    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-2xl">
      🚧
    </div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
    <p className="text-gray-500 dark:text-gray-400 max-w-md">
      Esta página está em desenvolvimento. Em breve você verá dados reais vindos da API.
    </p>
  </div>
);

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/" element={<ProtectedLayout><TenantDashboard /></ProtectedLayout>} />
      <Route path="/crm" element={<ProtectedLayout><CrmPage /></ProtectedLayout>} />
      <Route path="/marketing" element={<ProtectedLayout><MarketingPage /></ProtectedLayout>} />
      <Route path="/cdp" element={<ProtectedLayout><PlaceholderPage title="CDP - Dados de Cliente" /></ProtectedLayout>} />
      <Route path="/analytics" element={<ProtectedLayout><PlaceholderPage title="Analytics Avançado" /></ProtectedLayout>} />
      <Route path="/scraper" element={<ProtectedLayout><AiScraperPage /></ProtectedLayout>} />
      <Route path="/seo-analysis" element={<ProtectedLayout><SeoAnalysisPage /></ProtectedLayout>} />
      
      {/* Admin Routes */}
      <Route path="/customers" element={<ProtectedLayout><AdminClientsPage /></ProtectedLayout>} />
      <Route path="/customer-list" element={<ProtectedLayout><ClientListPage /></ProtectedLayout>} />
      <Route path="/users" element={<ProtectedLayout><AdminUsersPage /></ProtectedLayout>} />
      <Route path="/services" element={<ProtectedLayout><AdminServicesPage /></ProtectedLayout>} />
      <Route path="/contracts" element={<ProtectedLayout><AdminContractsPage /></ProtectedLayout>} />
      <Route path="/partners" element={<ProtectedLayout><AdminPartnersPage /></ProtectedLayout>} />
      <Route path="/events" element={<ProtectedLayout><AdminEventsPage /></ProtectedLayout>} />
      <Route path="/referrals" element={<ProtectedLayout><AdminReferralsPage /></ProtectedLayout>} />
      <Route path="/admin/logs" element={<ProtectedLayout><AdminLogsPage /></ProtectedLayout>} />
      <Route path="/admin/settings" element={<ProtectedLayout><AdminSettingsPage /></ProtectedLayout>} />

      {/* Client Routes */}
      <Route path="/client/dashboard" element={<ProtectedLayout><ClientDashboardPage /></ProtectedLayout>} />
      <Route path="/campaigns" element={<ProtectedLayout><MarketingPage /></ProtectedLayout>} />
      <Route path="/reports" element={<ProtectedLayout><ClientReportsPage /></ProtectedLayout>} />
      <Route path="/client/settings" element={<ProtectedLayout><ClientSettingsPage /></ProtectedLayout>} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={<ProtectedLayout><UserDashboardPage /></ProtectedLayout>} />
      <Route path="/user/logs" element={<ProtectedLayout><UserLogsPage /></ProtectedLayout>} />
      <Route path="/user/settings" element={<ProtectedLayout><UserSettingsPage /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  useAuthCheck(); // Check authentication status on app load
  
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}