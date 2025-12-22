import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AdminCustomersListPage } from './pages/AdminCustomersListPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminCustomerCreatePage } from './pages/AdminCustomerCreatePage';
import { AdminCustomerEditPage } from './pages/AdminCustomerEditPage';
import { AdminCustomerViewPage } from './pages/AdminCustomerViewPage';
import { AdminCustomerSettingsPage } from './pages/AdminCustomerSettingsPage';
import AdminSettingsPage from "./pages/AdminSettingsPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import ClientSettingsPage from "./pages/ClientSettingsPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import ClientReportsPage from "./pages/ClientReportsPage";
import { TenantRouter } from "./pages/TenantRouter";
import { useAuthCheck } from './services/useAuth';
import { useTokenRefresh } from './services/useTokenRefresh';

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
      <Route path="/" element={<ProtectedLayout><TenantRouter /></ProtectedLayout>} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedLayout><AdminDashboardPage /></ProtectedLayout>} />
      <Route path="/admin/customer-list" element={<ProtectedLayout><AdminCustomersListPage /></ProtectedLayout>} />
      <Route path="/admin/customer-create" element={<ProtectedLayout><AdminCustomerCreatePage /></ProtectedLayout>} />
      <Route path="/admin/customer-view/:customerId" element={<ProtectedLayout><AdminCustomerViewPage /></ProtectedLayout>} />
      <Route path="/admin/customer-edit/:customerId" element={<ProtectedLayout><AdminCustomerEditPage /></ProtectedLayout>} />
      <Route path="/admin/clients/:customerId/edit" element={<ProtectedLayout><AdminCustomerEditPage /></ProtectedLayout>} />
      <Route path="/admin/users" element={<ProtectedLayout><AdminUsersPage /></ProtectedLayout>} />
      <Route path="/admin/customer-settings" element={<ProtectedLayout><AdminCustomerSettingsPage /></ProtectedLayout>} />
      <Route path="/admin/settings" element={<ProtectedLayout><AdminSettingsPage /></ProtectedLayout>} />

      {/* Client Routes */}
      <Route path="/client/dashboard" element={<ProtectedLayout><ClientDashboardPage /></ProtectedLayout>} />
      <Route path="/client/reports" element={<ProtectedLayout><ClientReportsPage /></ProtectedLayout>} />
      <Route path="/client/settings" element={<ProtectedLayout><ClientSettingsPage /></ProtectedLayout>} />

      {/* User Routes */}
      <Route path="/user/dashboard" element={<ProtectedLayout><UserDashboardPage /></ProtectedLayout>} />
      <Route path="/user/settings" element={<ProtectedLayout><UserSettingsPage /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppContent: React.FC = () => {
  useAuthCheck(); // Check authentication status on app load
  useTokenRefresh(); // Automatically refresh token before it expires
  
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