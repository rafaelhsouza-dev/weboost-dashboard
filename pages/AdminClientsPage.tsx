import React, { useState } from 'react';
import { DataTable } from '../components/DataTable';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, Building2, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';

interface Contact {
  name: string;
  role: string;
  phone: string;
  email: string;
}

export const AdminClientsPage: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clients, setClients] = useState([
    { id: 1, name: 'Cliente A', nif: '505123456', plan: 'Enterprise', users: 12, status: 'Ativo' },
    { id: 2, name: 'Cliente B', nif: '501987654', plan: 'Business', users: 5, status: 'Ativo' },
    { id: 3, name: 'Cliente C', nif: '509111222', plan: 'Starter', users: 2, status: 'Pendente' },
    { id: 4, name: 'Cliente D', nif: '507777888', plan: 'Business', users: 3, status: 'Ativo' },
  ]);

  // Dynamic contacts state
  const [additionalContacts, setAdditionalContacts] = useState<Contact[]>([]);

  const addContact = () => {
    setAdditionalContacts([...additionalContacts, { name: '', role: '', phone: '', email: '' }]);
  };

  const removeContact = (index: number) => {
    const newContacts = [...additionalContacts];
    newContacts.splice(index, 1);
    setAdditionalContacts(newContacts);
  };

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const newContacts = [...additionalContacts];
    newContacts[index][field] = value;
    setAdditionalContacts(newContacts);
  };

  const columns = [
    { header: 'Nome da Empresa', accessor: 'name', className: 'font-medium' },
    { header: 'NIF', accessor: 'nif' },
    { header: 'Plano', accessor: 'plan' },
    { header: 'Utilizadores', accessor: 'users' },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold
          ${row.status === 'Ativo' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }
        `}>
          {row.status}
        </span>
      )
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Cliente criado com sucesso! (Simulação)');
    setIsFormOpen(false);
    setAdditionalContacts([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Clientes</h1>
           <p className="text-gray-500 dark:text-gray-400 text-sm">Gerencie os clientes da plataforma Weboost.</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus size={18} className="mr-2" />
          Novo Cliente
        </Button>
      </div>

      {isFormOpen && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
             <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
               <Building2 size={24}/>
               Cadastro de Cliente (Tenant)
             </h3>
             <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
               <X size={24}/>
             </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
             
             {/* 1. Informações Gerais */}
             <div className="space-y-4">
               <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Informações Gerais</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Estado do Cliente</label>
                    <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                      <option>-- Selecionar --</option>
                      <option>Ativo</option>
                      <option>Inativo</option>
                      <option>Pendente</option>
                      <option>Suspenso</option>
                    </select>
                  </div>
                  <Input label="Data de Entrada" type="date" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Gestor Principal</label>
                    <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                      <option>-- Selecionar Gestor --</option>
                      <option>Admin Weboost</option>
                      <option>Ana Silva</option>
                      <option>Pedro Santos</option>
                    </select>
                  </div>
               </div>
             </div>

             {/* 2. Dados da Empresa */}
             <div className="space-y-4">
               <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-t border-gray-100 dark:border-gray-800 pt-4">Dados da Empresa</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3"><Input label="Nome da Marca / Empresa" placeholder="Ex: Weboost Solutions" required /></div>
                  <Input label="Nome Fiscal" placeholder="Ex: Weboost Lda" />
                  <Input label="NIF" placeholder="Ex: 500123456" />
                  <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Setor de Atividade</label>
                   <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                     <option>-- Selecionar --</option>
                     <option>Tecnologia</option>
                     <option>Moda</option>
                     <option>Alimentos</option>
                     <option>Outros</option>
                   </select>
                  </div>
                  <Input label="URL Website" placeholder="https://" />
                  <Input label="URL Ecommerce" placeholder="https://" />
                  <div className="md:col-span-3">
                     <Input label="Morada Completa" placeholder="Rua Exemplo, 123, Lisboa" />
                  </div>
               </div>
             </div>

             {/* 3. Dono e Contacto Principal */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-t border-gray-100 dark:border-gray-800 pt-4">Responsáveis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                   <div className="md:col-span-3 font-semibold text-primary">Dono / Sócio Principal</div>
                   <Input label="Nome" placeholder="Nome do Sócio" />
                   <Input label="Email" type="email" placeholder="socio@empresa.com" />
                   <Input label="Telemóvel" placeholder="+351 91..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-lg">
                   <div className="md:col-span-3 font-semibold text-primary">Pessoa de Contacto Principal</div>
                   <Input label="Nome" placeholder="Nome do Contacto" />
                   <Input label="Email" type="email" placeholder="contacto@empresa.com" />
                   <Input label="Telemóvel" placeholder="+351 91..." />
                </div>
             </div>

             {/* 4. Contactos Adicionais */}
             <div className="space-y-4">
                <div className="flex justify-between items-center border-t border-gray-100 dark:border-gray-800 pt-4">
                   <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider">Outros Contactos de Gestão</h4>
                   <Button type="button" size="sm" variant="secondary" onClick={addContact}>+ Adicionar Contacto</Button>
                </div>
                
                {additionalContacts.map((contact, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Input 
                      label={index === 0 ? "Nome" : ""} 
                      placeholder="Nome" 
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                    />
                    <Input 
                      label={index === 0 ? "Cargo" : ""} 
                      placeholder="Cargo"
                      value={contact.role}
                      onChange={(e) => handleContactChange(index, 'role', e.target.value)}
                    />
                    <Input 
                      label={index === 0 ? "Email" : ""} 
                      placeholder="Email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                    />
                    <Input 
                      label={index === 0 ? "Telemóvel" : ""} 
                      placeholder="Telemóvel"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                    />
                    <button 
                      type="button" 
                      onClick={() => removeContact(index)}
                      className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mb-[1px]"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {additionalContacts.length === 0 && <p className="text-sm text-gray-400 italic">Nenhum contacto adicional.</p>}
             </div>

             {/* 5. Origem e Observações */}
             <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase text-gray-400 tracking-wider border-t border-gray-100 dark:border-gray-800 pt-4">Origem e Notas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Origem do Cliente</label>
                    <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                      <option>-- Selecionar --</option>
                      <option>Prospeção Ativa</option>
                      <option>Inbound Marketing</option>
                      <option>Indicação</option>
                      <option>Evento</option>
                    </select>
                   </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Origem do Lead</label>
                    <select className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none">
                      <option>-- Selecionar --</option>
                      <option>Website</option>
                      <option>Linkedin</option>
                      <option>Email Frio</option>
                      <option>Telefone</option>
                    </select>
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Observações Internas</label>
                   <textarea className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-h-[100px]" placeholder="Notas importantes sobre o cliente..."></textarea>
                </div>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
               <Button type="submit">Registar Cliente</Button>
             </div>
          </form>
        </div>
      )}
      
      <DataTable 
        data={clients}
        columns={columns}
        title="Lista de Clientes"
      />
    </div>
  );
};