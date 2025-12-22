import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { CustomerCompleteForm } from '../components/CustomerCompleteForm';
import { useApp } from '../store';

export const AdminCustomerEditPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Editar Cliente
        </h1>
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="secondary"
        >
          Voltar para Lista
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <CustomerCompleteForm
          customerId={customerId ? parseInt(customerId) : undefined}
          onSuccess={() => {
            setTimeout(() => {
              navigate('/admin/customer-list');
            }, 2000);
          }}
          onCancel={() => navigate('/admin/customer-list')}
        />
      </div>
    </div>
  );
};

export default AdminCustomerEditPage;
