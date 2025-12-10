import { User, Role, Tenant, TenancyType } from '../types';

// API Configuration
const API_BASE_URL = 'https://api.weboost.pt';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/login`;

// Map API roles to our application roles
const mapApiRoleToAppRole = (apiRoles: string[]): Role => {
  if (apiRoles.includes('admin') || apiRoles.includes('ADMIN')) return Role.ADMIN;
  if (apiRoles.includes('manager') || apiRoles.includes('MANAGER')) return Role.MANAGER;
  if (apiRoles.includes('client') || apiRoles.includes('CLIENT')) return Role.CLIENT;
  return Role.EMPLOYEE; // Default role
};

// Map API customers to our tenants
const mapApiCustomersToTenants = (apiCustomers: any[]): Tenant[] => {
  if (!apiCustomers || apiCustomers.length === 0) {
    return [
      { id: 't1', name: 'Weboost (Utilizador)', type: TenancyType.INTERNAL }
    ];
  }

  return apiCustomers.map((customer, index) => ({
    id: `c${index + 1}`,
    name: customer.name || `Cliente ${index + 1}`,
    type: TenancyType.CLIENT
  }));
};

// Map API user to our application user
const mapApiUserToAppUser = (apiUser: any): User => {
  const role = mapApiRoleToAppRole(apiUser.roles || []);
  const tenants = mapApiCustomersToTenants(apiUser.customers || []);
  
  // Add admin tenant if user is admin
  if (role === Role.ADMIN) {
    tenants.unshift({ id: 'admin', name: 'Admin System', type: TenancyType.ADMIN });
  }
  
  // Add internal tenant for all users
  tenants.unshift({ id: 'internal', name: 'Weboost (Utilizador)', type: TenancyType.INTERNAL });

  return {
    id: apiUser.id.toString(),
    name: apiUser.name || apiUser.email || 'Usuário',
    email: apiUser.email || '',
    avatar: apiUser.avatar_url || 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg',
    role: role,
    allowedTenants: tenants.map(t => t.id)
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
    roles: string[];
    customers: any[];
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
    
    // Map API user to our application user
    const appUser = mapApiUserToAppUser(data.user);
    
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