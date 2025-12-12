import React, { useState } from 'react';
import { useApp } from '../store';
import { Button } from './Button';
import { Input } from './Input';
import { WeboostLogo } from './RetentixLogo';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Login attempt with:', email);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/'); // Navigate to the root URL on successful login
      } else {
        console.log('Login failed - credentials invalid');
        setError('Credenciais inválidas. Por favor, tente novamente.');
      }
    } catch (err) {
      console.error('Login error caught in component:', err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao fazer login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#111111] via-[#111111] to-[#00FF85] bg-[length:200%_200%] animate-gradient-shift">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-0"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] z-0 opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] z-0 opacity-50" />

      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-[#1a1a1a]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 z-10 mx-4">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/imgs/weboost-color.webp" alt="Weboost Logo" className="h-12 w-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Bem-vindo de volta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Acesse a sua conta para gerir o seu negócio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ex: nome@empresa.com"
            required
            className="bg-white dark:bg-black/20"
          />
          <div>
            <Input 
              label="Palavra-passe" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-white dark:bg-black/20"
            />
            <div className="flex justify-end mt-2">
              <a href="#" className="text-xs font-medium text-primary hover:text-blue-700 transition-colors">
                Esqueci a minha senha
              </a>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <Button type="submit" fullWidth disabled={loading} className="shadow-lg shadow-primary/25">
            {loading ? 'A entrar...' : 'Entrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; Weboost. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};