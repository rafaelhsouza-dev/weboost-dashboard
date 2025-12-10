import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../store';
import { TenancyType } from '../types';
import { DashboardHome } from './DashboardHome';
import { UserDashboardPage } from './UserDashboardPage';
import { ClientDashboardPage } from './ClientDashboardPage';
import { AdminClientsPage } from './AdminClientsPage';

export const TenantDashboard: React.FC = () => {
  const { currentTenant } = useApp();

  if (!currentTenant) {
    return <div>Carregando...</div>;
  }

  // Redirect to the appropriate dashboard based on tenant type
  switch (currentTenant.type) {
    case TenancyType.INTERNAL:
      // Internal tenant - show user dashboard
      return <UserDashboardPage />;
    
    case TenancyType.ADMIN:
      // Admin tenant - show admin dashboard
      return <AdminClientsPage />;
    
    case TenancyType.CLIENT:
      // Client tenant - show client dashboard
      return <ClientDashboardPage />;
    
    default:
      // Fallback to home dashboard
      return <DashboardHome />;
  }
};