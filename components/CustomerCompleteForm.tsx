import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../store';
import { createCustomer, updateCustomer, fetchCustomerById } from '../services/customerService';
import { useNavigate } from 'react-router-dom';

interface CustomerCompleteFormProps {
  customerId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CustomerCompleteForm: React.FC<CustomerCompleteFormProps> = ({ customerId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schema_name: '',
    nif: '',
    phone: '',
    type_id: 1,
    status_customer_id: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load customer data if editing
  useEffect(() => {
    if (customerId) {
      const loadCustomer = async () => {
        try {
          setLoading(true);
          const customer = await fetchCustomerById(customerId);
          setFormData({
            name: customer.name,
            email: customer.email,
            schema_name: customer.schema_name,
            nif: customer.nif || '',
            phone: customer.phone || '',
            type_id: customer.type_id || 1,
            status_customer_id: customer.status_customer_id || 1
          });
        } catch (error) {
          console.error('Failed to load customer:', error);
          setError('Falha ao carregar cliente');
        } finally {
          setLoading(false);
        }
      };
      void loadCustomer();
    }
  }, [customerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev,
      [name]: (name === 'type_id' || name === 'status_customer_id') ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (customerId) {
        // Update existing customer
        await updateCustomer(customerId, formData);
        setSuccess('Cliente atualizado com sucesso!');
      } else {
        // Create new customer
        await createCustomer(formData);
        setSuccess('Cliente criado com sucesso!');
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if creating new customer
      if (!customerId) {
        setFormData({
          name: '',
          email: '',
          schema_name: '',
          nif: '',
          phone: '',
          type_id: 1,
          status_customer_id: 1
        });
      }
      
    } catch (err) {
      console.error('Error saving customer:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Cliente"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Empresa XYZ Ltda"
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ex: contato@empresa.com"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="NIF"
          name="nif"
          value={formData.nif}
          onChange={handleChange}
          placeholder="Ex: 123456789"
          required
        />

        <Input
          label="Telefone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Ex: +351900000000"
        />
      </div>

      <Input
        label="Nome do Schema"
        name="schema_name"
        value={formData.schema_name}
        onChange={handleChange}
        placeholder="Ex: empresa_xyz"
        required
        helpText="O nome do schema será automaticamente prefixado com 'customer_'"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tipo de Cliente</label>
          <select 
            name="type_id"
            value={formData.type_id}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value={1}>Tipo 1</option>
            {/* Outros tipos podem ser carregados da API via listCustomerTypes */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status do Cliente</label>
          <select 
            name="status_customer_id"
            value={formData.status_customer_id}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
          >
            <option value={1}>Ativo</option>
            <option value={2}>Inativo</option>
            {/* Statuses podem ser carregados da API via listCustomerStatuses */}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <Button 
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (customerId ? 'Atualizando...' : 'Criando...') : (customerId ? 'Atualizar Cliente' : 'Criar Cliente')}
        </Button>
        
        {onCancel && (
          <Button 
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};