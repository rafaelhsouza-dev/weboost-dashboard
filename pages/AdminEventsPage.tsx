import React, { useState } from 'react';
import { DataTable, Column } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Combobox } from '../components/Combobox';
import { Plus, X, CalendarDays } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, name: 'Web Summit 2024', date: '2024-11-12', location: 'Lisboa', type: 'Feira', leads: 150 },
    { id: 2, name: 'Workshop CRM', date: '2024-05-20', location: 'Online', type: 'Webinar', leads: 45 },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    location: '',
    status: ''
  });

  const columns: Column<any>[] = [
    { header: 'Evento', accessor: 'name' },
    { header: 'Data', accessor: 'date' },
    { header: 'Local', accessor: 'location' },
    { header: 'Tipo', accessor: 'type' },
    { header: 'Leads Gerados', accessor: 'leads' },
  ];

  const eventTypes = [
    { value: 'Feira', label: 'Feira / Exposição' },
    { value: 'Conference', label: 'Conferência' },
    { value: 'Webinar', label: 'Webinar Online' },
    { value: 'Networking', label: 'Evento de Networking' },
    { value: 'Workshop', label: 'Workshop / Treinamento' },
  ];

  const statusOptions = [
    { value: 'Planeado', label: 'Planeado' },
    { value: 'Confirmado', label: 'Confirmado' },
    { value: 'Concluído', label: 'Concluído' },
    { value: 'Cancelado', label: 'Cancelado' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Evento criado com sucesso!');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <CalendarDays className="text-primary"/> Feiras e Eventos
           </h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Registo de presença em eventos e captação de leads.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} className="mr-2" />
          Novo Evento
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-8">
           <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
             <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
               <CalendarDays size={24}/>
               Novo Evento / Feira
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
               <X size={24}/>
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <Input 
                      label="Nome do Evento" 
                      placeholder="Ex: Web Summit 2024" 
                      required 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                   />
                </div>
                
                <Combobox 
                  label="Tipo de Evento"
                  options={eventTypes}
                  value={formData.type}
                  onChange={(val) => setFormData({...formData, type: val as string})}
                />

                <Combobox 
                  label="Estado"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(val) => setFormData({...formData, status: val as string})}
                />

                <Input 
                  label="Data de Início" 
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
                
                <Input 
                  label="Data de Fim" 
                  type="date"
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                />

                <Input 
                  label="Localização" 
                  placeholder="Ex: FIL, Lisboa ou Online" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
                
                <Input 
                  label="Custo Estimado (€)" 
                  type="number"
                  placeholder="0.00" 
                />
             </div>
             
             <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Objetivos e Metas</label>
                <textarea className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[80px]" placeholder="Quantos leads esperamos? Qual o objetivo principal?"></textarea>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Agendar Evento</Button>
             </div>
          </form>
        </div>
      )}

      <DataTable data={events} columns={columns} title="Calendário de Eventos" />
    </div>
  );
};