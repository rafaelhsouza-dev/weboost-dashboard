import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../store';
import { createLead, updateLead } from '../services/leadService';
import { X } from 'lucide-react';

interface LeadFormProps {
  lead?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onClose, onSuccess }) => {
  const { currentTenant, notify } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    status: lead?.status || 'novo',
    phone: lead?.phone || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTenant) return;

    // Extrair ID numérico do tenant (ex: 'c12' -> 12)
    const customerId = parseInt(currentTenant.id.replace('c', ''));
    if (isNaN(customerId)) {
      notify('ID de cliente inválido para esta operação.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (lead?.id) {
        await updateLead(customerId, lead.id, formData);
        notify('Lead atualizado com sucesso!', 'success');
      } else {
        await createLead(customerId, formData);
        notify('Lead criado com sucesso!', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar lead';
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-dark-border flex justify-between items-center bg-gray-50/50 dark:bg-black/20">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-border rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input 
            label="Nome do Lead" 
            placeholder="Ex: João Silva" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="joao@exemplo.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <Input 
            label="Telefone" 
            placeholder="+351 900 000 000" 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
            <select 
              className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="novo">Novo</option>
              <option value="em_contacto">Em Contacto</option>
              <option value="qualificado">Qualificado</option>
              <option value="perdido">Perdido</option>
              <option value="convertido">Convertido</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-100 dark:border-dark-border">Cancelar</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : (lead ? 'Atualizar' : 'Criar Lead')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
