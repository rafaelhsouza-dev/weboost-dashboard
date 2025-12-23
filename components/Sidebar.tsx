import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { TenancyType } from '../types';
import { Combobox } from './Combobox';
import { 
  LayoutDashboard,
  Users, 
  Settings, 
  LogOut, 
  Building2,
  UserPlus2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  PlusCircle,
  Activity,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

type MenuItemChild = {
  id: string;
  label: string;
  path: string;
  icon?: React.ElementType;
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
    setOpenSubmenus(prev => prev.includes(id) ? [] : [id]);
  };

  const handleTenantChange = (tenantId: string) => {
    const tenant = availableTenants.find(t => t.id === tenantId);
    if (tenant) {
      setTenant(tenantId);
      setOpenSubmenus([]);
      switch (tenant.type) {
        case TenancyType.ADMIN: navigate('/admin/dashboard'); break;
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
          { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutGrid, path: '/admin/dashboard' },
          { 
            id: 'clients', 
            label: 'Gestão de Clientes', 
            icon: Building2,
            children: [
              { id: 'customer-list', label: 'Lista de Clientes', path: '/admin/customer-list', icon: List },
              { id: 'customer-create', label: 'Criar Novo Cliente', path: '/admin/customer-create', icon: PlusCircle },
              { id: 'customer-settings', label: 'Configurações Globais', path: '/admin/customer-settings', icon: Activity }
            ]
          },
          { 
            id: 'users', 
            label: 'Utilizadores', 
            icon: Users, 
            children: [
              { id: 'user-list', label: 'Lista de Utilizadores', path: '/admin/users', icon: List },
              { id: 'user-create', label: 'Novo Utilizador', path: '/admin/user-create', icon: PlusCircle },
              { id: 'user-settings', label: 'Configurações Globais', path: '/admin/user-settings', icon: Activity },
            ]
          },
          { id: 'settings', label: 'Definições', icon: Settings, path: '/admin/settings' },
        ];
      case TenancyType.CLIENT:
        return [
          { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, path: '/client/dashboard' },
          { id: 'leads', label: 'Meus Leads', icon: Users, path: '/client/reports' },
          { id: 'settings', label: 'Minha Conta', icon: Settings, path: '/client/settings' },
        ];
      case TenancyType.INTERNAL:
      default:
        return [
          { id: 'dashboard', label: 'Dashboard Interno', icon: LayoutDashboard, path: '/user/dashboard' },
          { id: 'settings', label: 'Configurações', icon: Settings, path: '/user/settings' },
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 md:hidden backdrop-blur-xs"
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-gray-100 dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border transition-all duration-300 ease-in-out ${sidebarCollapsed ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-72'}`}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-dark-border">
          {!sidebarCollapsed && (
            <img src="/imgs/weboost-color.webp" alt="Weboost" className="h-9 w-auto object-contain brightness-0 dark:brightness-100" />
          )}
          {sidebarCollapsed && (
            <img src="/imgs/weboost-icon.webp" alt="W" className="w-10 h-10 mx-auto brightness-0 dark:brightness-100" />
          )}
          
          <button 
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center w-6 h-6 text-gray-400 hover:text-primary transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <div className="p-4 border-b border-gray-50 dark:border-dark-border">
          {availableTenants.length > 1 && tenantsLoaded && !sidebarCollapsed && (
            <div className="animate-in fade-in duration-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-2">Alternar Modo</p>
              <Combobox
                options={availableTenants.map(t => ({
                  value: t.id,
                  label: t.name
                }))}
                value={currentTenant?.id || ''}
                onChange={(value: string) => handleTenantChange(value)}
                placeholder="Selecione..."
                className="w-full"
              />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const isSubmenuOpen = openSubmenus.includes(item.id);
            const isParentActive = item.children?.some(child => location.pathname === child.path);
            const isActive = location.pathname === item.path || isParentActive;
            
            if (item.children) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
                      {!sidebarCollapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && <ChevronDown size={16} className={`transition-transform duration-300 ${isSubmenuOpen ? 'rotate-180' : ''}`} />}
                  </button>
                  
                  {isSubmenuOpen && !sidebarCollapsed && (
                    <div className="pl-4 space-y-1 animate-in slide-in-from-left-2 duration-200">
                      {item.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <Link
                            key={child.id}
                            to={child.path}
                            className={`flex items-center gap-3 py-2 px-3 text-xs font-bold rounded-xl transition-all
                              ${isChildActive ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                            `}
                          >
                            {child.icon && <child.icon size={14} className={isChildActive ? 'text-primary' : 'text-gray-400'} />}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.id}
                to={item.path!}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${isActive ? 'bg-primary/5 text-primary' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900'}
                `}
              >
                <item.icon size={20} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'} />
                {!sidebarCollapsed && <span className="text-sm font-bold tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-50 dark:border-dark-border">
          <button 
            onClick={async () => await logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border transition-all group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {!sidebarCollapsed && <span className="text-sm font-bold tracking-tight">Encerrar Sessão</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
