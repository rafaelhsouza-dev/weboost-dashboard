import React, { useState } from 'react';
import { useApp } from '../store';
import { Button } from './Button';
import { Input } from './Input';
import { RetentixLogo } from './RetentixLogo';

export const Login: React.FC = () => {
  const { login } = useApp();
  // Pre-filled credentials for ease of use
  const [email, setEmail] = useState('admin@retentix.io');
  const [password, setPassword] = useState('retentix#2025');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1f3ab9] via-[#111111] to-[#992091] bg-[length:200%_200%] animate-gradient-shift">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-0"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] z-0 opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] z-0 opacity-50" />

      <div className="w-full max-w-md p-8 bg-white/90 dark:bg-[#1a1a1a]/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700 z-10 mx-4">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="imgs/retentix-color.webp" alt="Retentix Logo" className="h-12 w-auto mb-4" />
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

          <Button type="submit" fullWidth disabled={loading} className="shadow-lg shadow-primary/25">
            {loading ? 'A entrar...' : 'Entrar na Plataforma'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; 2024 Retentix. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
};