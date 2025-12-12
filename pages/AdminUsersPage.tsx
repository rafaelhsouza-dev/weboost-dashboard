import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, UserPlus, Search } from 'lucide-react';
import { Card } from '../components/Card';
import { getAllTenants } from '../services/customerService';
import { Tenant } from '../types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tenant: string;
}

export const AdminUsersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Admin Weboost', email: 'rafael@weboost.com', role: 'Administrador', tenant: 'Admin System' },
    { id: 2, name: 'Ana Silva', email: 'ana@cliente.com', role: 'Gestor', tenant: 'Cliente 1' },
    { id: 3, name: 'Pedro Santos', email: 'pedro@cliente.com', role: 'Funcionário', tenant: 'Cliente 2' },
    { id: 4, name: 'Maria João', email: 'maria@cliente.com', role: 'Funcionário', tenant: 'Cliente 3' },
  ]);

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const loadedTenants = await getAllTenants();
        setTenants(loadedTenants);
      } catch (error) {
        console.error('Failed to load tenants for user form:', error);
        // In production, we should handle this error appropriately
        // For now, we'll just log it and leave tenants as empty array
      }
    };
    
    loadTenants();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<User>[] = [
    { header: 'Nome', accessor: 'name', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Email', accessor: 'email', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Perfil', accessor: 'role', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Cliente (Tenant)', accessor: 'tenant', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Utilizador adicionado com sucesso!');
    setIsFormOpen(false);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
           <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Gestão de Utilizadores</h1>
           <p className="text-sm text-gray-500 dark:text-gray-400">Controle de acesso global à plataforma.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar utilizadores..."
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
            Novo Utilizador
          </Button>
        </div>
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
                 {tenants.map(t => (
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