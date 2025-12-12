import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { getCampaigns } from '../services/mockService';
import { Button } from '../components/Button';
import { Plus, Mail, MessageSquare, MousePointer, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { DateRangePicker } from '../components/DateRangePicker';

export const MarketingPage: React.FC = () => {
  const data = getCampaigns();

  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Campanha', accessor: 'name', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { 
      header: 'Canal', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
           {row.channel === 'Email' && <Mail size={14} />}
           {row.channel === 'SMS' && <MessageSquare size={14} />}
           {row.channel === 'Ads' && <MousePointer size={14} />}
           {row.channel}
        </div>
      ),
      className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
    },
    { header: 'Status', accessor: 'status', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Audiência', accessor: 'audience', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Conversão', accessor: 'conversion', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
  ];

  const filteredCampaigns = data.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Marketing Automation</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar campanhas..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Busca ao pressionar Enter
                }
              }}
            />
          </div>
          <DateRangePicker />
          <Button variant="secondary" className="text-sm font-medium">
            <Plus size={14} className="mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/80 to-primary text-white border-none">
          <div className="p-2">
            <h3 className="text-lg font-semibold opacity-90">Emails Enviados</h3>
            <p className="text-3xl font-bold mt-2">124,592</p>
            <p className="text-sm opacity-80 mt-1">+12% vs mês anterior</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/80 to-secondary text-white border-none">
          <div className="p-2">
            <h3 className="text-lg font-semibold opacity-90">Conversão Média</h3>
            <p className="text-3xl font-bold mt-2">4.2%</p>
            <p className="text-sm opacity-80 mt-1">Acima da média do setor</p>
          </div>
        </Card>
        <Card className="dark:bg-gray-800">
           <div className="p-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Orçamento Restante</h3>
            <p className="text-3xl font-bold text-primary mt-2">€4,500</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-primary w-[70%]"></div>
            </div>
           </div>
        </Card>
      </div>
      
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Campanha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Canal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Audiência</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversão</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedCampaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhuma campanha encontrada
                </td>
              </tr>
            ) : (
              paginatedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      {campaign.channel === 'Email' && <Mail size={14} />}
                      {campaign.channel === 'SMS' && <MessageSquare size={14} />}
                      {campaign.channel === 'Ads' && <MousePointer size={14} />}
                      {campaign.channel}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.audience}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.conversion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Mostrando {paginatedCampaigns.length} de {filteredCampaigns.length} campanhas
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
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
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                      onClick={() => setCurrentPage(page)}
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
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Próxima página"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
              
              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
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
    </div>
  );
};