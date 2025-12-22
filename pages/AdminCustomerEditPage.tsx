import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { CustomerCompleteForm } from '../components/CustomerCompleteForm';
import { useApp } from '../store';

export const AdminCustomerEditPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useApp();

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
          helpText="Nome único para o schema do banco de dados"
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
            {loading ? 'Atualizando...' : 'Atualizar Cliente'}
          </Button>
          
          <Button 
            type="button"
            onClick={() => navigate('/admin/customer-list')}
            variant="secondary"
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};