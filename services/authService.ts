import { User, Role, Tenant, TenancyType, ApiUserResponse } from '../types';

// API Configuration
const API_BASE_URL = 'https://api.weboost.pt';
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/token`;

// Map API roles to our application roles
const mapApiRoleToAppRole = (roleId: number): Role => {
  // Roles mapping:
  // 1 = ti (Acesso completo com nível desenvolvimento) -> ADMIN
  // 2 = admin (Acesso completo ao sistema) -> ADMIN
  // 3 = manager (Pode gerir clientes e operações) -> MANAGER
  // 4 = client (Pode operar funcionalidades para cliente) -> CLIENT
  // 5 = employee (Funcionário padrão) -> EMPLOYEE
  // 6-10 = employee_* (Funcionários especializados) -> EMPLOYEE
  
  // Check for admin roles (highest priority)
  if (roleId === 1 || roleId === 2) return Role.ADMIN;
  
  // Check for manager role
  if (roleId === 3) return Role.MANAGER;
  
  // Check for client role
  if (roleId === 4) return Role.CLIENT;
  
  // Default to employee for all other roles (5-10)
  return Role.EMPLOYEE;
};

// Map API roles to display names
const getRoleDisplayName = (roleId: number): string => {
  // Priority: show the highest priority role name
  if (roleId === 1) return 'TI';
  if (roleId === 2) return 'Administrador';
  if (roleId === 3) return 'Gestor';
  if (roleId === 4) return 'Cliente';
  if (roleId === 5) return 'Funcionário';
  if (roleId === 6) return 'Performance';
  if (roleId === 7) return 'Foto/Vídeo';
  if (roleId === 8) return 'Design';
  if (roleId === 9) return 'Desenvolvimento';
  if (roleId === 10) return 'Marketing';
  return 'Usuário';
};

// Function to decode JWT token and extract user data
export const decodeJWT = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

// Map API customers to our tenants
const mapApiCustomersToTenants = (apiCustomers: number[]): Tenant[] => {
  if (!apiCustomers || apiCustomers.length === 0) {
    return []; // Internal tenant is added separately
  }

  // Customers are now just IDs, we need to map them to tenant objects
  // The actual customer names will be fetched from the customer service
  return apiCustomers.map((customerId) => ({
    id: `c${customerId}`,
    name: `Cliente ${customerId}`, // Temporary name, will be updated from customer service
    type: TenancyType.CLIENT
  }));
};

// Map API user to our application user
const mapApiUserToAppUser = (apiUser: ApiUserResponse | any): User => {
  // Check if we have role_id directly or in roles array (legacy/JWT support)
  let roleId = 5; // Default employee
  
  if (apiUser.role_id) {
    roleId = apiUser.role_id;
  } else if (apiUser.roles && Array.isArray(apiUser.roles) && apiUser.roles.length > 0) {
    roleId = apiUser.roles[0];
  }
  
  const role = mapApiRoleToAppRole(roleId);
  const roleDisplayName = getRoleDisplayName(roleId);
  
  // Handle customers safely
  const customersList = apiUser.customers && Array.isArray(apiUser.customers) ? apiUser.customers : [];
  const tenants = mapApiCustomersToTenants(customersList);
  
  // Add admin tenant ONLY for roles 1, 2, 3 (TI, Admin, Manager)
  if (roleId === 1 || roleId === 2 || roleId === 3) {
    tenants.unshift({ id: 'admin', name: 'Admin System', type: TenancyType.ADMIN });
  }
  
  // Add internal tenant for all users EXCEPT role 4 (client)
  // Role 4 (client) should only see their own client, not the internal tenant
  if (roleId !== 4) {
    tenants.unshift({ id: 'internal', name: 'Weboost', type: TenancyType.INTERNAL });
  }

  return {
    id: apiUser.id.toString(),
    name: apiUser.name || apiUser.email || 'Usuário',
    email: apiUser.email || '',
    avatar: apiUser.avatar_url || 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg', // avatar_url might come from JWT
    role: role,
    roleDisplayName: roleDisplayName,
    allowedTenants: tenants.map(t => t.id)
  };
};

// Function to fetch user data after login
const fetchUserData = async (accessToken: string, email: string): Promise<User> => {
  try {
    // First, try to decode JWT to get user data
    console.log('Decoding JWT token to extract user data...'); // Debug log
    const jwtPayload = decodeJWT(accessToken);
    console.log('JWT Payload:', jwtPayload); // Debug log
    
    if (jwtPayload) {
      // Extract user data from JWT
      // JWT usually has roles array, so we take the first one or default
      const roleId = jwtPayload.role_id ? jwtPayload.role_id : (jwtPayload.roles && jwtPayload.roles.length > 0 ? jwtPayload.roles[0] : 2);
      
      const userDataFromJWT = {
        id: jwtPayload.sub || '1',
        name: jwtPayload.name || 'Administrador',
        email: jwtPayload.email || email,
        avatar_url: 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg',
        role_id: roleId,
        customers: jwtPayload.customers || []
      };
      
      console.log('User data from JWT:', userDataFromJWT); // Debug log
      
      return mapApiUserToAppUser(userDataFromJWT);
    }
    
    // Fallback: try to fetch from /users/ endpoint if JWT decoding fails
    console.log('JWT decoding failed, trying to fetch from /users/...'); // Debug log
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    console.log('User data response status:', response.status); // Debug log
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('User data fetch failed:', response.status, errorText);
      throw new Error(`Failed to fetch user data: ${response.status} - ${errorText}`);
    }

    const usersData: ApiUserResponse[] = await response.json();
    console.log('Users data received from API:', usersData); // Debug log
    
    // Find the current user from the list (assuming first user is the current one)
    // In a real implementation, we would need to identify the current user properly
    if (usersData.length === 0) {
      console.warn('No users found in the response');
      throw new Error('No user data available');
    }
    
    const userData = usersData[0]; // Use first user as fallback
    console.log('Using first user from list:', userData); // Debug log
    
    // Check if we have the required data
    // Use type assertion to avoid TS errors if checking properties that might not exist on the type
    if (!(userData as any).role_id && !(userData as any).roles) {
      console.warn('User data missing required fields. Using fallback data.');
      const fallbackUserData = {
        ...userData,
        role_id: 4, // Default to client role
        customers: [] // No customers by default
      };
      console.log('Using fallback user data:', fallbackUserData);
      return mapApiUserToAppUser(fallbackUserData);
    }
    
    // Map the API user data to our application user format
    return mapApiUserToAppUser(userData);
    
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    
    // Ultimate fallback: create a default admin user
    console.warn('Using ultimate fallback - creating default admin user');
    const defaultUser: User = {
      id: '1',
      name: 'Administrador',
      email: email, // Use the email from login
      avatar: 'https://img.freepik.com/premium-vector/user-icon-icon_1076610-59410.jpg',
      role: Role.ADMIN,
      roleDisplayName: 'Administrador',
      allowedTenants: ['internal', 'admin']
    };
    
    console.log('Default user created:', defaultUser);
    return defaultUser;
  }
};

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface LoginError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export const loginWithApi = async (email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  try {
    // Prepare form data for x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', email);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', 'string');
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
        console.log('Response status:', response.status); // Debug log
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
        
        // Special handling for common errors
        if (response.status === 401) {
          errorMessage = 'Credenciais inválidas. Por favor, verifique seu email e senha.';
        } else if (response.status === 400) {
          errorMessage = 'Requisição inválida. Por favor, verifique os dados enviados.';
        } else if (response.status === 500) {
          errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
        }
        
        throw new Error(errorMessage);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        // If we can't parse the error response
        const statusText = response.statusText || `HTTP error! status: ${response.status}`;
        
        // Special handling for network errors
        if (parseError.message.includes('Failed to fetch')) {
          throw new Error('Não foi possível conectar ao servidor. Por favor, verifique sua conexão com a internet.');
        }
        
        throw new Error(statusText);
      }
    }

    const data: LoginResponse = await response.json();
    
    console.log('API Login Response:', data); // Debug log
    console.log('Access Token:', data.access_token); // Debug log
    console.log('Refresh Token:', data.refresh_token); // Debug log
    
    // Now fetch user data using the access token and email
    console.log('Fetching user data with access token...'); // Debug log
    const appUser = await fetchUserData(data.access_token, email);
    
    console.log('Mapped User:', appUser); // Debug log
    
    return {
      user: appUser,
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
    
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.');
  }
};

// Function to refresh access token
export const refreshAccessToken = async (refreshToken: string, activeCustomer?: number): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        active_customer: activeCustomer
      }),
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Refresh token error:', errorData);
      throw new Error('Failed to refresh access token');
    }

    const data: LoginResponse = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token
    };
  } catch (error) {
    console.error('Refresh token error:', error);
    throw error;
  }
};

// Function to get the current access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem('weboost_access_token');
};

// Function to get the current refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('weboost_refresh_token');
};

// Function to check if user is authenticated (check for valid token)
export const checkAuth = async (): Promise<boolean> => {
  try {
    // In a real implementation, we would check the token validity
    // For now, we'll just check if we have a token in localStorage
    const token = getAccessToken();
    return !!token;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};
