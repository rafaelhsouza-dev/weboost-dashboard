import React from 'react';
import { useApp } from '../store';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Printer, FileDown, Globe, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, toggleLanguage, user, toggleSidebar } = useApp();
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'Painel de Administração';
    if (path.startsWith('/client')) return 'Área do Cliente';
    if (path.startsWith('/user')) return 'Operação Interna';
    return 'Dashboard Weboost';
  };

  return (
    <header className="h-16 w-full bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-300 shadow-sm">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-tight uppercase">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        
        <div className="hidden sm:flex items-center gap-1">
           <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Exportar PDF">
             <FileDown size={18} />
           </button>
           <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Imprimir">
             <Printer size={18} />
           </button>
        </div>

        <div className="hidden sm:block h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2"></div>

        <button 
          onClick={toggleTheme} 
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="flex items-center gap-3 pl-3">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-gray-900 dark:text-white leading-none mb-1 uppercase tracking-wider">{user?.name}</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{user?.roleDisplayName || user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 p-0.5 overflow-hidden">
            <img 
              src={user?.avatar || "https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg"} 
              alt="User" 
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};
