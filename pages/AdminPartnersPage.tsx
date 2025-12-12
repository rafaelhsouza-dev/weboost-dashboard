import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Combobox } from '../components/Combobox';
import { Plus, X, Handshake } from 'lucide-react';

export const AdminPartnersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [partners, setPartners] = useState([
    { id: 1, name: 'Agência Digital X', type: 'Revendedor', contact: 'joao@x.com', status: 'Ativo' },
    { id: 2, name: 'Consultoria Y', type: 'Parceiro Tecnológico', contact: 'ana@y.com', status: 'Ativo' },
  ]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    nif: '',
    email: '',
    phone: '',
    commission: '',
    status: ''
  });

  const columns: Column<any>[] = [
    { header: 'Parceiro', accessor: 'name' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Contacto', accessor: 'contact' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${row.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}
        `}>
          {row.status}
        </span>
      )
    },
  ];

  const partnerTypes = [
    { value: 'Revendedor', label: 'Revendedor (Reseller)' },
    { value: 'Parceiro Tecnológico', label: 'Parceiro Tecnológico' },
    { value: 'Consultor Independente', label: 'Consultor Independente' },
    { value: 'Agência de Marketing', label: 'Agência de Marketing' },
    { value: 'Influenciador', label: 'Influenciador Digital' },
  ];

  const statusOptions = [
    { value: 'Ativo', label: 'Ativo' },
    { value: 'Inativo', label: 'Inativo' },
    { value: 'Em Análise', label: 'Em Análise' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Parceiro registado com sucesso!');
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
             <Handshake className="text-primary h-5 w-5"/> Parceiros
           </h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Gestão de parcerias e revendedores.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="text-sm font-medium">
          <Plus size={14} className="mr-2" />
          Novo Parceiro
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-8">
           <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
             <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
               <Handshake size={24}/>
               Registo de Novo Parceiro
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
               <X size={24}/>
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Nome da Empresa / Parceiro" 
                  placeholder="Ex: Agência XYZ" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
                
                <Combobox 
                  label="Tipo de Parceria"
                  options={partnerTypes}
                  value={formData.type}
                  onChange={(val) => setFormData({...formData, type: val as string})}
                />

                <Input 
                  label="NIF / NIPC" 
                  placeholder="123456789" 
                  value={formData.nif}
                  onChange={e => setFormData({...formData, nif: e.target.value})}
                />
                
                <Combobox 
                   label="Estado da Parceria"
                   options={statusOptions}
                   value={formData.status}
                   onChange={(val) => setFormData({...formData, status: val as string})}
                />

                <Input 
                  label="Email Principal" 
                  type="email" 
                  placeholder="parceiro@email.com" 
                  required
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
                  label="Comissão Acordada (%)" 
                  placeholder="Ex: 15%" 
                  value={formData.commission}
                  onChange={e => setFormData({...formData, commission: e.target.value})}
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notas e Observações</label>
                <textarea className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]" placeholder="Detalhes sobre o acordo..."></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Guardar Parceiro</Button>
             </div>
          </form>
        </div>
      )}

      <DataTable data={partners} columns={columns} title="Lista de Parceiros" />
    </div>
  );
};