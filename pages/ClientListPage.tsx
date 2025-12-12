import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, handleApiResponse } from '../services/apiClient';
import { Pencil, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  country: string | null;
  created_at: string;
}

interface ApiResponse {
  customers: Customer[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export const ClientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 3;

  // Fetch customers from API
  const fetchCustomers = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/customers/customers?page=${page}&per_page=${itemsPerPage}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await apiGet(url);
      const data = await handleApiResponse(response) as ApiResponse;
      
      setCustomers(data.customers || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.page || 1);
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

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Lista de Clientes
        </h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar clientes..."
              className="pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  void fetchCustomers(1, searchTerm);
                }
              }}
            />
            <button
              onClick={() => void fetchCustomers(1, searchTerm)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary hover:text-primary/80"
              title="Buscar"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={handleAddCustomer}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={16} />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">País</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Criado em</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.phone || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.city || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{customer.country || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(customer.created_at).toLocaleDateString('pt-PT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditCustomer(customer.id)}
                        className="text-primary hover:text-primary/80 transition-colors"
                        title="Editar cliente"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
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
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Primeira página"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <ChevronLeft className="h-4 w-4 -ml-1" />
                </button>
                
                {/* Previous Page */}
                <button
                  onClick={() => void fetchCustomers(currentPage - 1, searchTerm)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Page Numbers - Dynamic range */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first 2 pages, last 2 pages, and pages around current page
                  const shouldShow = page <= 2 || page > totalPages - 2 || (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (shouldShow) {
                    return (
                      <button
                        key={page}
                        onClick={() => void fetchCustomers(page, searchTerm)}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                      <span key={`ellipsis-${page}`} className="px-2 py-2 text-gray-500 dark:text-gray-400 text-sm">
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
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Próxima página"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={() => void fetchCustomers(totalPages, searchTerm)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Última página"
                >
                  <ChevronRight className="h-4 w-4" />
                  <ChevronRight className="h-4 w-4 -ml-1" />
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


