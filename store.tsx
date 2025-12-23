import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tenant, Language, Role, TenancyType } from './types';
import { loginWithApi, checkAuth } from './services/authService';
import { getAllTenants } from './services/customerService';
import { NotificationType } from './components/Notification';

interface AppNotification {
  message: string;
  type: NotificationType;
}

interface AppState {
  user: User | null;
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  tenantsLoaded: boolean;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  language: Language;
  sidebarCollapsed: boolean;
  notification: AppNotification | null;
  
  // Actions
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setTenant: (tenantId: string) => void;
  toggleTheme: () => void;
  toggleLanguage: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  notify: (message: string, type?: NotificationType) => void;
  clearNotification: () => void;
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
  const [tenantsLoaded, setTenantsLoaded] = useState(false);
  const [language, setLanguage] = useState<Language>('pt');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notification, setNotification] = useState<AppNotification | null>(null);

  const notify = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  };

  const clearNotification = () => setNotification(null);

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

  // Effect: Load all tenants only after user is authenticated
  useEffect(() => {
    const loadTenants = async () => {
      // Only load tenants if user is authenticated
      if (!user) {
        console.log('Skipping tenant loading - no authenticated user');
        setTenantsLoaded(true); // Set to true to avoid loading state
        return;
      }
      
      try {
        const tenants = await getAllTenants();
        console.log('Loaded tenants from API:', tenants);
        
        // Ensure we always have internal and admin tenants for admin users
        const essentialTenants = [
          { id: 'internal', name: 'Weboost', type: TenancyType.INTERNAL },
          { id: 'admin', name: 'Administração', type: TenancyType.ADMIN }
        ];
        
        // Merge API tenants with essential tenants, avoiding duplicates
        const mergedTenants = [...essentialTenants];
        tenants.forEach(apiTenant => {
          if (!mergedTenants.some(t => t.id === apiTenant.id)) {
            mergedTenants.push(apiTenant);
          }
        });
        
        setAllTenants(mergedTenants);
      } catch (error) {
        console.error('Failed to load tenants:', error);
        // If there's an error loading tenants, use fallback tenants
        console.log('Using fallback tenants due to API error');
        const fallbackTenants = [
          { id: 'internal', name: 'Weboost', type: TenancyType.INTERNAL },
          { id: 'admin', name: 'Administração', type: TenancyType.ADMIN }
        ];
        setAllTenants(fallbackTenants);
      } finally {
        setTenantsLoaded(true); // Always set to true to avoid infinite loading
      }
    };
    
    loadTenants();
  }, [user]); // Now depends on user - only runs when user changes

  // Effect: Update user's allowedTenants with real tenant data when tenants are loaded
  useEffect(() => {
    if (user && tenantsLoaded && allTenants.length > 0) {
      console.log('Updating user allowedTenants with real tenant data');
      
      // Create updated user with real tenant names
      const updatedUser = {
        ...user,
        // Update allowedTenants to include real tenant names for display purposes
        allowedTenantsWithNames: user.allowedTenants.map(tenantId => {
          const tenant = allTenants.find(t => t.id === tenantId);
          return tenant ? tenant : { id: tenantId, name: `Cliente ${tenantId}` };
        })
      };
      
      console.log('Updated user with tenant names:', updatedUser);
      // Note: We don't setUser here to avoid infinite loops, just log for debugging
    }
  }, [user, tenantsLoaded, allTenants]);

  // Effect: Handle User Persistence and INITIAL Tenant Resolution
  useEffect(() => {
    console.log('useEffect [user]: Running. User:', user);
    if (user) {
      localStorage.setItem('weboost_user', JSON.stringify(user));

      // Determine available tenants for the current user
      // Ensure admin users always have access to internal and admin tenants
      let userAvailableTenants = allTenants;
      
      // If no tenants loaded yet, use essential tenants for admin users
      if (allTenants.length === 0 && user.role === Role.ADMIN) {
        userAvailableTenants = [
          { id: 'internal', name: 'Weboost', type: TenancyType.INTERNAL },
          { id: 'admin', name: 'Administração', type: TenancyType.ADMIN }
        ];
      }
      
      if (user.role !== Role.ADMIN) {
        userAvailableTenants = allTenants.filter(t => user.allowedTenants.includes(t.id));
      }
      
      // Ensure admin users always have access to essential tenants
      if (user.role === Role.ADMIN) {
        const essentialTenantIds = ['internal', 'admin'];
        essentialTenantIds.forEach(tenantId => {
          if (!user.allowedTenants.includes(tenantId)) {
            user.allowedTenants.push(tenantId);
          }
        });
      }

      let resolvedTenant: Tenant | null = null;

      // Try to load a saved tenant from localStorage first
      const savedTenantId = localStorage.getItem('weboost_currentTenantId');
      console.log('useEffect [user]: Saved Tenant ID from localStorage:', savedTenantId);
      if (savedTenantId) {
        resolvedTenant = userAvailableTenants.find(t => t.id === savedTenantId) || null;
      }

      // If no resolved tenant (either not saved or not allowed for user), fall back to default logic
      if (!resolvedTenant) {
        // Check if user has internal tenant available
        const hasInternalTenant = userAvailableTenants.some(t => t.id === 'internal');
        console.log('useEffect [user]: Has internal tenant:', hasInternalTenant);
        
        if (hasInternalTenant) {
          // For roles 1, 2, 3, 5-10: always default to internal tenant
          resolvedTenant = userAvailableTenants.find(t => t.id === 'internal') || null;
          console.log('useEffect [user]: Selected internal tenant (priority for roles with internal access)');
        } else {
          // For role 4 (client): default to first client (since they don't have internal access)
          resolvedTenant = 
            userAvailableTenants.find(t => t.type === TenancyType.CLIENT) ||
            userAvailableTenants[0] ||
            null;
          console.log('useEffect [user]: Selected first client (no internal access)');
        }
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
  }, [user, allTenants]); // Now depends on both user and allTenants



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
      
      // Wait for tenants to be loaded before proceeding with login
      if (!tenantsLoaded) {
        console.log('Login: Waiting for tenants to load...');
        // In a real app, we might want to show a loading indicator here
        // For now, we'll just wait a bit and check again
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!tenantsLoaded) {
          console.error('Login: Tenants not loaded after waiting');
          return false;
        }
      }
      
      // Try to use the real API first
      const { user: apiUser, accessToken, refreshToken } = await loginWithApi(email, pass);
      
      console.log('Login: API login successful. Setting user:', apiUser);
      setUser(apiUser);
      
      // Store access token and refresh token
      localStorage.setItem('weboost_access_token', accessToken);
      localStorage.setItem('weboost_refresh_token', refreshToken);
      
      // Determine available tenants for the current user
      // If no tenants loaded yet, use essential tenants for admin users
      let userAvailableTenants = allTenants;
      if (allTenants.length === 0 && apiUser.role === Role.ADMIN) {
        userAvailableTenants = [
          { id: 'internal', name: 'Weboost', type: TenancyType.INTERNAL },
          { id: 'admin', name: 'Administração', type: TenancyType.ADMIN }
        ];
      } else if (apiUser.role !== Role.ADMIN) {
        userAvailableTenants = allTenants.filter(t => apiUser.allowedTenants.includes(t.id));
      }

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
      setUser(null);
      setCurrentTenant(null);
      localStorage.removeItem('weboost_user');
      localStorage.removeItem('weboost_currentTenantId');
      localStorage.removeItem('weboost_access_token');
      localStorage.removeItem('weboost_refresh_token');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, clear local state
      setUser(null);
      setCurrentTenant(null);
      localStorage.removeItem('weboost_user');
      localStorage.removeItem('weboost_currentTenantId');
      localStorage.removeItem('weboost_access_token');
      localStorage.removeItem('weboost_refresh_token');
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

  const availableTenants = tenantsLoaded 
    ? (user?.role === Role.ADMIN 
        ? allTenants 
        : allTenants.filter(t => user?.allowedTenants.includes(t.id)))
    : [];
    
  console.log('User allowed tenants:', user?.allowedTenants);
  console.log('All tenants:', allTenants);
  console.log('Filtered available tenants:', availableTenants);

  return (
    <AppContext.Provider value={{
      user,
      currentTenant,
      availableTenants,
      tenantsLoaded,
      isAuthenticated: !!user,
      theme,
      language,
      sidebarCollapsed,
      notification,
      login,
      logout,
      setTenant,
      toggleTheme,
      toggleLanguage,
      toggleSidebar,
      setSidebarCollapsed,
      notify,
      clearNotification
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