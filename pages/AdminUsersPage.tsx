import React, { useState, useEffect } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, UserPlus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/Card';
import { getAllTenants } from '../services/customerService';
import { getAllUsers, createUser } from '../services/userService';
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 4,
    tenant_id: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [loadedTenants, loadedUsers] = await Promise.all([
        getAllTenants(),
        getAllUsers()
      ]);
      
      setTenants(loadedTenants);
      
      // Map API users to UI format
      const mappedUsers = loadedUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role?.name || 'Utilizador',
        tenant: 'Global' // Users in this API are global, but can be associated with customers
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  const columns: Column<User>[] = [
    { header: 'Nome', accessor: 'name', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Email', accessor: 'email', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Perfil', accessor: 'role', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        name: newUserData.name,
        email: newUserData.email,
        password: newUserData.password,
        role_id: newUserData.role_id,
        status: true
      });
      
      alert('Utilizador adicionado com sucesso!');
      setIsFormOpen(false);
      loadData();
      setNewUserData({ name: '', email: '', password: '', role_id: 4, tenant_id: '' });
    } catch (error) {
      alert('Erro ao criar utilizador');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
             <Input 
               label="Nome Completo" 
               placeholder="Ex: Maria João" 
               required 
               value={newUserData.name}
               onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
             />
             <Input 
               label="Email Corporativo" 
               type="email" 
               placeholder="maria@empresa.com" 
               required 
               value={newUserData.email}
               onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
             />
             <Input 
               label="Senha" 
               type="password" 
               placeholder="******" 
               required 
               value={newUserData.password}
               onChange={(e) => setNewUserData({...newUserData, password: e.target.value})}
             />
             
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Perfil de Acesso</label>
               <select 
                 className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                 value={newUserData.role_id}
                 onChange={(e) => setNewUserData({...newUserData, role_id: parseInt(e.target.value)})}
               >
                 <option value={1}>CEO</option>
                 <option value={2}>Admin</option>
                 <option value={3}>Manager</option>
                 <option value={4}>User</option>
                 <option value={5}>Employee</option>
               </select>
             </div>

             <div className="md:col-span-2 flex justify-end gap-2 mt-2">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Criar Utilizador</Button>
             </div>
          </form>
        </Card>
      )}
      
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Perfil</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cliente (Tenant)</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  Nenhum utilizador encontrado
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.tenant}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              Mostrando {paginatedUsers.length} de {filteredUsers.length} utilizadores
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