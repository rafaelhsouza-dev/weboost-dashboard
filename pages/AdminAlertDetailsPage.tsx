import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { listAlerts, getAlertUsersStatus } from '../services/intranetService';
import { Alert, AlertUserStatus } from '../types';
import { CheckCircle, XCircle, Search, ArrowLeft, Clock, Calendar, Bell } from 'lucide-react';
import { useApp } from '../store';

export const AdminAlertDetailsPage: React.FC = () => {
  const { alertId } = useParams<{ alertId: string }>();
  const navigate = useNavigate();
  const { notify } = useApp();
  
  const [alert, setAlert] = useState<Alert | null>(null);
  const [userStatuses, setUserStatuses] = useState<AlertUserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!alertId) return;
      try {
        setLoading(true);
        // Fetch specific alert details
        const alertsList = await listAlerts();
        const foundAlert = alertsList.find(a => a.id === parseInt(alertId));
        if (foundAlert) setAlert(foundAlert);

        // Fetch read statuses
        const statuses = await getAlertUsersStatus(parseInt(alertId));
        setUserStatuses(statuses);
      } catch (error) {
        notify('Erro ao carregar detalhes do alerta.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [alertId]);

  const filteredUsers = userStatuses.filter(u => 
    u.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: userStatuses.length,
    read: userStatuses.filter(u => u.has_read).length,
    unread: userStatuses.filter(u => !u.has_read).length
  };

  return (
    <LayoutPage 
      title="Status de Confirmação" 
      subtitle="Veja quem já visualizou e confirmou o alerta."
      actions={
        <Button variant="outline" onClick={() => navigate('/admin/alerts')}>
          <ArrowLeft size={16} className="mr-2" /> Voltar
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Summary Card */}
        {alert && (
          <Card className="p-6 border-primary/10 bg-primary/[0.02]">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-primary">
                  <Bell size={20} />
                  <h2 className="text-xl font-bold">{alert.title}</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl">{alert.message}</p>
                <div className="flex flex-wrap gap-4 pt-2">
                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
                     <Calendar size={14} />
                     <span>Início: {new Date(alert.date_enable).toLocaleString()}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-xs text-gray-500">
                     <Clock size={14} />
                     <span>Expira: {new Date(alert.date_disable).toLocaleString()}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Lidos</p>
                  <p className="text-2xl font-bold text-green-500">{stats.read}</p>
                </div>
                <div className="bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-100 dark:border-dark-border text-center min-w-[100px]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Pendente</p>
                  <p className="text-2xl font-bold text-red-500">{stats.unread}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Users Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-dark-border bg-gray-50/50 dark:bg-dark-surface/50 flex flex-col md:flex-row justify-between gap-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Utilizadores e Status
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar utilizador..."
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface text-sm focus:ring-2 focus:ring-primary/20 outline-none w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-black/20 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Utilizador</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data de Confirmação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 animate-pulse">Carregando dados...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">Nenhum utilizador encontrado.</td></tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.user_id} className="hover:bg-gray-50/50 dark:hover:bg-dark-border/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{u.user_name}</p>
                        <p className="text-xs text-gray-500">{u.user_email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {u.has_read ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle size={12} /> Confirmado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                            <XCircle size={12} /> Não Lido
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {u.read_at ? new Date(u.read_at).toLocaleString() : '---'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </LayoutPage>
  );
};
