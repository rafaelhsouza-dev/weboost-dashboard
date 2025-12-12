import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { getCampaigns } from '../services/mockService';
import { Button } from '../components/Button';
import { Plus, Mail, MessageSquare, MousePointer, Search } from 'lucide-react';
import { Card } from '../components/Card';
import { DateRangePicker } from '../components/DateRangePicker';

export const MarketingPage: React.FC = () => {
  const data = getCampaigns();

  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    { header: 'Campanha', accessor: 'name', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { 
      header: 'Canal', 
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
           {row.channel === 'Email' && <Mail size={14} />}
           {row.channel === 'SMS' && <MessageSquare size={14} />}
           {row.channel === 'Ads' && <MousePointer size={14} />}
           {row.channel}
        </div>
      ),
      className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
    },
    { header: 'Status', accessor: 'status', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Audiência', accessor: 'audience', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
    { header: 'Conversão', accessor: 'conversion', className: 'text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider' },
  ];

  const filteredCampaigns = data.filter(campaign =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Marketing Automation</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar campanhas..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none w-full md:w-64 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // Busca ao pressionar Enter
                }
              }}
            />
          </div>
          <DateRangePicker />
          <Button variant="secondary" className="text-sm font-medium">
            <Plus size={14} className="mr-2" />
            Nova Campanha
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-primary/80 to-primary text-white border-none">
          <div className="p-2">
            <h3 className="text-lg font-semibold opacity-90">Emails Enviados</h3>
            <p className="text-3xl font-bold mt-2">124,592</p>
            <p className="text-sm opacity-80 mt-1">+12% vs mês anterior</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/80 to-secondary text-white border-none">
          <div className="p-2">
            <h3 className="text-lg font-semibold opacity-90">Conversão Média</h3>
            <p className="text-3xl font-bold mt-2">4.2%</p>
            <p className="text-sm opacity-80 mt-1">Acima da média do setor</p>
          </div>
        </Card>
        <Card className="dark:bg-gray-800">
           <div className="p-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Orçamento Restante</h3>
            <p className="text-3xl font-bold text-primary mt-2">€4,500</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-primary w-[70%]"></div>
            </div>
           </div>
        </Card>
      </div>
      
      <DataTable 
        data={data}
        columns={columns}
        title="Campanhas Recentes"
      />
    </div>
  );
};