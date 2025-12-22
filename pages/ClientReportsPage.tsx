import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../store';
import { getLeadsForCustomer, deleteLead } from '../services/leadService';
import { LayoutPage } from '../components/LayoutPage';
import { Button } from '../components/Button';
import { Plus, Search, Pencil, Trash2, UserCheck, Mail, Phone, Calendar } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';

export const ClientReportsPage: React.FC = () => {
  const { currentTenant, notify } = useApp();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const loadLeads = useCallback(async () => {
    if (!currentTenant) return;
    
    // Extrair ID numérico do tenant
    const customerId = parseInt(currentTenant.id.replace('c', ''));
    if (isNaN(customerId)) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getLeadsForCustomer(customerId);
      setLeads(data);
    } catch (err) {
      console.error('Failed to load leads:', err);
      notify('Falha ao carregar lista de leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentTenant, notify]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  const handleDelete = async (leadId: number) => {
    if (!currentTenant) return;
    const customerId = parseInt(currentTenant.id.replace('c', ''));
    
    if (window.confirm('Deseja realmente excluir este lead?')) {
      try {
        await deleteLead(customerId, leadId);
        notify('Lead excluído com sucesso!', 'success');
        void loadLeads();
      } catch (err) {
        notify('Erro ao excluir lead', 'error');
      }
    }
  };

  const handleEdit = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'novo': return 'bg-primary/10 text-primary';
      case 'qualificado': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'convertido': return 'bg-gray-900 text-white dark:bg-primary dark:text-black';
      case 'perdido': return 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400';
      default: return 'bg-primary/5 text-primary';
    }
  };

  return (
    <LayoutPage 
      title="Gestão de Leads" 
      subtitle={`Visualize e gerencie os potenciais clientes de ${currentTenant?.name}.`}
      actions={
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar leads..."
              className="pl-10 pr-4 py-2 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-surface focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none w-full md:w-64 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate}>
            <Plus size={16} className="mr-2" /> Novo Lead
          </Button>
        </div>
      }
    >
      <div className="overflow-hidden bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 dark:bg-black border-b border-gray-100 dark:border-dark-border">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lead</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-4 text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-dark-border">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center animate-pulse text-gray-400">Carregando leads...</td></tr>
            ) : filteredLeads.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Nenhum lead encontrado para este período.</td></tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-primary/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{lead.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {lead.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail size={12} className="text-primary" /> {lead.email}
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone size={12} className="text-primary" /> {lead.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} /> {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(lead)} title="Editar">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(lead.id)} className="text-gray-400 hover:text-primary">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <LeadForm 
          lead={selectedLead} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={loadLeads} 
        />
      )}
    </LayoutPage>
  );
};

export default ClientReportsPage;