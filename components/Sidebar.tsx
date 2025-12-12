import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { TenancyType } from '../types';
import { Combobox } from './Combobox';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Megaphone, 
  Briefcase,
  FileText,
  Building2,
  Layers,
  FileSignature,
  Handshake,
  CalendarDays,
  UserPlus2,
  Bot,
  ScanSearch,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// Define the types for menu items
type MenuItemChild = {
  id: string;
  label: string;
  path: string;
  icon?: React.ElementType; // Add icon property for submenu items
};

type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: MenuItemChild[];
};

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
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleTenantChange = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId);
    if (tenant) {
      setTenant(tenantId);
      setOpenSubmenus([]); // Close submenus on tenant change
      switch (tenant.type) {
        case TenancyType.ADMIN: navigate('/'); break;
        case TenancyType.CLIENT: navigate('/client/dashboard'); break;
        case TenancyType.INTERNAL: navigate('/user/dashboard'); break;
        default: navigate('/'); break;
      }
    }
  };

  const getMenuItems = (): MenuItem[] => {
    if (!currentTenant) return [];

    switch (currentTenant.type) {
      case TenancyType.ADMIN:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
          { 
            id: 'clients', 
            label: 'Clientes', 
            icon: Building2,
            children: [
              { id: 'tenants', label: 'Resumo Clientes', path: '/customers', icon: LayoutDashboard },
              { id: 'customer-list', label: 'Lista de Clientes', path: '/customer-list', icon: Users }
            ]
          },
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
          { id: 'logs', label: 'Registos de Atividade', icon: Clock, path: '/user/logs' },
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
            {/* Tenant Selector */}
            {availableTenants.length > 1 && tenantsLoaded && (
              <div className="mt-2">
                <Combobox
                  options={availableTenants.map(t => ({
                    value: t.id,
                    label: `${t.name} ${t.id !== 'internal' && t.id !== 'admin' ? `(${t.id})` : ''}`
                  }))}
                  value={currentTenant?.id || ''}
                  onChange={(value: string) => handleTenantChange(value)}
                  placeholder="Selecione um Cliente..."
                  className="w-full"
                />
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => {
            const isSubmenuOpen = openSubmenus.includes(item.id);
            
            if (item.children) {
              const isChildActive = item.children.some(child => location.pathname === child.path);
              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${isChildActive ? 'text-primary' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                      ${sidebarCollapsed ? 'md:justify-center' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={isChildActive ? 'text-primary' : 'text-gray-500'} />
                      <span className={`text-sm font-medium ${sidebarCollapsed ? 'md:hidden' : ''}`}>{item.label}</span>
                    </div>
                    {!sidebarCollapsed && <ChevronDown size={16} className={`transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
                  </button>
                  {isSubmenuOpen && !sidebarCollapsed && (
                    <div className="pt-1 pl-5 space-y-1">
                      {item.children.map((child) => {
                        const isActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.id}
                            to={child.path}
                            onClick={() => { if (window.innerWidth < 768) setSidebarCollapsed(true); }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm
                              ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#16a34a]' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                            `}
                          >
                            {child.icon ? (
                              <child.icon size={16} className={isActive ? 'text-primary dark:text-[#16a34a]' : 'text-gray-400'} />
                            ) : (
                              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-gray-400'}`}></span>
                            )}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path!}
                onClick={() => { if (window.innerWidth < 768) setSidebarCollapsed(true); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-[#16a34a]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'}
                  ${sidebarCollapsed ? 'md:justify-center' : ''}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-primary dark:text-[#16a34a]' : 'text-gray-500'} />
                <span className={`text-sm font-medium ${sidebarCollapsed ? 'md:hidden' : ''}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
          <button 
            onClick={async () => await logout()}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 
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