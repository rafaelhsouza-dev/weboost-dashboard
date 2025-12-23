import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { useApp } from '../store';
import { getUserById, createUser, updateUser } from '../services/userService';
import { listDepartments } from '../services/departmentService';
import { Department } from '../types';
import { Upload, User as UserIcon, X, AlertCircle } from 'lucide-react';

interface UserFormProps {
  userId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, onSuccess, onCancel }) => {
  const { notify } = useApp();
  
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: 5, // Default to Employee (5)
    status: true,
    department_id: '',
    phone: '',
    bio: '',
    avatar_url: ''
  });

  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Load departments
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const deps = await listDepartments();
        setDepartments(deps);
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    };
    loadDepartments();
  }, []);

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
            password: '', 
            role_id: user.role_id,
            status: user.status,
            department_id: user.department_id?.toString() || '',
            phone: user.phone || '',
            bio: user.bio || '',
            avatar_url: user.avatar_url || ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle checkbox separately
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ 
      ...prev,
      [name]: name === 'role_id' ? parseInt(value) : val
    }));
  };

  const processFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      notify('Por favor, selecione apenas arquivos de imagem.', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notify('A imagem é muito grande. O tamanho máximo permitido é 5MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Set base64 string as avatar_url
      setFormData(prev => ({ ...prev, avatar_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean data for API
      const payload: any = { 
        ...formData,
        // Convert department_id to number if present
        department_id: formData.department_id ? parseInt(formData.department_id) : undefined
      };
      
      // Remove empty fields
      if (!payload.password) delete payload.password;
      if (!payload.department_id) delete payload.department_id;
      if (!payload.phone) delete payload.phone;
      if (!payload.bio) delete payload.bio;
      if (!payload.avatar_url) delete payload.avatar_url;

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
    <form onSubmit={handleSubmit} className="space-y-6" onDragEnter={handleDrag}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            className={`flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 ${
              dragActive 
                ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                : 'border-dashed border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-surface/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="relative w-32 h-32 mb-4 group cursor-pointer">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-dark-surface shadow-md bg-white dark:bg-dark-surface">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              
              <label 
                htmlFor="avatar-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
              >
                <Upload size={24} />
              </label>
              
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange} 
              />
            </div>

            <div className="text-center space-y-1 mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Foto de Perfil</p>
              <p className="text-xs text-gray-500">Arraste ou clique para upload</p>
            </div>

            {formData.avatar_url && (
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setFormData(prev => ({...prev, avatar_url: ''}))}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30 w-full"
              >
                <X size={14} className="mr-1.5" /> Remover foto
              </Button>
            )}
            
            {!formData.avatar_url && (
               <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block text-center">Ou use uma URL</label>
                 <input 
                   type="text" 
                   name="avatar_url"
                   value={formData.avatar_url}
                   onChange={handleChange}
                   placeholder="https://..."
                   className="w-full text-xs p-2 rounded border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface focus:ring-1 focus:ring-primary outline-none text-center"
                 />
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
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
              label={userId ? "Nova Senha (opcional)" : "Senha"} 
              name="password"
              type="password" 
              placeholder="******" 
              required={!userId} 
              value={formData.password}
              onChange={handleChange}
            />
            
             <Input 
              label="Telefone" 
              name="phone"
              placeholder="+351 912 345 678" 
              value={formData.phone}
              onChange={handleChange}
            />
            
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Departamento</label>
              <select 
                name="department_id"
                className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={formData.department_id}
                onChange={handleChange}
              >
                <option value="">Selecione um departamento...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

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
          </div>
          
           <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Biografia / Notas</label>
              <textarea 
                name="bio"
                rows={3}
                className="block w-full rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface px-3 py-2.5 text-sm dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Breve descrição sobre o utilizador..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

          <div className="flex items-center gap-3 py-2 bg-gray-50 dark:bg-dark-surface/50 p-4 rounded-lg border border-gray-100 dark:border-dark-border">
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
