import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, UserPlus, Search, Eye, Pencil, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { getAllTenants } from '../services/customerService';
import { getAllUsers, createUser, deleteUser } from '../services/userService';
import { Tenant } from '../types';
import { LayoutPage } from '../components/LayoutPage';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  tenant: string;
}

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useApp();
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
      
      notify('Utilizador adicionado com sucesso!', 'success');
      setIsFormOpen(false);
      loadData();
      setNewUserData({ name: '', email: '', password: '', role_id: 4 });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Erro ao criar utilizador';
      notify(msg, 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este utilizador?')) {
      try {
        await deleteUser(id);
        notify('Utilizador excluído com sucesso!', 'success');
        loadData();
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro ao excluir utilizador';
        notify(msg, 'error');
      }
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
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none w-full md:w-64 text-sm transition-all"
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
        <Card className="mb-8 border-primary/20 bg-primary/[0.03] p-6 animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
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
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Perfil de Acesso</label>
               <select 
                 className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-DEFAULT px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
               <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="border-gray-100 dark:border-dark-border">Cancelar</Button>
               <Button type="submit">Criar Utilizador</Button>
             </div>
          </form>
        </Card>
      )}
      
      <div className="overflow-hidden bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 dark:bg-black border-b border-gray-100 dark:border-dark-border">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Perfil</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center animate-pulse text-gray-400">Carregando...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">Nenhum utilizador encontrado.</td></tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${user.id}`)} title="Ver">
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/users/${user.id}/edit`)} title="Editar">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="text-gray-400 hover:text-primary">
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
