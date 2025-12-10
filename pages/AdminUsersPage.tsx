import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, UserPlus } from 'lucide-react';
import { Card } from '../components/Card';
import { MOCK_TENANTS } from '../constants';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tenant: string;
}

export const AdminUsersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Admin Weboost', email: 'rafael@weboost.com', role: 'Administrador', tenant: 'Admin System' },
    { id: 2, name: 'Ana Silva', email: 'ana@techsolutions.com', role: 'Gestor', tenant: 'TechSolutions Lda' },
    { id: 3, name: 'Pedro Santos', email: 'pedro@marketing.com', role: 'Funcionário', tenant: 'Marketing Pro' },
  ]);

  const columns: Column<User>[] = [
    { header: 'Nome', accessor: 'name', className: 'font-medium' },
    { header: 'Email', accessor: 'email' },
    { header: 'Perfil', accessor: 'role' },
    { header: 'Cliente (Tenant)', accessor: 'tenant' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Utilizador adicionado com sucesso!');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Utilizadores</h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Controle de acesso global à plataforma.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} className="mr-2" />
          Novo Utilizador
        </Button>
      </div>

      {isFormOpen && (
        <Card className="mb-6 border-primary/20 bg-blue-50/50 dark:bg-blue-900/10">
          <div className="flex justify-between items-start mb-4">
             <h3 className="text-lg font-semibold flex items-center gap-2">
               <UserPlus size={20} className="text-primary"/>
               Novo Registo de Utilizador
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
               <X size={20}/>
             </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Input label="Nome Completo" placeholder="Ex: Maria João" required />
             <Input label="Email Corporativo" type="email" placeholder="maria@empresa.com" required />
             
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cliente (Tenant) Associado</label>
               <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                 {MOCK_TENANTS.map(t => (
                   <option key={t.id} value={t.id}>{t.name}</option>
                 ))}
               </select>
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Perfil de Acesso</label>
               <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                 <option>Administrador</option>
                 <option>Gestor</option>
                 <option>Funcionário</option>
                 <option>Leitura Apenas</option>
               </select>
             </div>

             <div className="md:col-span-2 flex justify-end gap-2 mt-2">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Criar Utilizador</Button>
             </div>
          </form>
        </Card>
      )}
      
      <DataTable 
        data={users}
        columns={columns}
        title="Todos os Utilizadores"
      />
    </div>
  );
};