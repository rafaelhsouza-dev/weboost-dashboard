import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../store';
import { apiPost, handleApiResponse } from '../services/apiClient';

interface CustomerFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess, onCancel }) => {
  const { accessToken } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    schema_name: '',
    status: true,
    phone: '',
    type_id: 1,
    status_customer_id: 1,
    manager_id: 1,
    date_init: new Date().toISOString().split('T')[0],
    fiscal_name: '',
    nif: '',
    url_website: '',
    url_ecommerce: '',
    street_name: '',
    street_number: '',
    city: '',
    country: 'Portugal',
    zip: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    other_contacts_ids: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Creating customer with data:', formData);
      
      const response = await apiPost('/customers/', formData, true);
      const result = await handleApiResponse(response);
      
      console.log('Customer created successfully:', result);
      setSuccess('Cliente criado com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        schema_name: '',
        nif: '',
        phone: ''
      });
      
    } catch (err) {
      console.error('Error creating customer:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Cadastro de Novo Cliente
      </h2>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4 text-sm text-green-700 dark:text-green-300">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Nome Fiscal"
            name="fiscal_name"
            value={formData.fiscal_name}
            onChange={handleChange}
            placeholder="Ex: Empresa XYZ Ltda"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ex: contato@empresa.com"
            required
          />

          <Input
            label="NIF"
            name="nif"
            value={formData.nif}
            onChange={handleChange}
            placeholder="Ex: 123456789"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ex: +351900000000"
          />

          <Input
            label="Data de Início"
            name="date_init"
            type="date"
            value={formData.date_init}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Nome do Schema"
          name="schema_name"
          value={formData.schema_name}
          onChange={handleChange}
          placeholder="Ex: empresa_xyz"
          required
          helpText="Nome único para o schema do banco de dados (será prefixado com 'customer_')"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website"
            name="url_website"
            type="url"
            value={formData.url_website}
            onChange={handleChange}
            placeholder="Ex: https://empresa.com"
          />

          <Input
            label="E-commerce"
            name="url_ecommerce"
            type="url"
            value={formData.url_ecommerce}
            onChange={handleChange}
            placeholder="Ex: https://loja.empresa.com"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-6 border-t border-gray-200 dark:border-gray-700">
          Endereço
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Rua"
            name="street_name"
            value={formData.street_name}
            onChange={handleChange}
            placeholder="Ex: Rua Principal"
          />

          <Input
            label="Número"
            name="street_number"
            value={formData.street_number}
            onChange={handleChange}
            placeholder="Ex: 123"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Cidade"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Ex: Lisboa"
          />

          <Input
            label="País"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Ex: Portugal"
          />

          <Input
            label="CEP"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="Ex: 1234-567"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white pt-6 border-t border-gray-200 dark:border-gray-700">
          Informações de Contato
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nome do Proprietário"
            name="owner_name"
            value={formData.owner_name}
            onChange={handleChange}
            placeholder="Ex: João Silva"
          />

          <Input
            label="Email do Proprietário"
            name="owner_email"
            type="email"
            value={formData.owner_email}
            onChange={handleChange}
            placeholder="Ex: joao@empresa.com"
          />

          <Input
            label="Telefone do Proprietário"
            name="owner_phone"
            value={formData.owner_phone}
            onChange={handleChange}
            placeholder="Ex: +351900000000"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Nome do Contato"
            name="contact_name"
            value={formData.contact_name}
            onChange={handleChange}
            placeholder="Ex: Maria Souza"
          />

          <Input
            label="Email do Contato"
            name="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="Ex: maria@empresa.com"
          />

          <Input
            label="Telefone do Contato"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleChange}
            placeholder="Ex: +351900000001"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <Button 
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Criando...' : 'Criar Cliente'}
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
    </div>
  );
};