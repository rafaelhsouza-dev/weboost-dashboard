import React from 'react';
import { useApp } from '../store';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Printer, FileDown, Globe, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, toggleTheme, language, toggleLanguage, user, toggleSidebar } = useApp();
  const location = useLocation();

  const getTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Geral';
    if (path === '/crm') return 'Gestão de Relacionamento (CRM)';
    if (path === '/cdp') return 'Plataforma de Dados (CDP)';
    if (path === '/marketing') return 'Campanhas & Marketing';
    if (path === '/reports') return 'Relatórios & Exportação';
    if (path === '/users') return 'Gestão de Utilizadores';
    if (path === '/tenants') return 'Gestão de Clientes';
    if (path === '/services') return 'Catálogo de Serviços';
    return 'Dashboard';
  };

  return (
    <header className="h-16 w-full bg-[#eee] dark:bg-[#151515] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-colors duration-300">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar} 
          className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Menu size={24} />
        </button>

        <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white tracking-tight truncate max-w-[200px] md:max-w-none">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        
        <div className="hidden sm:flex items-center gap-2">
           <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Exportar PDF">
             <FileDown size={20} />
           </button>
           <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors" title="Imprimir">
             <Printer size={20} />
           </button>
        </div>

        <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

        <button onClick={toggleLanguage} className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Globe size={18} className="text-gray-600 dark:text-gray-400" />
          <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">{language === 'pt' ? 'PT' : 'EN'}</span>
        </button>

        <button 
          onClick={toggleTheme} 
          className="p-2 text-gray-500 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {theme === 'light' ? <Moon size={20} className="text-gray-600" /> : <Sun size={20} />}
        </button>

        <div className="pl-1 md:pl-2 flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.role}</p>
          </div>
          <img 
            src={user?.avatar || "https://picsum.photos/100"} 
            alt="User" 
            className="w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover" 
          />
        </div>
      </div>
    </header>
  );
};