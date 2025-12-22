import React, { useState } from 'react';
import { CustomerCompleteForm } from '../components/CustomerCompleteForm';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { CustomerList } from '../components/CustomerList';

export const AdminCustomerCreatePage: React.FC = () => {
  const { currentTenant } = useApp();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);
  const [refreshList, setRefreshList] = useState(false);

  const handleSuccess = () => {
    setRefreshList(!refreshList); // Trigger refresh of customer list
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Cadastro de Clientes
        </h1>
        
        {showForm ? (
          <Button 
            onClick={() => setShowForm(false)}
            variant="secondary"
          >
            Ver Lista de Clientes
          </Button>
        ) : (
          <Button 
            onClick={() => setShowForm(true)}
            variant="primary"
          >
            Criar Novo Cliente
          </Button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Cadastro de Novo Cliente
          </h2>
          <CustomerCompleteForm 
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      ) : (
        <CustomerList refreshTrigger={refreshList} />
      )}
    </div>
  );
};