import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tenant, Language, Role } from './types';
import { loginWithApi, logoutFromApi, checkAuth } from './services/authService';
import { getAllTenants } from './services/customerService';

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
  logout: () => Promise<void>;
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
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
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

  // Effect: Load all tenants on app initialization
  useEffect(() => {
    const loadTenants = async () => {
      try {
        const tenants = await getAllTenants();
        console.log('Loaded tenants:', tenants);
        setAllTenants(tenants);
      } catch (error) {
        console.error('Failed to load tenants:', error);
        // In production, we should handle this error appropriately
        // For now, we'll just log it and leave tenants as empty array
        // The app will show appropriate error messages to the user
      }
    };
    
    loadTenants();
  }, []);

  // Effect: Handle User Persistence and INITIAL Tenant Resolution
  useEffect(() => {
    console.log('useEffect [user]: Running. User:', user);
    if (user) {
      localStorage.setItem('weboost_user', JSON.stringify(user));

      // Determine available tenants for the current user
      const userAvailableTenants = user.role === Role.ADMIN
        ? allTenants
        : allTenants.filter(t => user.allowedTenants.includes(t.id));

      let resolvedTenant: Tenant | null = null;

      // Try to load a saved tenant from localStorage first
      const savedTenantId = localStorage.getItem('weboost_currentTenantId');
      console.log('useEffect [user]: Saved Tenant ID from localStorage:', savedTenantId);
      if (savedTenantId) {
        resolvedTenant = userAvailableTenants.find(t => t.id === savedTenantId) || null;
      }

      // If no resolved tenant (either not saved or not allowed for user), fall back to default logic
      if (!resolvedTenant) {
        resolvedTenant = userAvailableTenants.find(t => t.id === 'internal') || userAvailableTenants[0] || null;
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
    try {
      console.log('Login: Attempting API login with email:', email);
      
      // Try to use the real API first
      const { user: apiUser, accessToken } = await loginWithApi(email, pass);
      
      console.log('Login: API login successful. Setting user:', apiUser);
      setUser(apiUser);
      
      // Store access token
      localStorage.setItem('weboost_access_token', accessToken);
      
      // Determine available tenants for the current user
      const userAvailableTenants = apiUser.role === Role.ADMIN
        ? allTenants
        : allTenants.filter(t => apiUser.allowedTenants.includes(t.id));

      console.log('Login: Available tenants for user:', userAvailableTenants);

      let resolvedTenant: Tenant | null = null;

      // Try to load a saved tenant from localStorage first
      const savedTenantId = localStorage.getItem('weboost_currentTenantId');
      console.log('Login: Saved Tenant ID from localStorage:', savedTenantId);
      if (savedTenantId) {
        resolvedTenant = userAvailableTenants.find(t => t.id === savedTenantId) || null;
      }

      // If no resolved tenant (either not saved or not allowed for user), use priority logic
      if (!resolvedTenant) {
        console.log('Login: No saved tenant found, selecting by priority...');
        console.log('Login: Available tenants:', userAvailableTenants);
        
        // Check if user has internal tenant available
        const hasInternalTenant = userAvailableTenants.some(t => t.id === 'internal');
        console.log('Login: Has internal tenant:', hasInternalTenant);
        
        if (hasInternalTenant) {
          // For roles 1, 2, 3, 5-10: always default to internal tenant
          resolvedTenant = userAvailableTenants.find(t => t.id === 'internal') || null;
          console.log('Login: Selected internal tenant (priority for roles with internal access)');
        } else {
          // For role 4 (client): default to first client (since they don't have internal access)
          resolvedTenant = 
            userAvailableTenants.find(t => t.type === TenancyType.CLIENT) ||
            userAvailableTenants[0] ||
            null;
          console.log('Login: Selected first client (no internal access)');
        }
        
        console.log('Login: Final selected tenant:', resolvedTenant);
      }
      
      console.log('Login: Setting currentTenant to:', resolvedTenant);
      setCurrentTenant(resolvedTenant);
      // Persist the resolved tenant immediately
      if (resolvedTenant) {
        localStorage.setItem('weboost_currentTenantId', resolvedTenant.id);
      } else {
        localStorage.removeItem('weboost_currentTenantId');
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error message in the UI
      const errorMessage = error instanceof Error ? error.message : "Credenciais inválidas";
      console.error('Login failed:', errorMessage);
      return false;
    }
  };

  const logout = async () => {
    console.log('Logout: Clearing user and tenant from state and localStorage.');
    try {
      await logoutFromApi();
      setUser(null);
      setCurrentTenant(null);
      localStorage.removeItem('weboost_user');
      localStorage.removeItem('weboost_currentTenantId');
      localStorage.removeItem('weboost_access_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, clear local state
      setUser(null);
      setCurrentTenant(null);
      localStorage.removeItem('weboost_user');
      localStorage.removeItem('weboost_currentTenantId');
      localStorage.removeItem('weboost_access_token');
    }
  };

  const setTenant = (tenantId: string) => {
    console.log('setTenant: Attempting to set tenant to ID:', tenantId);
    const t = allTenants.find(mt => mt.id === tenantId);
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
    ? allTenants 
    : allTenants.filter(t => user?.allowedTenants.includes(t.id));

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