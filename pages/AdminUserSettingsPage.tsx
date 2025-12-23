import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Plus, Building2, Trash2, Edit2, X, Check } from 'lucide-react';
import { listDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/departmentService';
import { Department } from '../types';
import { LayoutPage } from '../components/LayoutPage';
import { useApp } from '../store';

export const AdminUserSettingsPage: React.FC = () => {
  const { notify } = useApp();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for creating new department
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  
  // State for editing
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const deps = await listDepartments();
      setDepartments(deps);
    } catch (error) {
      console.error('Failed to load settings:', error);
      notify('Falha ao carregar departamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDepartment(newDepartment);
      setNewDepartment({ name: '', description: '' });
      notify('Departamento criado com sucesso!', 'success');
      loadData();
    } catch (error) {
      notify('Erro ao criar departamento', 'error');
    }
  };

  const startEditing = (dept: Department) => {
    setEditingId(dept.id);
    setEditForm({ name: dept.name, description: dept.description || '' });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ name: '', description: '' });
  };

  const handleUpdateDepartment = async (id: number) => {
    try {
      await updateDepartment(id, editForm);
      setEditingId(null);
      notify('Departamento atualizado!', 'success');
      loadData();
    } catch (error) {
      notify('Erro ao atualizar departamento', 'error');
    }
  };

  const handleDeleteDepartment = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este departamento?')) {
      try {
        await deleteDepartment(id);
        notify('Departamento excluído!', 'success');
        loadData();
      } catch (error) {
        notify('Erro ao excluir departamento', 'error');
      }
    }
  };

  return (
    <LayoutPage 
      title="Configurações de Utilizadores" 
      subtitle="Gerencie departamentos e outras configurações globais de utilizadores."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Departments Section */}
        <div className="space-y-6">
          <Card className="p-6 border-primary/10">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
              <Building2 size={20} className="text-primary" />
              Departamentos
            </h2>
            
            {/* Create Form */}
            <form onSubmit={handleAddDepartment} className="space-y-4 mb-8 bg-gray-50/50 dark:bg-gray-800/20 p-6 rounded-xl border border-gray-100 dark:border-dark-border">
              <Input 
                label="Nome do Departamento" 
                value={newDepartment.name} 
                onChange={e => setNewDepartment({...newDepartment, name: e.target.value})}
                placeholder="Ex: Marketing, Desenvolvimento..."
                required
              />
              <Input 
                label="Descrição" 
                value={newDepartment.description} 
                onChange={e => setNewDepartment({...newDepartment, description: e.target.value})}
                placeholder="Descrição opcional"
              />
              <Button type="submit" className="w-full">
                <Plus size={16} className="mr-2" /> Adicionar Departamento
              </Button>
            </form>

            {/* List */}
            <div className="space-y-3">
              {departments.length === 0 && !loading && (
                <p className="text-center text-gray-400 py-4 text-sm">Nenhum departamento cadastrado.</p>
              )}
              
              {departments.map(dept => (
                <div key={dept.id} className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface transition-colors">
                  {editingId === dept.id ? (
                    <div className="space-y-3">
                      <Input 
                        value={editForm.name}
                        onChange={e => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Nome"
                        autoFocus
                      />
                      <Input 
                        value={editForm.description}
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                        placeholder="Descrição"
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={cancelEditing}>
                          <X size={14} className="mr-1" /> Cancelar
                        </Button>
                        <Button size="sm" onClick={() => handleUpdateDepartment(dept.id)}>
                          <Check size={14} className="mr-1" /> Salvar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{dept.name}</p>
                        {dept.description && <p className="text-xs text-gray-500 mt-0.5">{dept.description}</p>}
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => startEditing(dept)}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDepartment(dept.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </LayoutPage>
  );
};

export default AdminUserSettingsPage;
