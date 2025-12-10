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
    const saved = localStorage.getItem('weboost_user');
    const loadedUser = saved ? JSON.parse(saved) : null;
    console.log('AppProvider: Initializing user from localStorage:', loadedUser);
    return loadedUser;
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('weboost_theme');
    return (saved === 'dark' || saved === 'light') ? saved : 'light';
  });

  // currentTenant should not be initialized from localStorage here, but managed by useEffect
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
    localStorage.setItem('weboost_theme', theme);
  }, [theme]);

  // Effect: Handle User Persistence and INITIAL Tenant Resolution
  useEffect(() => {
    console.log('useEffect [user]: Running. User:', user);
    if (user) {
      localStorage.setItem('weboost_user', JSON.stringify(user));

      // Determine available tenants for the current user
      const userAvailableTenants = user.role === Role.ADMIN
        ? MOCK_TENANTS
        : MOCK_TENANTS.filter(t => user.allowedTenants.includes(t.id));

      let resolvedTenant: Tenant | null = null;

      // Try to load a saved tenant from localStorage first
      const savedTenantId = localStorage.getItem('weboost_currentTenantId');
      console.log('useEffect [user]: Saved Tenant ID from localStorage:', savedTenantId);
      if (savedTenantId) {
        resolvedTenant = userAvailableTenants.find(t => t.id === savedTenantId) || null;
      }

      // If no resolved tenant (either not saved or not allowed for user), fall back to default logic
      if (!resolvedTenant) {
        resolvedTenant = userAvailableTenants.find(t => t.id === 't1') || userAvailableTenants[0] || null;
        console.log('useEffect [user]: Falling back to default tenant:', resolvedTenant);
      }
      
      console.log('useEffect [user]: Setting currentTenant to:', resolvedTenant);
      setCurrentTenant(resolvedTenant);
      // Persist the resolved tenant immediately
      if (resolvedTenant) {
        localStorage.setItem('weboost_currentTenantId', resolvedTenant.id);
      } else {
        localStorage.removeItem('weboost_currentTenantId');
      }
    } else {
      // If no user, clear user and tenant from localStorage
      console.log('useEffect [user]: No user found. Clearing localStorage and currentTenant.');
      localStorage.removeItem('weboost_user');
      localStorage.removeItem('weboost_currentTenantId');
      setCurrentTenant(null);
    }
  }, [user]); // This effect ONLY depends on user to run once on user change/load



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
        const validEmail = 'admin@weboost.io';
        const validPass = 'weboost#2025';
        
        if (email === validEmail && pass === validPass) {
          console.log('Login: Valid credentials. Setting user to MOCK_USER.');
          setUser(MOCK_USER);
          // For ADMIN user, always set default tenant to 't4' (Admin System)
          const adminTenant = MOCK_TENANTS.find(t => t.id === 't4');
          if (adminTenant) {
            console.log('Login: Setting currentTenant to Admin Tenant (t4).');
            setCurrentTenant(adminTenant);
            localStorage.setItem('weboost_currentTenantId', adminTenant.id);
          } else {
            // Fallback if 't4' is not found, though it should be in MOCK_TENANTS
            const defaultTenant = MOCK_TENANTS.find(t => t.id === 't1') || MOCK_TENANTS[0];
            console.log('Login: Admin Tenant (t4) not found. Falling back to default:', defaultTenant);
            setCurrentTenant(defaultTenant);
            if (defaultTenant) localStorage.setItem('weboost_currentTenantId', defaultTenant.id);
          }
          resolve(true);
        } else {
          alert("Credenciais inválidas. Tente admin@weboost.io / weboost#2025");
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    console.log('Logout: Clearing user and tenant from state and localStorage.');
    setUser(null);
    setCurrentTenant(null);
    localStorage.removeItem('weboost_user');
    localStorage.removeItem('weboost_currentTenantId');
  };

  const setTenant = (tenantId: string) => {
    console.log('setTenant: Attempting to set tenant to ID:', tenantId);
    const t = MOCK_TENANTS.find(mt => mt.id === tenantId);
    if (t) {
      setCurrentTenant(t);
      localStorage.setItem('weboost_currentTenantId', t.id); // Persist on manual change
      console.log('setTenant: Successfully set currentTenant to:', t);
    } else {
      console.log('setTenant: Tenant with ID not found:', tenantId);
    }
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