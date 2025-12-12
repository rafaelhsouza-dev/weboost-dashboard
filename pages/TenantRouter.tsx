import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../store';
import { TenancyType } from '../types';
import { UserDashboardPage } from './UserDashboardPage';
import { ClientDashboardPage } from './ClientDashboardPage';
import { AdminDashboardPage } from './AdminDashboardPage';

export const TenantRouter: React.FC = () => {
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
      return <AdminDashboardPage />;
    
    case TenancyType.CLIENT:
      // Client tenant - show client dashboard
      return <ClientDashboardPage />;
    
    default:
      // Fallback to home dashboard
      return <UserDashboardPage />;
  }
};