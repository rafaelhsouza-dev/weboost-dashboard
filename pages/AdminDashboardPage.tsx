import React from 'react';
import { useApp } from '../store';
import { BarChart2, Users, Activity, DollarSign, Plus } from 'lucide-react';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { currentTenant } = useApp();
  const navigate = useNavigate();

  const stats = [
    { title: 'Clientes Ativos', value: '12', icon: <Users className="h-6 w-6 text-primary" /> },
    { title: 'Usuários Ativos', value: '45', icon: <Activity className="h-6 w-6 text-primary" /> },
    { title: 'Receita Mensal', value: '€ 12.500', icon: <DollarSign className="h-6 w-6 text-primary" /> },
    { title: 'Campanhas Ativas', value: '8', icon: <BarChart2 className="h-6 w-6 text-primary" /> },
  ];

  return (
    <LayoutPage 
      title={`Dashboard Admin: ${currentTenant?.name || 'Sistema'}`}
      subtitle="Visão geral do desempenho e status global da plataforma."
      actions={
        <Button onClick={() => navigate('/admin/customer-create')}>
          <Plus size={16} className="mr-2" /> Novo Cliente
        </Button>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 border-primary/5 hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/5 rounded-xl">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Atividades Recentes</h2>
            <div className="space-y-6">
              {[
                { title: "Novo cliente cadastrado", desc: "Cliente XYZ adicionado", time: "2 horas atrás", icon: <Users size={16} /> },
                { title: "Pagamento recebido", desc: "Fatura #4592 paga", time: "5 horas atrás", icon: <DollarSign size={16} /> },
                { title: "Campanha lançada", desc: "Promoção de Verão ativa", time: "1 dia atrás", icon: <BarChart2 size={16} /> }
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                    {act.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{act.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{act.desc}</p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-semibold">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Ações Rápidas</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate('/admin/customer-create')}>
                <Plus size={16} className="mr-2" /> Adicionar Cliente
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate('/admin/users')}>
                <Users size={16} className="mr-2" /> Gerir Utilizadores
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => navigate('/admin/customer-settings')}>
                <Activity size={16} className="mr-2" /> Status do Sistema
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </LayoutPage>
  );
};

export default AdminDashboardPage;