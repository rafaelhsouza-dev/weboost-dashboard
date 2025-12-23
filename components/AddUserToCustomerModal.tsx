import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Combobox, Option } from './Combobox';
import { getAllUsers } from '../services/userService';
import { addUserToCustomer } from '../services/customerService';

interface AddUserToCustomerModalProps {
  customerId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUserToCustomerModal: React.FC<AddUserToCustomerModalProps> = ({ customerId, onClose, onSuccess }) => {
  const [allUsers, setAllUsers] = useState<Option[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers(0, 1000); // Fetch up to 1000 users
        const userOptions = usersData.map(user => ({
          value: user.id.toString(),
          label: `${user.name} (${user.email})`,
        }));
        setAllUsers(userOptions);
      } catch (err) {
        setError('Falha ao carregar utilizadores.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (!selectedUserId) {
      setError('Por favor, selecione um utilizador.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await addUserToCustomer(customerId, parseInt(selectedUserId));
      onSuccess(); // Callback to refresh the user list on the parent page
      onClose();   // Close the modal
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Falha ao adicionar utilizador: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adicionar Utilizador ao Cliente</h2>
        
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Combobox
            label="Selecione um Utilizador"
            options={allUsers}
            value={selectedUserId}
            onChange={(value) => setSelectedUserId(value as string)}
            placeholder="Pesquisar por nome ou email..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddUser} disabled={loading}>
            {loading ? 'A adicionar...' : 'Adicionar Utilizador'}
          </Button>
        </div>
      </div>
    </div>
  );
};
