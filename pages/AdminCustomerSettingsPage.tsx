import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Plus, Trash2 } from 'lucide-react';
import { 
  listCustomerTypes, 
  addCustomerType, 
  listCustomerStatuses, 
  addCustomerStatus 
} from '../services/customerService';
import { CustomerType, CustomerStatus } from '../types';

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
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configurações de Clientes</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie os tipos e status disponíveis para os clientes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Types Section */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Tipos de Clientes</h2>
            <form onSubmit={handleAddType} className="space-y-3 mb-6">
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

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {types.map(type => (
                <div key={type.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Customer Statuses Section */}
        <div className="space-y-4">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status de Clientes</h2>
            <form onSubmit={handleAddStatus} className="space-y-3 mb-6">
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
              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={newStatus.is_active_status}
                  onChange={e => setNewStatus({...newStatus, is_active_status: e.target.checked})}
                />
                <label htmlFor="is_active" className="text-sm text-gray-700 dark:text-gray-300">Considerar como status Ativo</label>
              </div>
              <Button type="submit" className="w-full">
                <Plus size={16} className="mr-2" /> Adicionar Status
              </Button>
            </form>

            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {statuses.map(status => (
                <div key={status.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{status.name}</p>
                    <p className="text-xs text-gray-500">{status.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${status.is_active_status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {status.is_active_status ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerSettingsPage;
