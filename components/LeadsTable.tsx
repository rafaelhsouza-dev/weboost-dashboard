import React from 'react';
import { Lead } from '../types';
import { Globe, Facebook, Linkedin, Instagram, Youtube, Twitter } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
  const headers = [
    'Nome da Empresa', 'Categoria', 'Telefone', 'Email', 'Website', 'Morada',
    'Avaliação', 'Avaliações', 'Nº Empregados', 'Ano Fundação', 'Pontuação', 'Justificação', 'Descrição', 
    'LinkedIn', 'Facebook', 'Instagram', 'YouTube', 'Twitter', 'TikTok'
  ];

  const renderLink = (url: string | null, text: string) => {
    if (!url) return <span className="text-gray-400 dark:text-gray-600">N/D</span>;
    return <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">{text}</a>;
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-black/40">
          <tr>
            {headers.map(header => (
              <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{lead.companyName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.category}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.phone || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.email || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.website, 'Visitar')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]" title={lead.address || ''}>{lead.address || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.rating !== null ? `${lead.rating} / 5` : 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.reviewCount !== null ? lead.reviewCount : 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.employeeCount || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{lead.foundingYear || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                <span className={lead.qualityScore > 75 ? 'text-green-600 dark:text-green-400' : lead.qualityScore > 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-orange-600 dark:text-orange-400'}>
                  {lead.qualityScore}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={lead.qualityReasoning}>{lead.qualityReasoning}</td>
              <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate" title={lead.description || ''}>{lead.description || 'N/D'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.linkedIn, 'Perfil')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.facebook, 'Página')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.instagram, 'Perfil')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.youtube, 'Canal')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.twitter, 'Perfil')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{renderLink(lead.tiktok, 'Perfil')}</td>
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
