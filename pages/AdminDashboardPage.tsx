import React from 'react';
import { useApp } from '../store';
import { BarChart2, Users, Activity, DollarSign, FileText, Plus } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { currentTenant } = useApp();

  // Mock data - with real API data when available
  const stats = [
    { title: 'Clientes Ativos', value: '12', icon: <Users className="h-6 w-6 text-primary" /> },
    { title: 'Usuários Ativos', value: '45', icon: <Activity className="h-6 w-6 text-green-500" /> },
    { title: 'Receita Mensal', value: 'R$ 12.500', icon: <DollarSign className="h-6 w-6 text-green-600" /> },
    { title: 'Campanhas Ativas', value: '8', icon: <BarChart2 className="h-6 w-6 text-blue-500" /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard Admin: {currentTenant?.name || 'Carregando...'}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-4">
              {stat.icon}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Atividades Recentes</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Novo cliente cadastrado</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente XYZ foi adicionado ao sistema</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">2 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-300">
                <DollarSign className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Pagamento recebido</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cliente ABC realizou pagamento de R$ 1.200</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">5 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300">
                <BarChart2 className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Campanha lançada</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nova campanha de marketing iniciada</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 dia atrás</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ações Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span>Adicionar Cliente</span>
              <Plus className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span>Gerar Relatório</span>
              <BarChart2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <span>Configurações</span>
              <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
