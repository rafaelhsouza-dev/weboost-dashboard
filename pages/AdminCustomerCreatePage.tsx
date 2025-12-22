import React, { useState } from 'react';
import { CustomerCompleteForm } from '../components/CustomerCompleteForm';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { CustomerList } from '../components/CustomerList';
import { LayoutPage } from '../components/LayoutPage';
import { Card } from '../components/Card';
import { List, Plus } from 'lucide-react';

export const AdminCustomerCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);
  const [refreshList, setRefreshList] = useState(false);

  const handleSuccess = () => {
    setRefreshList(!refreshList);
    setShowForm(false);
  };

  return (
    <LayoutPage 
      title={showForm ? "Novo Cliente" : "Lista de Clientes"} 
      subtitle={showForm ? "Preencha os dados para criar um novo inquilino no sistema." : "Gerencie os clientes cadastrados."}
      actions={
        <Button 
          onClick={() => setShowForm(!showForm)}
          variant="outline"
        >
          {showForm ? <List size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />}
          {showForm ? "Ver Lista" : "Novo Cliente"}
        </Button>
      }
    >
      {showForm ? (
        <Card className="p-8 max-w-5xl mx-auto border-primary/10">
          <CustomerCompleteForm 
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Card>
      ) : (
        <CustomerList refreshTrigger={refreshList} />
      )}
    </LayoutPage>
  );
};