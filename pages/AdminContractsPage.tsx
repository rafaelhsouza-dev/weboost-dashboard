import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Combobox } from '../components/Combobox';
import { Plus, X, FileSignature } from 'lucide-react';

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
    { id: 1, client: 'TechSolutions Lda', startDate: '2024-01-15', value: '€1,200.00', billing: 'Mensal', status: 'Ativo' },
    { id: 2, client: 'Marketing Pro', startDate: '2023-11-01', value: '€2,500.00', billing: 'Trimestral', status: 'Ativo' },
  ]);

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const columns: Column<Contract>[] = [
    { header: 'Cliente', accessor: 'client', className: 'font-medium' },
    { header: 'Início', accessor: 'startDate' },
    { header: 'Valor (€)', accessor: 'value' },
    { header: 'Cobrança', accessor: 'billing' },
    { 
        header: 'Status', 
        accessor: (row: any) => (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            {row.status}
          </span>
        ) 
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
    { value: 'c1', label: 'TechSolutions Lda' },
    { value: 'c2', label: 'Marketing Pro' },
    { value: 'c3', label: 'Restaurante O Tacho' },
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Contratos</h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Administre os contratos e serviços ativos.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} className="mr-2" />
          Novo Contrato
        </Button>
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

      <DataTable 
        data={contracts}
        columns={columns}
        title="Contratos Ativos"
      />
    </div>
  );
};