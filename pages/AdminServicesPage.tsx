import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, Layers } from 'lucide-react';
import { Card } from '../components/Card';

interface Service {
  id: number;
  name: string;
  price: string;
  billing: string;
  modules: string;
}

export const AdminServicesPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Plano CRM Starter', price: '€29.90', billing: 'Mensal', modules: 'CRM Básico' },
    { id: 2, name: 'Plano Marketing Pro', price: '€89.90', billing: 'Mensal', modules: 'CRM + Marketing + SMS' },
    { id: 3, name: 'Pack Enterprise', price: 'Sob Consulta', billing: 'Anual', modules: 'Tudo Incluído' },
  ]);

  const columns: Column<Service>[] = [
    { header: 'Nome do Serviço', accessor: 'name', className: 'font-medium' },
    { header: 'Preço Base', accessor: 'price' },
    { header: 'Faturação', accessor: 'billing' },
    { header: 'Módulos Incluídos', accessor: 'modules' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Serviço criado com sucesso!');
    setIsFormOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Catálogo de Serviços</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Planos e serviços disponíveis para subscrição.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="text-sm font-medium">
          <Plus size={14} className="mr-2" />
          Novo Serviço
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mb-6 border-primary/20 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-lg font-semibold flex items-center gap-2">
               <Layers size={20} className="text-primary"/>
               Novo Serviço / Plano
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
               <X size={20}/>
             </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Nome do Plano" placeholder="Ex: CRM Basic" required />
             <Input label="Preço (€)" placeholder="29.90" required />
             
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ciclo de Faturação</label>
               <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                 <option>Mensal</option>
                 <option>Trimestral</option>
                 <option>Anual</option>
               </select>
             </div>

             <Input label="Módulos (Separe por vírgulas)" placeholder="Ex: CRM, Email, SMS" />

             <div className="md:col-span-2 flex justify-end gap-2 mt-2">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Guardar Serviço</Button>
             </div>
          </form>
        </Card>
      )}
      
      <DataTable 
        data={services}
        columns={columns}
        title="Serviços Ativos"
      />
    </div>
  );
};