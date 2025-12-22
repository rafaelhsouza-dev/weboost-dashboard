import React from 'react';
import { Lead } from '../types';
import { Globe, Facebook, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const headers = [
    'ID', 'Nome', 'Email', 'Status', 'Data de Criação'
  ];

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100 dark:divide-dark-border">
        <thead className="bg-gray-50/50 dark:bg-dark-DEFAULT/50">
          <tr>
            {headers.map(header => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-surface divide-y divide-gray-50 dark:divide-dark-border">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-primary/[0.02] transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">#{lead.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  lead.status === 'novo' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400'
                }`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                {new Date(lead.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {leads.length === 0 && (
         <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Nenhum lead encontrado ainda. Inicie a pesquisa acima.
         </div>
      )}
    </div>
  );
};

export default LeadsTable;
