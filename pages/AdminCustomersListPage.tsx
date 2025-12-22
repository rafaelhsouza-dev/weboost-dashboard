import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomers, deleteCustomer, handleApiResponse } from '../services/customerService';
import { Pencil, Plus, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
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
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 25;

  // Fetch customers from API
  const fetchCustomers = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate skip based on page and items per page
      const skip = (page - 1) * itemsPerPage;
      
      const data = await fetchCustomers(skip, itemsPerPage);
      
      // Filter by search term if provided
      let filteredData = data;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = data.filter(customer =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          (customer.phone && customer.phone.includes(search)) ||
          (customer.nif && customer.nif.includes(search))
        );
      }
      
      setCustomers(filteredData);
      setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      setError('Falha ao carregar clientes. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCustomers(1, searchTerm);
  }, [searchTerm]);

  // Carregar dados inicialmente
  useEffect(() => {
    void fetchCustomers(1, '');
  }, []);

  // Removido a filtragem local, pois agora a busca é feita via API

  const handleEditCustomer = (customerId: number) => {
    navigate(`/admin/clients/${customerId}/edit`);
  };

  const handleAddCustomer = () => {
    navigate('/admin/clients/new');
  };

  const handleDeleteCustomer = async (customerId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      try {
        await deleteCustomer(customerId);
        // Refresh the list
        await fetchCustomers(currentPage, searchTerm);
      } catch (error) {
        console.error('Failed to delete customer:', error);
        setError('Falha ao excluir cliente. Por favor, tente novamente.');
      }
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  void fetchCustomers(1, searchTerm);
                }
              }}
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
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleEditCustomer(customer.id)}
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Editar cliente"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                Mostrando {customers.length} de {customers.length} clientes
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {/* First Page */}
                <button
                  onClick={() => void fetchCustomers(1, searchTerm)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Primeira página"
                >
                  <div className="flex">
                    <ChevronLeft className="h-3 w-3" />
                    <ChevronLeft className="h-3 w-3 -ml-0.5" />
                  </div>
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={() => void fetchCustomers(currentPage - 1, searchTerm)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página anterior"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                
                {/* Page Numbers - Dynamic range */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show 2 pages, last 2 pages, and pages around paged
                  const shouldShow = page <= 2 || page > totalPages - 2 || (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (shouldShow) {
                    return (
                      <button
                        key={page}
                        onClick={() => void fetchCustomers(page, searchTerm)}
                        className={`px-2 py-1 rounded-md text-xs transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        title={`Ir para página ${page}`}
                      >
                        {page}
                      </button>
                    );
                  }
                  
                  // Show ellipsis for gaps
                  if ((page === 3 && currentPage > 4) || (page === totalPages - 2 && currentPage < totalPages - 3)) {
                    return (
                      <span key={`ellipsis-${page}`} className="px-2 py-2 text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        ...
                      </span>
                    );
                  }
                  
                  return null;
                })}
                
                {/* Next Page */}
                <button
                  onClick={() => void fetchCustomers(currentPage + 1, searchTerm)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Próxima página"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={() => void fetchCustomers(totalPages, searchTerm)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Última página"
                >
                  <div className="flex">
                    <ChevronRight className="h-3 w-3" />
                    <ChevronRight className="h-3 w-3 -ml-0.5" />
                  </div>
                </button>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


