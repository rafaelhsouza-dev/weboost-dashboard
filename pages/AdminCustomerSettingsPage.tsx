import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Plus, Settings, Activity, Edit2, Trash2, X, Check } from 'lucide-react';
import { 
  listCustomerTypes, 
  addCustomerType, 
  updateCustomerType,
  deleteCustomerType,
  listCustomerStatuses, 
  addCustomerStatus,
  updateCustomerStatus,
  deleteCustomerStatus
} from '../services/customerService';
import { CustomerType, CustomerStatus } from '../types';
import { LayoutPage } from '../components/LayoutPage';
import { useApp } from '../store';

export const AdminCustomerSettingsPage: React.FC = () => {
  const { notify } = useApp();
  const [types, setTypes] = useState<CustomerType[]>([]);
  const [statuses, setStatuses] = useState<CustomerStatus[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newType, setNewType] = useState({ name: '', description: '' });
  const [newStatus, setNewStatus] = useState({ name: '', description: '', is_active_status: true });

  // Editing states
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [editTypeForm, setEditTypeForm] = useState({ name: '', description: '' });

  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [editStatusForm, setEditStatusForm] = useState({ name: '', description: '', is_active_status: true });

  const loadData = async () => {
    setLoading(true);
    try {
      const [typesData, statusesData] = await Promise.all([
        listCustomerTypes(),
        listCustomerStatuses()
      ]);
      setTypes(typesData);
      setStatuses(statusesData);
    } catch (error) {
      console.error('Failed to load settings:', error);
      notify('Falha ao carregar configurações', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Type Handlers ---
  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomerType(newType);
      setNewType({ name: '', description: '' });
      notify('Tipo criado com sucesso!', 'success');
      loadData();
    } catch (error) {
      notify('Erro ao adicionar tipo', 'error');
    }
  };

  const startEditingType = (type: CustomerType) => {
    setEditingTypeId(type.id);
    setEditTypeForm({ name: type.name, description: type.description || '' });
  };

  const handleUpdateType = async (id: number) => {
    try {
      await updateCustomerType(id, editTypeForm);
      setEditingTypeId(null);
      notify('Tipo atualizado com sucesso!', 'success');
      loadData();
    } catch (error) {
      notify('Erro ao atualizar tipo', 'error');
    }
  };

  const handleDeleteType = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este tipo?')) {
      try {
        await deleteCustomerType(id);
        notify('Tipo excluído com sucesso!', 'success');
        loadData();
      } catch (error) {
        notify('Erro ao excluir tipo', 'error');
      }
    }
  };

  // --- Status Handlers ---
  const handleAddStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomerStatus(newStatus);
      setNewStatus({ name: '', description: '', is_active_status: true });
      notify('Status criado com sucesso!', 'success');
      loadData();
    } catch (error) {
      notify('Erro ao adicionar status', 'error');
    }
  };

  const startEditingStatus = (status: CustomerStatus) => {
    setEditingStatusId(status.id);
    setEditStatusForm({ 
      name: status.name, 
      description: status.description || '', 
      is_active_status: status.is_active_status 
    });
  };

  const handleUpdateStatus = async (id: number) => {
    try {
      await updateCustomerStatus(id, editStatusForm);
      setEditingStatusId(null);
      notify('Status atualizado com sucesso!', 'success');
      loadData();
    } catch (error) {
      notify('Erro ao atualizar status', 'error');
    }
  };

  const handleDeleteStatus = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este status?')) {
      try {
        await deleteCustomerStatus(id);
        notify('Status excluído com sucesso!', 'success');
        loadData();
      } catch (error) {
        notify('Erro ao excluir status', 'error');
      }
    }
  };

  return (
    <LayoutPage 
      title="Configurações do Sistema" 
      subtitle="Gerencie os parâmetros globais de tipos e status de clientes."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Types Section */}
        <div className="space-y-6">
          <Card className="p-6 border-primary/10">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
              <Settings size={20} className="text-primary" />
              Tipos de Clientes
            </h2>
            
            <form onSubmit={handleAddType} className="space-y-4 mb-8 bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-xl border border-gray-100 dark:border-dark-border">
              <Input 
                label="Nome do Tipo" 
                value={newType.name} 
                onChange={e => setNewType({...newType, name: e.target.value})}
                placeholder="Ex: Premium, Standard..."
                required
              />
              <Input 
                label="Descrição" 
                value={newType.description} 
                onChange={e => setNewType({...newType, description: e.target.value})}
                placeholder="Breve descrição do tipo"
              />
              <Button type="submit" className="w-full">
                <Plus size={16} className="mr-2" /> Adicionar Tipo
              </Button>
            </form>

            <div className="space-y-3">
              {types.map(type => (
                <div key={type.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface transition-colors">
                  {editingTypeId === type.id ? (
                    <div className="space-y-3">
                      <Input 
                        value={editTypeForm.name}
                        onChange={e => setEditTypeForm({...editTypeForm, name: e.target.value})}
                        placeholder="Nome"
                        autoFocus
                      />
                      <Input 
                        value={editTypeForm.description}
                        onChange={e => setEditTypeForm({...editTypeForm, description: e.target.value})}
                        placeholder="Descrição"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setEditingTypeId(null)}>
                          <X size={14} className="mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" onClick={() => handleUpdateType(type.id)}>
                          <Check size={14} className="mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{type.name}</p>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => startEditingType(type)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteType(type.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Customer Statuses Section */}
        <div className="space-y-6">
          <Card className="p-6 border-primary/10">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
              <Activity size={20} className="text-primary" />
              Status de Clientes
            </h2>
            
            <form onSubmit={handleAddStatus} className="space-y-4 mb-8 bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-xl border border-gray-100 dark:border-dark-border">
              <Input 
                label="Nome do Status" 
                value={newStatus.name} 
                onChange={e => setNewStatus({...newStatus, name: e.target.value})}
                placeholder="Ex: Ativo, Em Análise..."
                required
              />
              <Input 
                label="Descrição" 
                value={newStatus.description} 
                onChange={e => setNewStatus({...newStatus, description: e.target.value})}
                placeholder="O que este status significa"
              />
              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  className="w-4 h-4 accent-primary border-gray-300 dark:border-dark-border rounded focus:ring-primary bg-white dark:bg-dark-surface transition-all"
                  checked={newStatus.is_active_status}
                  onChange={e => setNewStatus({...newStatus, is_active_status: e.target.checked})}
                />
                <label htmlFor="is_active" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Marcar como status Ativo</label>
              </div>
              <Button type="submit" className="w-full">
                <Plus size={16} className="mr-2" /> Adicionar Status
              </Button>
            </form>

            <div className="space-y-3">
              {statuses.map(status => (
                <div key={status.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface transition-colors">
                  {editingStatusId === status.id ? (
                    <div className="space-y-3">
                      <Input 
                        value={editStatusForm.name}
                        onChange={e => setEditStatusForm({...editStatusForm, name: e.target.value})}
                        placeholder="Nome"
                        autoFocus
                      />
                      <Input 
                        value={editStatusForm.description}
                        onChange={e => setEditStatusForm({...editStatusForm, description: e.target.value})}
                        placeholder="Descrição"
                      />
                       <div className="flex items-center gap-3 py-2">
                        <input 
                          type="checkbox" 
                          id={`edit_active_${status.id}`}
                          className="w-4 h-4 accent-primary border-gray-300 dark:border-dark-border rounded focus:ring-primary bg-white dark:bg-dark-surface transition-all"
                          checked={editStatusForm.is_active_status}
                          onChange={e => setEditStatusForm({...editStatusForm, is_active_status: e.target.checked})}
                        />
                        <label htmlFor={`edit_active_${status.id}`} className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Status Ativo</label>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setEditingStatusId(null)}>
                          <X size={14} className="mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" onClick={() => handleUpdateStatus(status.id)}>
                          <Check size={14} className="mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{status.name}</p>
                        <p className="text-xs text-gray-500">{status.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.is_active_status ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 dark:bg-dark-DEFAULT dark:text-gray-400'}`}>
                          {status.is_active_status ? 'Ativo' : 'Inativo'}
                        </span>
                        <div className="flex gap-1 border-l border-gray-200 dark:border-dark-border pl-3 ml-2">
                          <button 
                            onClick={() => startEditingStatus(status)}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteStatus(status.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </LayoutPage>
  );
};

export default AdminCustomerSettingsPage;
