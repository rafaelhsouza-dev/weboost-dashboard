import React, { useState, useEffect } from 'react';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useApp } from '../store';
import { runAllMigrations, getSystemStatus } from '../services/customerService';
import { Database, Activity, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { notify } = useApp();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [runningMigrations, setRunningMigrations] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const status = await getSystemStatus();
      setSystemStatus(status);
    } catch (error) {
      console.error('Failed to load system status:', error);
      notify('Falha ao carregar status do sistema', 'error');
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleRunMigrations = async () => {
    if (!window.confirm('Deseja realmente rodar as migrações em todos os tenants? Esta operação pode levar alguns minutos.')) {
      return;
    }

    setRunningMigrations(true);
    try {
      const result = await runAllMigrations();
      notify('Migrações executadas com sucesso!', 'success');
      console.log('Migration results:', result);
      void loadStatus();
    } catch (error) {
      console.error('Migration error:', error);
      const msg = error instanceof Error ? error.message : 'Erro ao executar migrações';
      notify(msg, 'error');
    } finally {
      setRunningMigrations(false);
    }
  };

  return (
    <LayoutPage 
      title="Configurações de Administração" 
      subtitle="Gerencie as operações de infraestrutura e base de dados da plataforma."
      actions={
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadStatus} 
          disabled={loadingStatus}
          className="border-gray-100 dark:border-dark-border"
        >
          <RefreshCw size={16} className={`mr-2 ${loadingStatus ? 'animate-spin' : ''}`} />
          Atualizar Status
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card de Migrações */}
        <Card className="p-6 border-primary/10">
          <div className="flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Database size={20} />
            </div>
            <h2 className="text-lg font-bold">Base de Dados & Migrações</h2>
          </div>
          
          <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-dark-border mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Execute as migrações pendentes em todos os schemas dos clientes cadastrados. Este processo garante que a estrutura da base de dados esteja sincronizada.
            </p>
            <Button 
              onClick={handleRunMigrations} 
              disabled={runningMigrations}
              fullWidth
              className="shadow-lg shadow-primary/10"
            >
              <RefreshCw size={16} className={`mr-2 ${runningMigrations ? 'animate-spin' : ''}`} />
              {runningMigrations ? 'Executando Migrações...' : 'Rodar Migrações (Clientes)'}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 italic">
            <AlertTriangle size={14} className="text-primary" />
            Operação crítica. Recomendado realizar backup antes de prosseguir.
          </div>
        </Card>

        {/* Card de Status do Sistema */}
        <Card className="p-6 border-primary/10">
          <div className="flex items-center gap-3 mb-6 text-gray-900 dark:text-white">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Activity size={20} />
            </div>
            <h2 className="text-lg font-bold">Status dos Tenants</h2>
          </div>

          {loadingStatus && !systemStatus ? (
            <div className="py-12 text-center animate-pulse text-gray-400">
              Carregando informações de status...
            </div>
          ) : systemStatus ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-dark-border">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total de Clientes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{systemStatus.total_tenants || 0}</p>
                </div>
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-dark-border">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Schemas Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white text-primary">{systemStatus.active_schemas || 0}</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-dark-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Integridade do Sistema</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase">
                    <CheckCircle2 size={12} /> Operacional
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full w-[100%]"></div>
                </div>
              </div>

              {/* Se a API retornar detalhes específicos por tenant, poderíamos listar aqui */}
              {systemStatus.details && (
                <div className="mt-4 max-h-[200px] overflow-y-auto space-y-2 pr-2">
                  {Object.entries(systemStatus.details).map(([tenant, status]: [string, any]) => (
                    <div key={tenant} className="flex items-center justify-between text-xs py-2 border-b border-gray-100 dark:border-dark-border last:border-0">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">{tenant}</span>
                      <span className={status === 'ok' ? 'text-primary' : 'text-primary opacity-50'}>{status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 italic border border-dashed border-gray-200 dark:border-dark-border rounded-xl">
              Nenhuma informação de status disponível.
            </div>
          )}
        </Card>

      </div>
    </LayoutPage>
    );
  };
  