import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { getUserById } from '../services/userService';
import { User, Mail, Calendar, Shield, Activity, ArrowLeft, Pencil } from 'lucide-react';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';
import { useApp } from '../store';

export const AdminUserViewPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { notify } = useApp();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const userData = await getUserById(parseInt(userId));
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user:', err);
        notify('Falha ao carregar dados do utilizador', 'error');
      } finally {
        setLoading(false);
      }
    };
    void loadUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Utilizador não encontrado.</p>
        <Button onClick={() => navigate('/admin/users')} variant="secondary" className="mt-4">
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <LayoutPage 
      title="Detalhes do Utilizador" 
      subtitle="Informações completas e perfil de acesso."
      actions={
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/admin/users/${user.id}/edit`)} variant="primary" size="sm">
            <Pencil className="h-4 w-4 mr-2" /> Editar Perfil
          </Button>
          <Button onClick={() => navigate('/admin/users')} variant="outline" size="sm" className="border-gray-100 dark:border-dark-border">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 dark:bg-dark-DEFAULT dark:text-gray-400'}`}>
                  {user.status ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoItem icon={Shield} label="Perfil de Acesso" value={user.role?.name || 'N/A'} />
            <InfoItem icon={Mail} label="Email Principal" value={user.email} />
            <InfoItem icon={Calendar} label="Data de Registo" value={new Date(user.created_at).toLocaleDateString()} />
            <InfoItem icon={Activity} label="Última Atualização" value={new Date(user.updated_at).toLocaleDateString()} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Permissões de Perfil</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 dark:bg-dark-DEFAULT rounded-lg border border-gray-100 dark:border-dark-border">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{user.role?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.role?.description || 'Sem descrição detalhada para este perfil.'}</p>
            </div>
          </div>
        </Card>
      </div>
    </LayoutPage>
  );
};

const InfoItem: React.FC<{icon: React.ElementType, label: string, value: string}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 bg-gray-50 dark:bg-dark-DEFAULT rounded-lg border border-gray-100 dark:border-dark-border">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-base font-bold text-gray-900 dark:text-white mt-0.5">{value}</p>
    </div>
  </div>
);

export default AdminUserViewPage;
