import React from 'react';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';

const AdminSettingsPage: React.FC = () => {
  return (
    <LayoutPage 
      title="Configurações Gerais" 
      subtitle="Gerencie as definições da plataforma."
    >
      <div className="flex flex-col items-center justify-center h-[60vh] text-center bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border shadow-sm">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-3xl">
          ⚙️
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
          Página em desenvolvimento
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Esta página está em desenvolvimento. Em breve você poderá gerenciar as configurações gerais da plataforma.
        </p>
      </div>
    </LayoutPage>
  );
};

export default AdminSettingsPage;
