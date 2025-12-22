import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { CustomerCompleteForm } from '../components/CustomerCompleteForm';
import { useApp } from '../store';

import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';

export const AdminCustomerEditPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  return (
    <LayoutPage 
      title="Editar Cliente" 
      subtitle="Atualize os dados e configurações do inquilino."
      actions={
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="outline"
          className="border-gray-100 dark:border-dark-border"
        >
          Voltar para Lista
        </Button>
      }
    >
      <Card className="p-8 border-primary/10">
        <CustomerCompleteForm
          customerId={customerId ? parseInt(customerId) : undefined}
          onSuccess={() => {
            setTimeout(() => {
              navigate('/admin/customer-list');
            }, 2000);
          }}
          onCancel={() => navigate('/admin/customer-list')}
        />
      </Card>
    </LayoutPage>
  );
};

export default AdminCustomerEditPage;
