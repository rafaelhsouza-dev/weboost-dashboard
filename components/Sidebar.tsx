import React from 'react';
import { useApp } from '../store';
import { TenancyType } from '../types';
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
  ChevronsUpDown,
  Layers,
  FileSignature,
  Handshake,
  CalendarDays,
  UserPlus2,
  Bot,
  ScanSearch
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { 
    sidebarCollapsed, 
    toggleSidebar, 
    currentTenant, 
    availableTenants, 
    tenantsLoaded,
    setTenant,
    logout,
    setSidebarCollapsed
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();

  const handleTenantChange = (tenantId: string) => {
    console.log('Available tenants for user:', availableTenants);
    console.log('Trying to change to tenant:', tenantId);
    const tenant = availableTenants.find(t => t.id === tenantId);
    if (tenant) {
      setTenant(tenantId);
      switch (tenant.type) {
        case TenancyType.ADMIN:
          navigate('/');
          break;
        case TenancyType.CLIENT:
          navigate('/client/dashboard');
          break;
        case TenancyType.INTERNAL:
          navigate('/user/dashboard');
          break;
        default:
          navigate('/');
          break;
      }
    }
  };

  const getMenuItems = () => {
    if (!currentTenant) return [];

    switch (currentTenant.type) {
      case TenancyType.ADMIN:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
          { id: 'tenants', label: 'Clientes', icon: Building2, path: '/tenants' },
          { id: 'contracts', label: 'Contratos', icon: FileSignature, path: '/contracts' },
          { id: 'services', label: 'Serviços', icon: Layers, path: '/services' },
          { id: 'users', label: 'Utilizadores', icon: Users, path: '/users' },
          { id: 'partners', label: 'Parceiros', icon: Handshake, path: '/partners' },
          { id: 'events', label: 'Feiras e Eventos', icon: CalendarDays, path: '/events' },
          { id: 'referrals', label: 'Indicações', icon: UserPlus2, path: '/referrals' },
          { id: 'settings', label: 'Configurações', icon: Settings, path: '/admin/settings' },
        ];
      case TenancyType.CLIENT:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/client/dashboard' },
          { id: 'campaigns', label: 'Campanhas', icon: Megaphone, path: '/campaigns' },
          { id: 'reports', label: 'Relatórios', icon: FileText, path: '/reports' },
          { id: 'settings', label: 'Configurações', icon: Settings, path: '/client/settings' },
        ];
      case TenancyType.INTERNAL:
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/user/dashboard' },
          { id: 'scraper', label: 'AI Scraper', icon: Bot, path: '/scraper' },
          { id: 'seo', label: 'Analisar SEO/GEO', icon: ScanSearch, path: '/seo-analysis' },
          { id: 'settings', label: 'Configurações', icon: Settings, path: '/user/settings' },
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
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-[#eee] dark:bg-[#151515] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out ${sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-72'}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 relative bg-[#a1a1a1] dark:bg-[#151515]">
          <div className="flex items-center gap-3">
            {sidebarCollapsed ? (
               <img src="/imgs/weboost-icon.webp" alt="Weboost" className="w-8 h-8 object-contain md:block hidden" />
            ) : (
               <img src="/imgs/weboost-color.webp" alt="Weboost" className="h-8 w-auto object-contain" />
            )}
            <img src="/imgs/weboost-color.webp" alt="Weboost" className="h-8 w-auto object-contain md:hidden block" />
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex absolute -right-3 top-6 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full items-center justify-center shadow-sm hover:text-primary transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative group">
            <div className={`
              flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 
              border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-primary/50 transition-colors
              ${sidebarCollapsed ? 'md:justify-center' : 'justify-between'}
            `}>
               <div className="flex items-center gap-2 overflow-hidden w-full">
                  <div className="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-primary shrink-0">
                    {currentTenant?.type === TenancyType.INTERNAL ? <Briefcase size={16}/> : <Building2 size={16}/>}
                  </div>
                  
                  <div className={`flex flex-col truncate ${sidebarCollapsed ? 'md:hidden' : ''}`}>
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {currentTenant?.name || (tenantsLoaded ? 'Nenhum tenant' : 'Carregando...')}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                       {currentTenant?.type === 'ADMIN' ? 'Administrador' : currentTenant?.type === 'INTERNAL' ? 'Weboost' : 'Cliente'}
                    </span>
                  </div>
               </div>
               
               {availableTenants.length > 1 && (
                 <ChevronsUpDown size={16} className={`text-gray-400 ${sidebarCollapsed ? 'md:hidden' : ''}`} />
               )}
               
               <select 
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={(e) => handleTenantChange(e.target.value)}
                  value={currentTenant?.id}
                  disabled={availableTenants.length <= 1 || !tenantsLoaded}
               >
                  {availableTenants.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} {t.id !== 'internal' && t.id !== 'admin' ? `(${t.id})` : ''}
                    </option>
                  ))}
               </select>
            </div>
          </div>
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
                    ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#16a34a]' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                  ${sidebarCollapsed ? 'md:justify-center' : ''}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-primary dark:text-[#16a34a]' : 'text-gray-500'} />
                
                <span className={`text-sm font-medium ${sidebarCollapsed ? 'md:hidden' : ''}`}>
                   {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button 
            onClick={async () => await logout()}
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