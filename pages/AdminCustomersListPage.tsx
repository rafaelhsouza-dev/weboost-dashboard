import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers as fetchCustomersApi, deleteCustomer } from '../services/customerService';
import { Pencil, Plus, Search, ChevronLeft, ChevronRight, Trash2, Eye, Users as UsersIcon } from 'lucide-react';
import { UserPermissionModal } from '../components/UserPermissionModal';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  schema_name: string;
  status: boolean;
  // Campos removidos que não estão no fetch principal
  // city: string | null;
  // country: string | null;
  // created_at: string;
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
      
      // Usando a função da API com alias
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
      // Heurística para paginação: se retornou menos que o limite, é a última página
      if (data.length < itemsPerPage) {
        setIsLastPage(true);
      } else {
        setIsLastPage(false);
      }

    } catch (err) {
      console.error('Failed to fetch customers:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Falha ao carregar clientes: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    // Debounce search term
    const handler = setTimeout(() => {
      loadCustomers(1, searchTerm);
    }, 300); // 300ms delay
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, loadCustomers]);
  
  // Carregar dados iniciais
  useEffect(() => {
    loadCustomers(1, '');
  }, [loadCustomers]);

  const handleViewCustomer = (customerId: number) => {
    navigate(`/admin/customer-view/${customerId}`);
  };

  const handleEditCustomer = (customerId: number) => {
    navigate(`/admin/clients/${customerId}/edit`);
  };

  const handleAddCustomer = () => {
    navigate('/admin/customer-create');
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita e todos os dados do cliente serão perdidos.')) {
      try {
        await deleteCustomer(customerId);
        // Refresh the list after deletion
        loadCustomers(currentPage, searchTerm);
      } catch (err) {
        console.error('Failed to delete customer:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`Falha ao excluir cliente: ${errorMessage}`);
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0) {
      loadCustomers(newPage, searchTerm);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
          Lista de Clientes
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar clientes..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus size={14} />
            Adicionar Cliente
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Schema</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">#{customer.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.schema_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          customer.status ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        }`}>
                          {customer.status ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.phone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => setSelectedCustomerForPermissions({ id: customer.id, name: customer.name })}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Gerir Acessos de Utilizadores"
                          >
                            <UsersIcon className="h-5 w-5" />
                          </button>
                           <button
                            onClick={() => handleViewCustomer(customer.id)}
                            className="text-gray-400 hover:text-primary transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditCustomer(customer.id)}
                            className="text-gray-400 hover:text-primary transition-colors"
                            title="Editar cliente"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Excluir cliente"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Página {currentPage}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isLastPage}
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
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
    </div>
  );
};

