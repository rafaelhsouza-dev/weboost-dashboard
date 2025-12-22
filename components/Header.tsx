import React from 'react';
import { useApp } from '../store';
import { useLocation } from 'react-router-dom';
import { Moon, Sun, Printer, FileDown, Globe, Menu } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const element = document.querySelector('main');
    if (!element) return;

    const pageTitle = getTitle().replace(/\s+/g, '_');
    const filename = `Weboost_${pageTitle}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;

    const opt = {
      margin: [10, 5, 10, 5],
      filename: filename,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 3, 
        useCORS: true, 
        logging: false,
        letterRendering: true,
        backgroundColor: '#ffffff',
        windowWidth: 1200 // Garante layout de desktop na captura
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Temporarily apply a class to force light mode styles during capture if needed
    // but html2pdf usually captures the current state. 
    // Since we want LIGHT mode always for PDF:
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) document.documentElement.classList.remove('dark');

    html2pdf().set(opt).from(element).save().then(() => {
      if (isDark) document.documentElement.classList.add('dark');
    });
  };

  return (
    <header className="h-20 w-full bg-gray-100 dark:bg-dark-surface border-b border-gray-100 dark:border-dark-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-300 shadow-sm">
      
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
           <button 
             onClick={handleDownloadPDF}
             className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
             title="Exportar PDF"
           >
             <FileDown size={18} />
           </button>
           <button 
             onClick={handlePrint}
             className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" 
             title="Imprimir"
           >
             <Printer size={18} />
           </button>
        </div>

        <div className="hidden sm:block h-4 w-px bg-gray-100 dark:bg-dark-border mx-2"></div>

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