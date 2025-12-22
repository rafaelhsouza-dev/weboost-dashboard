import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { fetchCustomers as fetchCustomersApi } from '../services/customerService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Building2, Globe } from 'lucide-react';

export const AdminClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byCountry: {} as Record<string, number>,
    byCity: {} as Record<string, number>
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomersApi(0, 1000); // Fetch up to 1000 for stats
        setCustomers(data);
        
        // Calculate statistics
        const total = data.length;
        const active = data.filter(c => c.status).length;
        const inactive = total - active;
        
        const byCountry: Record<string, number> = {};
        const byCity: Record<string, number> = {};
        
        data.forEach(customer => {
          if (customer.country) {
            byCountry[customer.country] = (byCountry[customer.country] || 0) + 1;
          }
          if (customer.city) {
            byCity[customer.city] = (byCity[customer.city] || 0) + 1;
          }
        });
        
        setStats({ total, active, inactive, byCountry, byCity });
        
      } catch (err) {
        console.error('Failed to load customers:', err);
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(`Falha ao carregar dados dos clientes: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };
    
    void loadCustomers();
  }, []);

  // Prepare data for charts
  const countryData = Object.entries(stats.byCountry).map(([name, value]) => ({ name, value }));
  const cityData = Object.entries(stats.byCity).map(([name, value]) => ({ name, value }));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
          Dashboard dos Clientes
        </h1>
        <Button 
          onClick={() => navigate('/admin/customer-list')}
          variant="primary"
        >
          Ver Todos os Clientes
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total de Clientes</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-full">
                  <Users className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Clientes Inativos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Globe className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Países</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(stats.byCountry).length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Clientes por País
              </h3>
              {countryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                      itemStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhum dado de país disponível
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Clientes por Cidade
              </h3>
              {cityData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cityData.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151' }}
                      itemStyle={{ color: '#F9FAFB' }}
                    />
                    <Legend />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Nenhum dado de cidade disponível
                </p>
              )}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Clientes Recentes
              </h3>
              <Button 
                onClick={() => navigate('/admin/customer-create')}
                variant="primary"
                size="sm"
              >
                Adicionar Cliente
              </Button>
            </div>

            {customers.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Nenhum cliente encontrado
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cidade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {customers.slice(0, 5).map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {customer.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {customer.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {customer.city || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            customer.status ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {customer.status ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;
