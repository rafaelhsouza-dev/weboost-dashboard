import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { LayoutPage } from '../components/LayoutPage';
import { useApp } from '../store';
import { Bell, Plus, Trash2, Edit2, X, Check, Calendar, Users } from 'lucide-react';
import { listAlerts, createAlert, updateAlert, deleteAlert } from '../services/intranetService';
import { Alert } from '../types';
import { useNavigate } from 'react-router-dom';

export const AdminAlertsPage: React.FC = () => {
  const { notify } = useApp();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Create state
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    date_enable: new Date().toISOString().slice(0, 16),
    date_disable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  });

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    message: '',
    date_enable: '',
    date_disable: ''
  });

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await listAlerts();
      setAlerts(data);
    } catch (error) {
      notify('Falha ao carregar alertas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure ISO format with Z
      const payload = {
        ...newAlert,
        date_enable: new Date(newAlert.date_enable).toISOString(),
        date_disable: new Date(newAlert.date_disable).toISOString()
      };
      await createAlert(payload);
      setNewAlert({
        title: '',
        message: '',
        date_enable: new Date().toISOString().slice(0, 16),
        date_disable: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
      });
      notify('Alerta criado com sucesso!', 'success');
      loadAlerts();
    } catch (error) {
      notify('Erro ao criar alerta', 'error');
    }
  };

  const startEdit = (alert: Alert) => {
    setEditingId(alert.id);
    setEditForm({
      title: alert.title,
      message: alert.message,
      date_enable: new Date(alert.date_enable).toISOString().slice(0, 16),
      date_disable: new Date(alert.date_disable).toISOString().slice(0, 16)
    });
  };

  const handleUpdate = async (id: number) => {
    try {
      const payload = {
        ...editForm,
        date_enable: new Date(editForm.date_enable).toISOString(),
        date_disable: new Date(editForm.date_disable).toISOString()
      };
      await updateAlert(id, payload);
      setEditingId(null);
      notify('Alerta atualizado!', 'success');
      loadAlerts();
    } catch (error) {
      notify('Erro ao atualizar alerta', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja eliminar este alerta?')) {
      try {
        await deleteAlert(id);
        notify('Alerta eliminado!', 'success');
        loadAlerts();
      } catch (error) {
        notify('Erro ao eliminar alerta', 'error');
      }
    }
  };

  return (
    <LayoutPage 
      title="Gestão de Alertas" 
      subtitle="Crie e gerencie avisos globais para todos os utilizadores."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border-primary/10">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primary" />
              Novo Alerta
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input 
                label="Título" 
                value={newAlert.title}
                onChange={e => setNewAlert({...newAlert, title: e.target.value})}
                required
              />
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Mensagem</label>
                <textarea 
                  className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px]"
                  value={newAlert.message}
                  onChange={e => setNewAlert({...newAlert, message: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <Input 
                  label="Ativar em" 
                  type="datetime-local" 
                  value={newAlert.date_enable}
                  onChange={e => setNewAlert({...newAlert, date_enable: e.target.value})}
                  required
                />
                <Input 
                  label="Desativar em" 
                  type="datetime-local" 
                  value={newAlert.date_disable}
                  onChange={e => setNewAlert({...newAlert, date_disable: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Alerta
              </Button>
            </form>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
            <Bell size={20} className="text-primary" />
            Alertas Atuais
          </h2>
          
          {loading && <div className="text-center py-12 text-gray-400">Carregando alertas...</div>}
          
          {!loading && alerts.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-dark-surface rounded-xl border border-dashed border-gray-200 dark:border-dark-border text-gray-400">
              Nenhum alerta encontrado.
            </div>
          )}

          {alerts.map(alert => (
            <Card key={alert.id} className={`p-6 transition-all ${editingId === alert.id ? 'ring-2 ring-primary/50' : ''}`}>
              {editingId === alert.id ? (
                <div className="space-y-4">
                   <Input 
                    label="Título" 
                    value={editForm.title}
                    onChange={e => setEditForm({...editForm, title: e.target.value})}
                  />
                  <textarea 
                    className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[80px]"
                    value={editForm.message}
                    onChange={e => setEditForm({...editForm, message: e.target.value})}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input 
                      label="Início" 
                      type="datetime-local" 
                      value={editForm.date_enable}
                      onChange={e => setEditForm({...editForm, date_enable: e.target.value})}
                    />
                    <Input 
                      label="Fim" 
                      type="datetime-local" 
                      value={editForm.date_disable}
                      onChange={e => setEditForm({...editForm, date_disable: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>
                      <X size={14} className="mr-1" /> Cancelar
                    </Button>
                    <Button size="sm" onClick={() => handleUpdate(alert.id)}>
                      <Check size={14} className="mr-1" /> Salvar Alterações
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">{alert.title}</h3>
                      {new Date(alert.date_disable) < new Date() ? (
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Expirado</span>
                      ) : new Date(alert.date_enable) > new Date() ? (
                        <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Agendado</span>
                      ) : (
                        <span className="bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Ativo</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{alert.message}</p>
                    <div className="flex flex-wrap gap-4 pt-2">
                       <div className="flex items-center gap-1.5 text-xs text-gray-400">
                         <Calendar size={14} />
                         <span>Início: {new Date(alert.date_enable).toLocaleString()}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-gray-400">
                         <Calendar size={14} />
                         <span>Fim: {new Date(alert.date_disable).toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex md:flex-col justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/alerts/${alert.id}/status`)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      title="Ver quem leu"
                    >
                      <Users size={16} />
                    </button>
                    <button 
                      onClick={() => startEdit(alert)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </LayoutPage>
  );
};
