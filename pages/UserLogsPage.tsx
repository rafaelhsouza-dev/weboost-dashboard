import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { apiGet, handleApiResponse } from '../services/apiClient';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface LogEntry {
  id: number;
  user_id: number;
  description: string;
  created_at: string;
}

interface ApiResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export const UserLogsPage: React.FC = () => {
  const { currentTenant } = useApp();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchLogs = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from currentTenant (assuming it's stored there)
      // If not, we'll need to get it from the auth context or another source
      const userId = currentTenant?.id || '';
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await apiGet(`/logs/logs/?user_id=${userId}&page=${page}&per_page=${itemsPerPage}`);
      const data = await handleApiResponse(response) as ApiResponse;

      setLogs(data.logs || []);
      setTotalPages(data.total_pages || 1);
      setCurrentPage(data.page || 1);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setError('Falha ao carregar logs. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const filteredLogs = logs.filter(log =>
    log.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Registos de Atividade</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Histórico de ações do utilizador</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar logs..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Search on Enter
                }
              }}
            />
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Nenhum registo encontrado
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">#{log.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.created_at).toLocaleString('pt-PT', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
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
                Mostrando {filteredLogs.length} de {logs.length} registos
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {/* First Page */}
                <button
                  onClick={() => fetchLogs(1)}
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
                  onClick={() => fetchLogs(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Página anterior"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>
                
                {/* Page Numbers - Dynamic range */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first 2 pages, last 2 pages, and pages around current page
                  const shouldShow = page <= 2 || page > totalPages - 2 || (page >= currentPage - 1 && page <= currentPage + 1);
                  
                  if (shouldShow) {
                    return (
                      <button
                        key={page}
                        onClick={() => fetchLogs(page)}
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
                  onClick={() => fetchLogs(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Próxima página"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
                
                {/* Last Page */}
                <button
                  onClick={() => fetchLogs(totalPages)}
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

export default UserLogsPage;
