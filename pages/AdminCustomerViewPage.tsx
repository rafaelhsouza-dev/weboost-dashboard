import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { fetchCustomerById } from '../services/customerService';
import { Building2, User, MapPin, Phone, Globe, Mail, Calendar, Link as LinkIcon } from 'lucide-react';

export const AdminCustomerViewPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        if (!customerId) {
          setError('ID do cliente não fornecido');
          return;
        }
        
        const data = await fetchCustomerById(parseInt(customerId));
        setCustomer(data);
      } catch (error) {
        console.error('Failed to load customer:', error);
        setError('Falha ao carregar cliente');
      } finally {
        setLoading(false);
      }
    };
    
    void loadCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="secondary"
          className="mt-4"
        >
          Voltar para Lista
        </Button>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-700 dark:text-yellow-300">
          Cliente não encontrado
        </div>
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="secondary"
          className="mt-4"
        >
          Voltar para Lista
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
          Detalhes do Cliente
        </h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate(`/admin/clients/${customerId}/edit`)}
            variant="primary"
            size="sm"
          >
            Editar Cliente
          </Button>
          <Button 
            onClick={() => navigate('/admin/customer-list')}
            variant="secondary"
            size="sm"
          >
            Voltar para Lista
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-full">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">ID: #{customer.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Data de Início</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.date_init}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nome Fiscal</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.fiscal_name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <LinkIcon className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.url_website || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${
                  customer.status ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                }`}>
                  {customer.status ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rua</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.street_name || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Número</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.street_number || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cidade</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.city || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">País</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.country || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CEP</p>
                  <p className="font-medium text-gray-900 dark:text-white">{customer.zip || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Schema</h3>
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="bg-gray-200 dark:bg-gray-600 p-2 rounded">
                <span className="text-xs font-mono">customer_{customer.schema_name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contatos</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Proprietário</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.owner_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.owner_email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.owner_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contato Principal</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.contact_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.contact_email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{customer.contact_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerViewPage;
