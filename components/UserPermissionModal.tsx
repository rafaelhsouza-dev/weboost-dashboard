import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Combobox, Option } from './Combobox';
import { getAllUsers } from '../services/userService';
import { 
  addUserToCustomer, 
  removeUserFromCustomer, 
  listCustomerUsers 
} from '../services/customerService';
import { ApiUserResponse } from '../types';
import { Trash2, UserPlus, X } from 'lucide-react';

interface UserPermissionModalProps {
  customerId: number;
  customerName: string;
  onClose: () => void;
}

export const UserPermissionModal: React.FC<UserPermissionModalProps> = ({ 
  customerId, 
  customerName, 
  onClose 
}) => {
  const [allUsers, setAllUsers] = useState<Option[]>([]);
  const [customerUsers, setCustomerUsers] = useState<ApiUserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, currentPermissions] = await Promise.all([
        getAllUsers(0, 1000),
        listCustomerUsers(customerId)
      ]);
      
      const userOptions = usersData.map(user => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
      }));
      
      setAllUsers(userOptions);
      setCustomerUsers(currentPermissions);
    } catch (err) {
      setError('Falha ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customerId]);

  const handleAddUser = async () => {
    if (!selectedUserId) return;
    
    setLoading(true);
    setError(null);
    try {
      await addUserToCustomer(customerId, parseInt(selectedUserId));
      setSelectedUserId('');
      loadData();
    } catch (err) {
      setError('Falha ao adicionar utilizador.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!window.confirm('Remover acesso deste utilizador?')) return;
    
    setLoading(true);
    try {
      await removeUserFromCustomer(customerId, userId);
      loadData();
    } catch (err) {
      setError('Falha ao remover utilizador.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerir Acessos</h2>
            <p className="text-sm text-gray-500">{customerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

          {/* Add User Section */}
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Combobox
                label="Adicionar Utilizador"
                options={allUsers.filter(opt => !customerUsers.some(cu => cu.id.toString() === opt.value))}
                value={selectedUserId}
                onChange={(val) => setSelectedUserId(val as string)}
                placeholder="Pesquisar utilizador..."
              />
            </div>
            <Button onClick={handleAddUser} disabled={!selectedUserId || loading} className="h-[42px]">
              <UserPlus size={18} className="mr-2" /> Adicionar
            </Button>
          </div>

          {/* Current Users Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Utilizadores com Acesso</h3>
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Nome</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {customerUsers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-gray-500">Nenhum utilizador associado.</td>
                    </tr>
                  ) : (
                    customerUsers.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-2 text-gray-900 dark:text-white">{user.name}</td>
                        <td className="px-4 py-2 text-gray-500">{user.email}</td>
                        <td className="px-4 py-2 text-right">
                          <button 
                            onClick={() => handleRemoveUser(user.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Remover Acesso"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </div>
  );
};
