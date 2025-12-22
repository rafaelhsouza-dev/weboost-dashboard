import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../store';
import { getUserById, createUser, updateUser } from '../services/userService';
import { useNavigate } from 'react-router-dom';

interface UserFormProps {
  userId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onSuccess, onCancel }) => {
  const { notify } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 4,
    status: true
  });

  const [loading, setLoading] = useState(false);

  // Load user data if editing
  useEffect(() => {
    if (userId) {
      const loadUser = async () => {
        try {
          setLoading(true);
          const user = await getUserById(userId);
          setFormData({
            name: user.name,
            email: user.email,
            password: '', // Don't load password
            role_id: user.role_id,
            status: user.status
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          notify('Falha ao carregar utilizador', 'error');
        } finally {
          setLoading(false);
        }
      };
      void loadUser();
    }
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ 
      ...prev,
      [name]: name === 'role_id' ? parseInt(value) : val
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean data for API
      const payload: any = { ...formData };
      
      // If editing and password is empty, remove it from payload
      if (userId && !payload.password) {
        delete payload.password;
      }

      if (userId) {
        await updateUser(userId, payload);
        notify('Utilizador atualizado com sucesso!', 'success');
      } else {
        await createUser(payload);
        notify('Utilizador criado com sucesso!', 'success');
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Error saving user:', err);
      const msg = err instanceof Error ? err.message : 'Erro ao salvar utilizador';
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Nome Completo" 
          name="name"
          placeholder="Ex: Maria João" 
          required 
          value={formData.name}
          onChange={handleChange}
        />
        <Input 
          label="Email Corporativo" 
          name="email"
          type="email" 
          placeholder="maria@empresa.com" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
        <Input 
          label={userId ? "Nova Senha (deixe em branco para manter)" : "Senha"} 
          name="password"
          type="password" 
          placeholder="******" 
          required={!userId} 
          value={formData.password}
          onChange={handleChange}
        />
        
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Perfil de Acesso</label>
          <select 
            name="role_id"
            className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            value={formData.role_id}
            onChange={handleChange}
          >
            <option value={1}>CEO</option>
            <option value={2}>Admin</option>
            <option value={3}>Manager</option>
            <option value={4}>Client</option>
            <option value={5}>Employee</option>
            <option value={6}>Performance</option>
            <option value={7}>Photo & Video</option>
            <option value={8}>Design</option>
            <option value={9}>Developer</option>
            <option value={10}>Marketing</option>
          </select>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input 
            type="checkbox" 
            id="status"
            name="status"
            className="w-4 h-4 accent-primary border-gray-300 dark:border-dark-border rounded focus:ring-primary bg-white dark:bg-dark-surface transition-all"
            checked={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked }))}
          />
          <label htmlFor="status" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Utilizador Ativo</label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-dark-border">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="border-gray-100 dark:border-dark-border">Cancelar</Button>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Processando...' : (userId ? 'Atualizar Utilizador' : 'Criar Utilizador')}
        </Button>
      </div>
    </form>
  );
};
