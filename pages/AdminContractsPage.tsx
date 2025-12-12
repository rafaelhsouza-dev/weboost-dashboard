import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Combobox } from '../components/Combobox';
import { Plus, X, FileSignature, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface Contract {
  id: number;
  client: string;
  startDate: string;
  value: string;
  billing: string;
  status: string;
}

export const AdminContractsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([
    { id: 1, client: 'Cliente A', startDate: '2024-01-15', value: '€1,200.00', billing: 'Mensal', status: 'Ativo' },
    { id: 2, client: 'Cliente B', startDate: '2023-11-01', value: '€2,500.00', billing: 'Trimestral', status: 'Ativo' },
  ]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<Contract>[] = [
    { header: 'Cliente', accessor: 'client', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Início', accessor: 'startDate', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Valor (€)', accessor: 'value', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Cobrança', accessor: 'billing', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { 
        header: 'Status', 
        accessor: (row: any) => (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {row.status}
          </span>
        ),
        className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
    },
  ];

  const serviceOptions = [
    { value: 'crm_basic', label: 'CRM Básico' },
    { value: 'mkt_auto', label: 'Marketing Automation' },
    { value: 'email_mkt', label: 'Email Marketing' },
    { value: 'social_media', label: 'Gestão de Redes Sociais' },
    { value: 'consulting', label: 'Consultoria' },
    { value: 'support_pro', label: 'Suporte Premium' },
    { value: 'dev_hours', label: 'Banco de Horas Dev' },
  ];

  const deptOptions = [
    { value: 'sales', label: 'Comercial' },
    { value: 'finance', label: 'Financeiro' },
    { value: 'support', label: 'Suporte Técnico' },
    { value: 'dev', label: 'Desenvolvimento' },
    { value: 'marketing', label: 'Marketing' },
  ];

  const clientOptions = [
    { value: 'c1', label: 'Cliente 1' },
    { value: 'c2', label: 'Cliente 2' },
    { value: 'c3', label: 'Cliente 3' },
    { value: 'c4', label: 'Cliente 4' },
    { value: 'c5', label: 'Cliente 5' },
  ];

  const [formData, setFormData] = useState({
    client: '',
    billing: '',
    startDate: '',
    value: '',
    status: 'Ativo'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Contrato registado com sucesso!');
    setIsFormOpen(false);
  };

  const filteredContracts = contracts.filter(contract =>
    contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.billing.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Gestão de Contratos</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Administre os contratos e serviços ativos.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar contratos..."
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
          <Button onClick={() => setIsFormOpen(true)} className="text-sm font-medium">
            <Plus size={14} className="mr-2" />
            Novo Contrato
          </Button>
        </div>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-8">
           <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
             <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
               <FileSignature size={24}/>
               Novo Contrato
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
               <X size={24}/>
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <Combobox 
                     label="Cliente"
                     options={clientOptions}
                     value={formData.client}
                     onChange={(val) => setFormData({...formData, client: val as string})}
                     placeholder="Selecione o Cliente..."
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de Cobrança</label>
                   <select 
                      className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      value={formData.billing}
                      onChange={(e) => setFormData({...formData, billing: e.target.value})}
                   >
                     <option value="">Selecione...</option>
                     <option>Mensal</option>
                     <option>Trimestral</option>
                     <option>Semestral</option>
                     <option>Anual</option>
                     <option>Pontual</option>
                   </select>
                </div>
                <Input 
                  label="Início do Contrato" 
                  type="date" 
                  required 
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
                <Input label="Fim do Contrato (Opcional)" type="date" />
                <Input 
                  label="Valor do Contrato (€)" 
                  placeholder="0.00" 
                  type="number" 
                  step="0.01" 
                  required 
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                />
             </div>

             <div className="space-y-3">
                <Combobox 
                  label="Serviços Incluídos neste Contrato"
                  options={serviceOptions}
                  value={selectedServices}
                  onChange={(val) => setSelectedServices(val as string[])}
                  multi={true}
                  placeholder="Selecione um ou mais serviços..."
                />
             </div>

             <div className="space-y-3">
                <Combobox 
                  label="Departamentos Envolvidos"
                  options={deptOptions}
                  value={selectedDepartments}
                  onChange={(val) => setSelectedDepartments(val as string[])}
                  multi={true}
                  placeholder="Selecione os departamentos..."
                />
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Observações Internas</label>
                <textarea className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]" placeholder="Notas sobre o contrato..."></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Guardar Contrato</Button>
             </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Início</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Valor (€)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cobrança</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedContracts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhum contrato encontrado
                </td>
              </tr>
            ) : (
              paginatedContracts.map((contract) => (
                <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{contract.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contract.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contract.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{contract.billing}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      {contract.status}
                    </span>
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
              Mostrando {paginatedContracts.length} de {filteredContracts.length} contratos
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