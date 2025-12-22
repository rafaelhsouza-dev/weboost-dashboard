import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, UserPlus, Search } from 'lucide-react';
import { Card } from '../components/Card';
import { getAllTenants } from '../services/customerService';
import { getAllUsers, createUser } from '../services/userService';
import { Tenant } from '../types';
import { LayoutPage } from '../components/LayoutPage';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tenant: string;
}

export const AdminUsersPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 4,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const loadedUsers = await getAllUsers();
      
      const mappedUsers = loadedUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role?.name || 'Utilizador',
        tenant: 'Global'
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

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
      setNewUserData({ name: '', email: '', password: '', role_id: 4 });
    } catch (error) {
      alert('Erro ao criar utilizador');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LayoutPage 
      title="Gestão de Utilizadores" 
      subtitle="Controle de acesso global à plataforma."
      actions={
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none w-full md:w-64 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? <X size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
            {isFormOpen ? 'Fechar Form' : 'Novo Utilizador'}
          </Button>
        </div>
      }
    >
      {isFormOpen && (
        <Card className="mb-8 border-primary/20 bg-primary/5 p-6 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <UserPlus size={20} className="text-primary"/>
            Novo Registo de Utilizador
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

             <div className="md:col-span-2 flex justify-end gap-3 mt-4">
               <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Criar Utilizador</Button>
             </div>
          </form>
        </Card>
      )}
      
      <div className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Perfil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center animate-pulse">Carregando...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Nenhum utilizador encontrado.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </LayoutPage>
  );
};
