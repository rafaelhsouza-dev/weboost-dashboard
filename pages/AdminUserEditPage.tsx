import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserForm } from '../components/UserForm';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';

export const AdminUserEditPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  return (
    <LayoutPage 
      title="Editar Utilizador" 
      subtitle="Atualize os dados e permissões do utilizador."
      actions={
        <Button 
          onClick={() => navigate('/admin/users')}
          variant="outline"
          className="border-gray-100 dark:border-dark-border"
        >
          Voltar para Lista
        </Button>
      }
    >
      <Card className="p-8 border-primary/10">
        <UserForm
          userId={userId ? parseInt(userId) : undefined}
          onSuccess={() => {
            setTimeout(() => {
              navigate('/admin/users');
            }, 1000);
          }}
          onCancel={() => navigate('/admin/users')}
        />
      </Card>
    </LayoutPage>
  );
};

export default AdminUserEditPage;
