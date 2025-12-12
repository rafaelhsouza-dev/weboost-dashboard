import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Combobox } from '../components/Combobox';
import { Plus, X, UserPlus2, Search } from 'lucide-react';

export const AdminReferralsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
    { header: 'Quem Indicou', accessor: 'referrer', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Indicado', accessor: 'referred', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Data', accessor: 'date', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${row.status === 'Convertido' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
        `}>
          {row.status}
        </span>
      ),
      className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
    },
    { header: 'Comissão/Prémio', accessor: 'reward', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
  ];

  // Mock list of potential referrers (Clients, Partners, Employees)
  const referrerOptions = [
    { value: 'c1', label: 'Cliente 1' },
    { value: 'c2', label: 'Cliente 2' },
    { value: 'c3', label: 'Cliente 3' },
    { value: 'c4', label: 'Cliente 4' },
    { value: 'p1', label: 'Parceiro 1' },
    { value: 'u1', label: 'Funcionário 1' },
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

  const filteredReferrals = referrals.filter(referral =>
    referral.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    referral.referred.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
             <UserPlus2 className="text-primary h-5 w-5"/> Indicações (Referrals)
           </h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Controle de indicações e comissões.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar indicações..."
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
            Nova Indicação
          </Button>
        </div>
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