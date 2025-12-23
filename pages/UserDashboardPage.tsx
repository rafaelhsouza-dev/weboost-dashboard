import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { listAlerts, confirmAlertRead } from '../services/intranetService';
import { Alert } from '../types';
import { Bell, CheckCircle, Clock, Calendar, MessageSquare, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

export const UserDashboardPage: React.FC = () => {
  const { notify } = useApp();
  const [newAlerts, setNewAlerts] = useState<Alert[]>([]);
  const [confirmedAlerts, setConfirmedAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlertsData = async () => {
    try {
      setLoading(true);
      // Fetch only active alerts
      const data = await listAlerts(true);
      
      // Filter based on read_at status
      const unread = data.filter(a => !a.read_at);
      const read = data.filter(a => !!a.read_at);
      
      setNewAlerts(unread);
      setConfirmedAlerts(read);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlertsData();
  }, []);

  const handleConfirmRead = async (id: number) => {
    try {
      await confirmAlertRead(id);
      notify('Alerta confirmado com sucesso!', 'success');
      loadAlertsData(); // Refresh lists
    } catch (error) {
      notify('Falha ao confirmar leitura.', 'error');
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Minha Intranet
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acompanhe os avisos e comunicados internos da WeBoost.
          </p>
        </div>
      </div>
      
      {loading ? (
         <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Column 1: New Alerts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alertas Novos</h2>
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {newAlerts.length}
              </span>
            </div>

            {newAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-dark-surface/30 rounded-2xl border border-dashed border-gray-200 dark:border-dark-border">
                <CheckCircle className="h-10 w-10 text-green-500/30 mb-2" />
                <p className="text-sm text-gray-400 italic">Tudo em dia! Sem novos alertas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {newAlerts.map(alert => (
                  <Card key={alert.id} className="p-0 overflow-hidden border-primary/20 bg-white dark:bg-dark-surface shadow-lg hover:shadow-xl transition-all border-l-4 border-l-primary">
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
                            {alert.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>Recebido em {new Date(alert.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="p-2 bg-primary/5 rounded-full">
                           <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        {alert.message}
                      </p>

                      <Button 
                        onClick={() => handleConfirmRead(alert.id)}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold"
                        size="sm"
                      >
                        <CheckCircle size={16} />
                        Confirmar Leitura
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Confirmed Alerts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <div className="bg-gray-100 dark:bg-dark-border p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-gray-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Alertas Confirmados</h2>
            </div>

            {confirmedAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 bg-gray-50/30 dark:bg-dark-surface/10 rounded-2xl border border-gray-100 dark:border-dark-border">
                <p className="text-sm text-gray-400 italic">Nenhum histórico disponível.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {confirmedAlerts.map(alert => (
                  <Card key={alert.id} className="p-4 bg-gray-50/50 dark:bg-dark-surface/50 border-gray-100 dark:border-dark-border opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-white">{alert.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{alert.message}</p>
                        <div className="flex items-center gap-3 pt-2">
                           <div className="flex items-center gap-1 text-[10px] text-gray-400">
                             <Calendar className="h-3 w-3" />
                             <span>{new Date(alert.created_at).toLocaleDateString()}</span>
                           </div>
                           <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                             <CheckCircle className="h-3 w-3" />
                             <span>Lido em {new Date(alert.read_at!).toLocaleString()}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="bg-primary/5 dark:bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
             <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Importante</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Todos os alertas são de leitura obrigatória. Ao clicar em "Confirmar Leitura", você declara que está ciente do comunicado emitido pela administração.
            </p>
          </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;