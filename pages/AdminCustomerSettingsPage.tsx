import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Plus, Settings, Activity } from 'lucide-react';
import { 
  listCustomerTypes, 
  addCustomerType, 
  listCustomerStatuses, 
  addCustomerStatus 
} from '../services/customerService';
import { CustomerType, CustomerStatus } from '../types';
import { LayoutPage } from '../components/LayoutPage';

export const AdminCustomerSettingsPage: React.FC = () => {
  const [types, setTypes] = useState<CustomerType[]>([]);
  const [statuses, setStatuses] = useState<CustomerStatus[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [newType, setNewType] = useState({ name: '', description: '' });
  const [newStatus, setNewStatus] = useState({ name: '', description: '', is_active_status: true });

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomerType(newType);
      setNewType({ name: '', description: '' });
      loadData();
    } catch (error) {
      alert('Erro ao adicionar tipo');
    }
  };

  const handleAddStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomerStatus(newStatus);
      setNewStatus({ name: '', description: '', is_active_status: true });
      loadData();
    } catch (error) {
      alert('Erro ao adicionar status');
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
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
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
                <div key={type.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border flex justify-between items-center hover:bg-primary/[0.02] transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
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
                  className="w-4 h-4 text-primary border-gray-300 dark:border-dark-border rounded focus:ring-primary bg-white dark:bg-dark-surface transition-all"
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
                <div key={status.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border flex justify-between items-center hover:bg-primary/[0.02] transition-colors">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{status.name}</p>
                    <p className="text-xs text-gray-500">{status.description}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.is_active_status ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 dark:bg-dark-DEFAULT dark:text-gray-400'}`}>
                    {status.is_active_status ? 'Ativo' : 'Inativo'}
                  </span>
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