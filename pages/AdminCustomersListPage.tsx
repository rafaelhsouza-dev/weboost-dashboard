import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers as fetchCustomersApi, deleteCustomer } from '../services/customerService';
import { Pencil, Plus, Search, ChevronLeft, ChevronRight, Trash2, Eye, Users as UsersIcon } from 'lucide-react';
import { UserPermissionModal } from '../components/UserPermissionModal';
import { LayoutPage } from '../components/LayoutPage';
import { Button } from '../components/Button';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  schema_name: string;
  status: boolean;
}

export const AdminCustomersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const itemsPerPage = 25;
  
  const [selectedCustomerForPermissions, setSelectedCustomerForPermissions] = useState<{id: number, name: string} | null>(null);

  const loadCustomers = useCallback(async (page: number, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const skip = (page - 1) * itemsPerPage;
      const data = await fetchCustomersApi(skip, itemsPerPage);
      
      let filteredData = data;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = data.filter(customer =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          (customer.phone && customer.phone.includes(search))
        );
      }
      
      setCustomers(filteredData);
      setCurrentPage(page);
      if (data.length < itemsPerPage) {
        setIsLastPage(true);
      } else {
        setIsLastPage(false);
      }

    } catch (err) {
      console.error('Failed to fetch customers:', err);
      setError(`Falha ao carregar clientes.`);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      loadCustomers(1, searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, loadCustomers]);
  
  useEffect(() => {
    loadCustomers(1, '');
  }, [loadCustomers]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteCustomer(id);
        loadCustomers(currentPage, searchTerm);
      } catch (e) {
        alert('Erro ao excluir cliente');
      }
    }
  };

  return (
    <LayoutPage 
      title="Gestão de Clientes" 
      subtitle="Visualize e gerencie todos os inquilinos da plataforma."
      actions={
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none w-full md:w-64 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate('/admin/customer-create')}>
            <Plus size={16} className="mr-2" /> Novo Cliente
          </Button>
        </div>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4 text-red-700 dark:text-red-400">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">#{customer.id}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        customer.status ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {customer.status ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedCustomerForPermissions({ id: customer.id, name: customer.name })} title="Acessos">
                          <UsersIcon size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/customer-view/${customer.id}`)} title="Ver">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/customer-edit/${customer.id}`)} title="Editar">
                          <Pencil size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">Página {currentPage}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => loadCustomers(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeft size={16} className="mr-1" /> Anterior
              </Button>
              <Button variant="outline" size="sm" onClick={() => loadCustomers(currentPage + 1)} disabled={isLastPage}>
                Próximo <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      {selectedCustomerForPermissions && (
        <UserPermissionModal
          customerId={selectedCustomerForPermissions.id}
          customerName={selectedCustomerForPermissions.name}
          onClose={() => setSelectedCustomerForPermissions(null)}
        />
      )}
    </LayoutPage>
  );
};