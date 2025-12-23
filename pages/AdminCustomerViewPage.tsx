import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { fetchCustomerById, listCustomerUsers, removeUserFromCustomer } from '../services/customerService';
import { Building2, User, MapPin, Phone, Mail, Calendar, Link as LinkIcon, Trash2, UserPlus, AlertCircle } from 'lucide-react';
import { ApiUserResponse } from '../types';
import { AddUserToCustomerModal } from '../components/AddUserToCustomerModal';
import { useApp } from '../store';

export const AdminCustomerViewPage: React.FC = () => {
  const { notify } = useApp();
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [users, setUsers] = useState<ApiUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadCustomerAndUsers = useCallback(async () => {
    if (!customerId) {
      setError('ID do cliente não fornecido');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // 1. Load basic customer data first
      const customerData = await fetchCustomerById(parseInt(customerId));
      setCustomer(customerData);
      
      // 2. Try to load users in a separate block to avoid failing the whole page
      try {
        const usersData = await listCustomerUsers(parseInt(customerId));
        setUsers(usersData);
      } catch (userErr) {
        console.error('Failed to load customer users:', userErr);
        notify('Aviso: Não foi possível carregar a lista de utilizadores associados.', 'error');
      }

    } catch (err) {
      console.error('Failed to load customer details:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Falha ao carregar dados do cliente: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    void loadCustomerAndUsers();
  }, [loadCustomerAndUsers]);

  const handleRemoveUser = async (userId: number) => {
    if (!customerId) return;
    if (window.confirm(`Tem certeza que deseja remover o acesso deste usuário ao cliente ${customer?.name}?`)) {
      try {
        await removeUserFromCustomer(parseInt(customerId), userId);
        notify('Acesso removido com sucesso!', 'success');
        // Refresh users list
        const usersData = await listCustomerUsers(parseInt(customerId));
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to remove user from customer:', err);
        const msg = err instanceof Error ? err.message : 'Falha ao remover utilizador';
        notify(msg, 'error');
      }
    }
  };
  
  const handleAddUserSuccess = () => {
    // Recarrega a lista de usuários após um ser adicionado com sucesso.
    if(customerId) {
      listCustomerUsers(parseInt(customerId)).then(setUsers);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-gray-900 dark:bg-dark-DEFAULT border border-gray-800 dark:border-dark-border rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-primary h-5 w-5" />
            {error}
          </div>
        </div>
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="secondary"
          className="mt-4"
        >
          Voltar para Lista
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Cliente não encontrado.</p>
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="secondary"
          className="mt-4"
        >
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
            Detalhes do Cliente
          </h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate(`/admin/clients/${customerId}/edit`)}
              variant="primary"
              size="sm"
            >
              Editar Cliente
            </Button>
            <Button 
              onClick={() => navigate('/admin/customer-list')}
              variant="secondary"
              size="sm"
            >
              Voltar para Lista
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Info Card */}
          <div className="lg:col-span-2 bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-3 rounded-full">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: #{customer.id} · Schema: {customer.schema_name}</p>
              </div>
            </div>
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <InfoItem icon={Mail} label="Email" value={customer.email} />
              <InfoItem icon={Phone} label="Telefone" value={customer.phone} />
              <InfoItem icon={LinkIcon} label="Website" value={customer.url_website} isLink />
              <InfoItem icon={Calendar} label="Cliente desde" value={new Date(customer.created_at).toLocaleDateString()} />
               <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 inline-flex text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    customer.status ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400'
                  }`}>
                    {customer.status ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Utilizadores com Acesso</h3>
              <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-3">
              {users.length > 0 ? users.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-DEFAULT/50 transition-colors">
                  <div className="flex items-center gap-3">
                     <div className="bg-gray-50 dark:bg-dark-DEFAULT rounded-full p-2 border border-gray-100 dark:border-dark-border">
                        <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                     </div>
                     <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveUser(user.id)}
                    className="text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-lg transition-all"
                    title="Remover acesso"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-4 italic">Nenhum utilizador associado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && customerId && (
        <AddUserToCustomerModal
          customerId={parseInt(customerId)}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAddUserSuccess}
        />
      )}
    </>
  );
};

const InfoItem: React.FC<{icon: React.ElementType, label: string, value: string | null, isLink?: boolean}> = ({ icon: Icon, label, value, isLink }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-gray-400 mt-0.5" />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      {value ? (
        isLink ? <a href={value} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{value}</a>
               : <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      ) : <p className="font-medium text-gray-400 dark:text-gray-500">N/A</p>}
    </div>
  </div>
);

export default AdminCustomerViewPage;
