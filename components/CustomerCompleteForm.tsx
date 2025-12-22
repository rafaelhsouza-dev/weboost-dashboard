import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../store';
import { 
  createCustomer, 
  updateCustomer, 
  fetchCustomerById, 
  listCustomerTypes, 
  listCustomerStatuses 
} from '../services/customerService';
import { useNavigate } from 'react-router-dom';
import { CustomerType, CustomerStatus, ApiUserResponse } from '../types';
import { getAllUsers } from '../services/userService';
import { Combobox } from './Combobox';

interface CustomerCompleteFormProps {
  customerId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CustomerCompleteForm: React.FC<CustomerCompleteFormProps> = ({ customerId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const [types, setTypes] = useState<CustomerType[]>([]);
  const [statuses, setStatuses] = useState<CustomerStatus[]>([]);
  const [availableUsers, setAvailableUsers] = useState<ApiUserResponse[]>([]);
  
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
    other_contacts_ids: [],
    info_general_id: 1
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Normalization function for schema name
  const normalizeSchemaName = (name: string) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "") // Remove everything except alphanumeric
      .replace(/\s+/g, ""); // Remove spaces
  };

  // Auto-update schema_name when name changes
  useEffect(() => {
    if (!customerId) { // Only auto-fill for new customers
      setFormData(prev => ({
        ...prev,
        schema_name: normalizeSchemaName(prev.name)
      }));
    }
  }, [formData.name, customerId]);

  // Load types, statuses and users
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [t, s, u] = await Promise.all([
          listCustomerTypes(), 
          listCustomerStatuses(),
          getAllUsers()
        ]);
        setTypes(t);
        setStatuses(s);
        setAvailableUsers(u);
      } catch (e) {
        console.error('Failed to load form config', e);
      }
    };
    loadConfig();
  }, []);

  // Load customer data if editing
  useEffect(() => {
    if (customerId) {
      const loadCustomer = async () => {
        try {
          setLoading(true);
          const customer = await fetchCustomerById(customerId);
          setFormData({
            ...customer,
            date_init: customer.date_init || new Date().toISOString().split('T')[0],
            other_contacts_ids: customer.other_contacts_ids || []
          } as any);
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
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ 
      ...prev,
      [name]: (name.endsWith('_id') || name === 'type_id') && typeof val === 'string' ? parseInt(val) : val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (customerId) {
        await updateCustomer(customerId, formData);
        setSuccess('Cliente atualizado com sucesso!');
      } else {
        await createCustomer(formData);
        setSuccess('Cliente criado com sucesso!');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving customer:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="p-4 bg-gray-900 text-white rounded-xl border border-gray-800">{error}</div>}
      {success && <div className="p-4 bg-primary/10 text-primary font-bold rounded-xl border border-primary/20">{success}</div>}

      {/* Seção 1: Identificação Básica */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-dark-border pb-2 text-gray-900 dark:text-white">Identificação Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome da Empresa" name="name" value={formData.name} onChange={handleChange} required />
          <Input label="Email de Contato" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Input label="Telefone" name="phone" value={formData.phone} onChange={handleChange} />
          <Input 
            label="Schema Name" 
            name="schema_name" 
            value={formData.schema_name} 
            onChange={handleChange} 
            required 
            disabled 
            className="bg-gray-50/50 dark:bg-gray-800/20 cursor-not-allowed border-dashed"
            helpText="Gerado automaticamente a partir do nome" 
          />
        </div>
      </section>

      {/* Seção 2: Dados Fiscais e Contratuais */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-dark-border pb-2 text-gray-900 dark:text-white">Dados Fiscais e Contratuais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="NIF" name="nif" value={formData.nif} onChange={handleChange} />
          <Input label="Nome Fiscal" name="fiscal_name" value={formData.fiscal_name} onChange={handleChange} />
          <Input label="Data de Início" name="date_init" type="date" value={formData.date_init} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tipo de Cliente</label>
            <select name="type_id" value={formData.type_id} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status do Cliente</label>
            <select name="status_customer_id" value={formData.status_customer_id} onChange={handleChange} className="w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none">
              {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <Combobox 
            label="Gestor Responsável"
            options={availableUsers.map(u => ({
              value: u.id.toString(),
              label: `${u.name} (${u.email})`
            }))}
            value={formData.manager_id.toString()}
            onChange={(val) => setFormData(prev => ({ ...prev, manager_id: parseInt(val as string) }))}
            placeholder="Selecione um gestor..."
          />
        </div>
      </section>

      {/* Seção 3: Presença Digital */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-dark-border pb-2 text-gray-900 dark:text-white">Presença Digital</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Website URL" name="url_website" value={formData.url_website} onChange={handleChange} />
          <Input label="E-commerce URL" name="url_ecommerce" value={formData.url_ecommerce} onChange={handleChange} />
        </div>
      </section>

      {/* Seção 4: Localização */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-dark-border pb-2 text-gray-900 dark:text-white">Localização</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Rua" name="street_name" value={formData.street_name} onChange={handleChange} />
          <Input label="Número" name="street_number" value={formData.street_number} onChange={handleChange} />
          <Input label="Cidade" name="city" value={formData.city} onChange={handleChange} />
          <Input label="País" name="country" value={formData.country} onChange={handleChange} />
          <Input label="Código Postal" name="zip" value={formData.zip} onChange={handleChange} />
        </div>
      </section>

      {/* Seção 5: Responsáveis */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold border-b border-gray-100 dark:border-dark-border pb-2 text-gray-900 dark:text-white">Responsáveis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-dark-border">
          <div className="md:col-span-3 font-bold text-sm text-primary uppercase tracking-wider">Proprietário (Owner)</div>
          <Input label="Nome" name="owner_name" value={formData.owner_name} onChange={handleChange} />
          <Input label="Email" name="owner_email" value={formData.owner_email} onChange={handleChange} />
          <Input label="Telefone" name="owner_phone" value={formData.owner_phone} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl border border-gray-100 dark:border-dark-border">
          <div className="md:col-span-3 font-bold text-sm text-primary uppercase tracking-wider">Contato Principal</div>
          <Input label="Nome" name="contact_name" value={formData.contact_name} onChange={handleChange} />
          <Input label="Email" name="contact_email" value={formData.contact_email} onChange={handleChange} />
          <Input label="Telefone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} />
        </div>
      </section>

      <div className="flex gap-4 pt-6">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : (customerId ? 'Atualizar Cliente' : 'Criar Cliente')}
        </Button>
        {onCancel && <Button type="button" onClick={onCancel} variant="secondary" className="flex-1">Cancelar</Button>}
      </div>
    </form>
  );
};
