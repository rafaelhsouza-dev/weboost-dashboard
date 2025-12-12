import React from 'react';
import { DataTable } from '../components/DataTable';
import { getClients } from '../services/mockService';
import { Button } from '../components/Button';
import { Plus } from 'lucide-react';

export const CrmPage: React.FC = () => {
  const data = getClients();

  const columns = [
    { header: 'Empresa', accessor: 'name', className: 'font-medium' },
    { header: 'Contacto', accessor: 'contact' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${row.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
            row.status === 'Inativo' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }
        `}>
          {row.status}
        </span>
      )
    },
    { header: 'Valor de Pipeline', accessor: 'value' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Lista de Clientes (CRM)</h1>
        <Button className="text-sm font-medium">
          <Plus size={14} className="mr-2" />
          Novo Cliente
        </Button>
      </div>
      
      <DataTable 
        data={data}
        columns={columns}
        title="Todos os Clientes"
      />
    </div>
  );
};
