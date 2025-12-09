import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tenant, Language, Role } from './types';
import { MOCK_USER, MOCK_TENANTS } from './constants';

interface AppState {
  user: User | null;
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  language: Language;
  sidebarCollapsed: boolean;
  
  // Actions
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  setTenant: (tenantId: string) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage if available
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('retentix_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('retentix_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [language, setLanguage] = useState<Language>('pt');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Effect: Handle Theme Changes & Persistence
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('retentix_theme', theme);
  }, [theme]);

  // Effect: Handle User Persistence & Tenant Initialization
  useEffect(() => {
    if (user) {
      localStorage.setItem('retentix_user', JSON.stringify(user));
      // If user is logged in but no tenant selected, select default
      if (!currentTenant) {
        const defaultTenant = MOCK_TENANTS.find(t => t.id === 't1') || MOCK_TENANTS[0];
        setCurrentTenant(defaultTenant);
      }
    } else {
      localStorage.removeItem('retentix_user');
    }
  }, [user, currentTenant]);

  // Effect: Responsive Sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const login = async (email: string, pass: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Hardcoded credentials for demo purposes (No .env)
        const validEmail = 'admin@retentix.io';
        const validPass = 'retentix#2025';
        
        if (email === validEmail && pass === validPass) {
          setUser(MOCK_USER);
          const defaultTenant = MOCK_TENANTS.find(t => t.id === 't1') || MOCK_TENANTS[0];
          setCurrentTenant(defaultTenant);
          resolve(true);
        } else {
          alert("Credenciais inválidas. Tente admin@retentix.com / admin123");
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    setCurrentTenant(null);
    localStorage.removeItem('retentix_user');
  };

  const setTenant = (tenantId: string) => {
    const t = MOCK_TENANTS.find(mt => mt.id === tenantId);
    if (t) setCurrentTenant(t);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(prev => prev === 'pt' ? 'en' : 'pt');
  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  const availableTenants = user?.role === Role.ADMIN 
    ? MOCK_TENANTS 
    : MOCK_TENANTS.filter(t => user?.allowedTenants.includes(t.id));

  return (
    <AppContext.Provider value={{
      user,
      currentTenant,
      availableTenants,
      isAuthenticated: !!user,
      theme,
      language,
      sidebarCollapsed,
      login,
      logout,
      setTenant,
      toggleTheme,
      toggleLanguage,
      toggleSidebar,
      setSidebarCollapsed
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};