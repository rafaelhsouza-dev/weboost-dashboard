import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Combobox } from '../components/Combobox';
import { Plus, X, UserPlus2 } from 'lucide-react';

export const AdminReferralsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [referrals, setReferrals] = useState([
    { id: 1, referrer: 'João Silva (Cliente A)', referred: 'Empresa Z', date: '2024-02-10', status: 'Convertido', reward: '€100' },
    { id: 2, referrer: 'Parceiro X', referred: 'Loja Y', date: '2024-02-15', status: 'Em Análise', reward: 'Pendente' },
  ]);

  const [formData, setFormData] = useState({
    referrer: '',
    referredCompany: '',
    referredContact: '',
    email: '',
    phone: '',
    status: ''
  });

  const columns: Column<any>[] = [
    { header: 'Quem Indicou', accessor: 'referrer' },
    { header: 'Indicado', accessor: 'referred' },
    { header: 'Data', accessor: 'date' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${row.status === 'Convertido' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
        `}>
          {row.status}
        </span>
      )
    },
    { header: 'Comissão/Prémio', accessor: 'reward' },
  ];

  // Mock list of potential referrers (Clients, Partners, Employees)
  const referrerOptions = [
    { value: 'c1', label: 'TechSolutions Lda (Cliente)' },
    { value: 'c2', label: 'Marketing Pro (Cliente)' },
    { value: 'p1', label: 'Agência Digital X (Parceiro)' },
    { value: 'u1', label: 'Admin Retentix (Funcionário)' },
  ];

  const statusOptions = [
    { value: 'Pendente', label: 'Pendente' },
    { value: 'Em Análise', label: 'Em Análise' },
    { value: 'Convertido', label: 'Convertido (Sucesso)' },
    { value: 'Perdido', label: 'Perdido (Não Fechou)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Indicação registada com sucesso!');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <UserPlus2 className="text-primary"/> Indicações (Referrals)
           </h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Controle de indicações e comissões.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} className="mr-2" />
          Nova Indicação
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-8">
           <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
             <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
               <UserPlus2 size={24}/>
               Registar Nova Indicação
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
               <X size={24}/>
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <Combobox 
                      label="Quem Indicou? (Parceiro/Cliente)"
                      options={referrerOptions}
                      value={formData.referrer}
                      onChange={(val) => setFormData({...formData, referrer: val as string})}
                      placeholder="Pesquise o nome do indicador..."
                   />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dados da Empresa Indicada (Lead)</p>
                </div>

                <Input 
                  label="Empresa Indicada" 
                  placeholder="Nome da empresa..." 
                  required 
                  value={formData.referredCompany}
                  onChange={e => setFormData({...formData, referredCompany: e.target.value})}
                />

                <Combobox 
                  label="Status da Indicação"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: val as string})}
                />

                <Input 
                  label="Pessoa de Contacto" 
                  placeholder="Nome do responsável" 
                  value={formData.referredContact}
                  onChange={e => setFormData({...formData, referredContact: e.target.value})}
                />

                <Input 
                  label="Email" 
                  type="email"
                  placeholder="email@lead.com" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />

                <Input 
                  label="Telemóvel" 
                  placeholder="+351..." 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />

                <Input 
                  label="Prémio / Comissão Estimada" 
                  placeholder="Ex: 10% ou €100" 
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Observações</label>
                <textarea className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]" placeholder="Notas sobre a indicação..."></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Salvar Indicação</Button>
             </div>
          </form>
        </div>
      )}

      <DataTable data={referrals} columns={columns} title="Histórico de Indicações" />
    </div>
  );
};