import { User, Role, Tenant, TenancyType } from '../types';

// API Configuration
const API_BASE_URL = 'https://api.weboost.pt';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

// Map API roles to our application roles
const mapApiRoleToAppRole = (apiRoles: number[]): Role => {
  // Roles mapping:
  // 1 = ti (Acesso completo com nível desenvolvimento) -> ADMIN
  // 2 = admin (Acesso completo ao sistema) -> ADMIN
  // 3 = manager (Pode gerir clientes e operações) -> MANAGER
  // 4 = client (Pode operar funcionalidades para cliente) -> CLIENT
  // 5 = employee (Funcionário padrão) -> EMPLOYEE
  // 6-10 = employee_* (Funcionários especializados) -> EMPLOYEE
  
  // Check for admin roles (highest priority)
  if (apiRoles.includes(1) || apiRoles.includes(2)) return Role.ADMIN;
  
  // Check for manager role
  if (apiRoles.includes(3)) return Role.MANAGER;
  
  // Check for client role
  if (apiRoles.includes(4)) return Role.CLIENT;
  
  // Default to employee for all other roles (5-10)
  return Role.EMPLOYEE;
};

// Map API roles to display names
const getRoleDisplayName = (apiRoles: number[]): string => {
  // Priority: show the highest priority role name
  if (apiRoles.includes(1)) return 'TI';
  if (apiRoles.includes(2)) return 'Administrador';
  if (apiRoles.includes(3)) return 'Gestor';
  if (apiRoles.includes(4)) return 'Cliente';
  if (apiRoles.includes(5)) return 'Funcionário';
  if (apiRoles.includes(6)) return 'Performance';
  if (apiRoles.includes(7)) return 'Foto/Vídeo';
  if (apiRoles.includes(8)) return 'Design';
  if (apiRoles.includes(9)) return 'Desenvolvimento';
  if (apiRoles.includes(10)) return 'Marketing';
  return 'Usuário';
};

// Customer ID to name mapping (this should be fetched from API or configured)
const CUSTOMER_NAMES: Record<number, string> = {
  1: 'TechSolutions Lda',
  2: 'Marketing Pro',
  3: 'Restaurante O Tacho',
  4: 'Weboost Interno',
  5: 'Cliente Premium',
  6: 'Parceiro Estratégico',
  7: 'Projeto Especial'
};

// Map API customers to our tenants
const mapApiCustomersToTenants = (apiCustomers: number[]): Tenant[] => {
  if (!apiCustomers || apiCustomers.length === 0) {
    return []; // Internal tenant is added separately
  }

  // Customers are now just IDs, we need to map them to tenant objects
  return apiCustomers.map((customerId) => ({
    id: `c${customerId}`,
    name: CUSTOMER_NAMES[customerId] || `Cliente ${customerId}`,
    type: TenancyType.CLIENT
  }));
};

// Map API user to our application user
const mapApiUserToAppUser = (apiUser: any): User => {
  const role = mapApiRoleToAppRole(apiUser.roles || []);
  const roleDisplayName = getRoleDisplayName(apiUser.roles || []);
  const tenants = mapApiCustomersToTenants(apiUser.customers || []);
  
  // Add admin tenant ONLY for roles 1, 2, 3 (TI, Admin, Manager)
  if (apiUser.roles && (apiUser.roles.includes(1) || apiUser.roles.includes(2) || apiUser.roles.includes(3))) {
    tenants.unshift({ id: 'admin', name: 'Admin System', type: TenancyType.ADMIN });
  }
  
  // Add internal tenant for all users EXCEPT role 4 (client)
  // Role 4 (client) should only see their own client, not the internal tenant
  if (apiUser.roles && !apiUser.roles.includes(4)) {
    tenants.unshift({ id: 'internal', name: 'Weboost (Utilizador)', type: TenancyType.INTERNAL });
  }

  return {
    id: apiUser.id.toString(),
    name: apiUser.name || apiUser.email || 'Usuário',
    email: apiUser.email || '',
    avatar: apiUser.avatar_url || 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg',
    role: role,
    roleDisplayName: roleDisplayName, // Add display name for UI
    allowedTenants: tenants.map(t => t.id),
    // Flag to indicate if user should default to internal tenant
    // Roles 1, 2, 3 default to internal, role 4 defaults to their client, roles 5-10 default to internal
    defaultToInternal: apiUser.roles && (apiUser.roles.some(r => [1, 2, 3, 5, 6, 7, 8, 9, 10].includes(r)))
  };
};

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url: string;
    roles: number[]; // Roles are now numbers
    customers: number[]; // Customers are now just IDs
  };
}

interface LoginError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export const loginWithApi = async (email: string, password: string): Promise<{ user: User; accessToken: string }> => {
  try {
    // Prepare form data for x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', email);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');

    const response = await fetch(LOGIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formData.toString(),
      credentials: 'include' // Important for cookies (refresh token)
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.log('API Error Response:', errorData); // Debug log
        let errorMessage = 'Falha no login. Por favor, verifique suas credenciais.';
        
        // Handle different error formats
        if (errorData.detail && Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          // Standard validation error format
          errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
        } else if (errorData.detail && typeof errorData.detail === 'string') {
          // Simple string error
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          // Error with message field
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          // Plain string response
          errorMessage = errorData;
        } else if (errorData.error) {
          // Error with error field
          errorMessage = errorData.error;
        }
        
        console.log('Final error message:', errorMessage); // Debug log
        throw new Error(errorMessage);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        // If we can't parse the error response
        const statusText = response.statusText || `HTTP error! status: ${response.status}`;
        throw new Error(statusText);
      }
    }

    const data: LoginResponse = await response.json();
    
    console.log('API Login Response:', data); // Debug log
    
    // Map API user to our application user
    const appUser = mapApiUserToAppUser(data.user);
    
    console.log('Mapped User:', appUser); // Debug log
    
    return {
      user: appUser,
      accessToken: data.access_token
    };
    
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
  }
};

// Function to check if user is authenticated (check for valid token)
export const checkAuth = async (): Promise<boolean> => {
  try {
    // In a real implementation, we would check the token validity
    // For now, we'll just check if we have a token in localStorage
    const token = localStorage.getItem('weboost_access_token');
    return !!token;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

// Function to logout (clear tokens)
export const logoutFromApi = async (): Promise<void> => {
  try {
    // In a real implementation, we might call a logout endpoint
    // For now, we'll just clear local storage
    localStorage.removeItem('weboost_access_token');
    localStorage.removeItem('weboost_user');
    localStorage.removeItem('weboost_currentTenantId');
    
    // Clear cookies by making a request to logout endpoint
    // This is a placeholder - actual implementation would depend on API
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (!response.ok) {
      console.warn('Logout endpoint failed, but local data was cleared');
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout fails, clear local data
    localStorage.removeItem('weboost_access_token');
    localStorage.removeItem('weboost_user');
    localStorage.removeItem('weboost_currentTenantId');
  }
};