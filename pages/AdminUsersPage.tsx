import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Search, Eye, Pencil, Plus } from 'lucide-react';
import { getAllUsers } from '../services/userService';
import { LayoutPage } from '../components/LayoutPage';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const loadedUsers = await getAllUsers();
      
      const mappedUsers = loadedUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role?.name || 'Utilizador'
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
      notify('Falha ao carregar lista de utilizadores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
          <Button onClick={() => navigate('/admin/user-create')}>
            <Plus size={16} className="mr-2" /> Novo Utilizador
          </Button>
        </div>
      }
    >
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

export default AdminUsersPage;