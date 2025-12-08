import React from 'react';
import { useApp } from '../store';
import { TenancyType } from '../types';
import retentixIcon from '../imgs/retentix-icon.webp';
import retentixColor from '../imgs/retentix-color.webp';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  PieChart, 
  Megaphone, 
  Database,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  FileText,
  Building2,
  Layers,
  FileSignature,
  Handshake,
  CalendarDays,
  UserPlus2,
  Bot,
  ScanSearch
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Combobox } from './Combobox';

export const Sidebar: React.FC = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    currentTenant, 
    availableTenants, 
    setTenant,
    logout,
    setSidebarCollapsed
  } = useApp();
  
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'home', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ];

    if (!currentTenant) return baseItems;

    switch (currentTenant.type) {
      case TenancyType.ADMIN:
        return [
          ...baseItems,
          { id: 'tenants', label: 'Clientes (Empresas)', icon: Building2, path: '/tenants' },
          { id: 'contracts', label: 'Contratos', icon: FileSignature, path: '/contracts' },
          { id: 'services', label: 'Catálogo de Serviços', icon: Layers, path: '/services' },
          { id: 'users', label: 'Utilizadores do Sistema', icon: Users, path: '/users' },
          { id: 'partners', label: 'Parceiros', icon: Handshake, path: '/partners' },
          { id: 'events', label: 'Feiras e Eventos', icon: CalendarDays, path: '/events' },
          { id: 'referrals', label: 'Indicações', icon: UserPlus2, path: '/referrals' },
          { id: 'scraper', label: 'AI Scraper', icon: Bot, path: '/scraper' },
          { id: 'seo', label: 'Analisar SEO/GEO', icon: ScanSearch, path: '/seo-analysis' },
          { id: 'reports', label: 'Relatórios Globais', icon: FileText, path: '/reports' },
        ];
      case TenancyType.CLIENT:
        return [
          ...baseItems,
          { id: 'campaigns', label: 'Minhas Campanhas', icon: Megaphone, path: '/campaigns' },
          { id: 'reports', label: 'Relatórios', icon: FileText, path: '/reports' },
        ];
      case TenancyType.INTERNAL:
      default:
        return [
          ...baseItems,
          { id: 'crm', label: 'CRM', icon: Briefcase, path: '/crm' },
          { id: 'cdp', label: 'CDP (Clientes)', icon: Database, path: '/cdp' },
          { id: 'scraper', label: 'AI Scraper', icon: Bot, path: '/scraper' },
          { id: 'seo', label: 'Analisar SEO/GEO', icon: ScanSearch, path: '/seo-analysis' },
          { id: 'marketing', label: 'Marketing', icon: Megaphone, path: '/marketing' },
          { id: 'analytics', label: 'Analytics', icon: PieChart, path: '/analytics' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-white dark:bg-[#151515] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-72'}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 relative bg-white dark:bg-[#151515]">
          <div className="flex items-center gap-3">
            {sidebarCollapsed ? (
               <img src={retentixIcon} alt="Retentix" className="w-8 h-8 object-contain md:block hidden" />
            ) : (
               <img src={retentixColor} alt="Retentix" className="h-8 w-auto object-contain" />
            )}
            <img src={retentixColor} alt="Retentix" className="h-8 w-auto object-contain md:hidden block" />
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-sm hover:text-primary transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
           {sidebarCollapsed ? (
              <div className="w-full flex justify-center">
                 <div className="w-10 h-10 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-primary shrink-0">
                    {currentTenant?.type === TenancyType.INTERNAL ? <Briefcase size={20}/> : <Building2 size={20}/>}
                 </div>
              </div>
           ) : (
             <Combobox 
                options={availableTenants.map(t => ({ value: t.id, label: t.name }))}
                value={currentTenant?.id ?? ''}
                onChange={(value) => setTenant(value as string)}
                placeholder="Selecionar Tenant"
             />
           )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => {
                   if (window.innerWidth < 768) setSidebarCollapsed(true);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                  ${sidebarCollapsed ? 'md:justify-center' : ''}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-primary dark:text-blue-400' : 'text-gray-500'} />
                
                <span className={`text-sm font-medium ${sidebarCollapsed ? 'md:hidden' : ''}`}>
                   {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 
            hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 transition-colors
            ${sidebarCollapsed ? 'md:justify-center' : ''}
          `}>
            <Settings size={20} />
            <span className={`text-sm font-medium ${sidebarCollapsed ? 'md:hidden' : ''}`}>Configurações</span>
          </button>
          
          <button 
            onClick={logout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 
              hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors
              ${sidebarCollapsed ? 'md:justify-center' : ''}
            `}
          >
            <LogOut size={20} />
            <span className={`text-sm font-medium ${sidebarCollapsed ? 'md:hidden' : ''}`}>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};