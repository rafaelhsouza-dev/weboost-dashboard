import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { UserForm } from '../components/UserForm';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';
import { List } from 'lucide-react';

export const AdminUserCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <LayoutPage 
      title="Novo Utilizador" 
      subtitle="Registe um novo utilizador no sistema global."
      actions={
        <Button 
          onClick={() => navigate('/admin/users')}
          variant="outline"
          className="border-gray-100 dark:border-dark-border"
        >
          <List size={16} className="mr-2" /> Ver Lista
        </Button>
      }
    >
      <Card className="p-8 border-primary/10">
        <UserForm
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

export default AdminUserCreatePage;
