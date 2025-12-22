import { getAccessToken, getRefreshToken, refreshAccessToken } from './authService';

// Base API URL
const API_BASE_URL = 'https://api.weboost.pt';

/**
 * Make a generic API request. This is the core function.
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<Response> => {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const requestOptions: RequestInit = { ...options };

  requestOptions.headers = {
    ...requestOptions.headers,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      requestOptions.headers = {
        ...requestOptions.headers,
        'Authorization': `Bearer ${token}`
      };
    } else {
      console.warn('No access token found for authenticated request');
    }
  }
  
  requestOptions.credentials = 'include';

  try {
    const response = await fetch(url, requestOptions);
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Handle API response and parse JSON
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      let errorMessage = 'API request failed';
      
      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      if (response.status >= 500) {
        errorMessage = `Server error (${response.status}): ${errorMessage}`;
      }
      
      throw new Error(errorMessage);
    } catch (parseError) {
      if (response.status === 500) {
        throw new Error('Server error: Please try again later');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  try {
    // For 204 No Content, return empty object
    if (response.status === 204) {
      return {} as T;
    }
    return await response.json();
  } catch (jsonError) {
    throw new Error('Invalid response format from server');
  }
};


/**
 * Interceptor for API requests to handle token refresh
 */
export const apiRequestWithRefresh = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<Response> => {
  try {
    const response = await apiRequest(endpoint, options, requiresAuth);
    
    if (response.ok) {
      return response;
    }
    
    if (response.status === 401 && requiresAuth) {
      console.log('Token expired, attempting to refresh...');
      
      const currentRefreshToken = getRefreshToken();
      
      if (!currentRefreshToken) {
        console.error('No refresh token available');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      try {
        const { accessToken, refreshToken } = await refreshAccessToken(currentRefreshToken);
        
        localStorage.setItem('weboost_access_token', accessToken);
        localStorage.setItem('weboost_refresh_token', refreshToken);
        
        console.log('Token refreshed successfully, retrying request...');
        
        const retryResponse = await apiRequest(endpoint, options, requiresAuth);
        
        return retryResponse;
        
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        
        localStorage.removeItem('weboost_access_token');
        localStorage.removeItem('weboost_refresh_token');
        
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
    }
    
    return response;
    
  } catch (error) {
    console.error('API request with refresh failed:', error);
    throw error;
  }
};

/**
 * Wrapper for apiGet with automatic token refresh
 */
export const apiGetWithRefresh = async (
  endpoint: string,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequestWithRefresh(endpoint, { method: 'GET' }, requiresAuth);
};

/**
 * Wrapper for apiPost with automatic token refresh
 */
export const apiPostWithRefresh = async (
  endpoint: string,
  body: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequestWithRefresh(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  }, requiresAuth);
};

/**
 * Wrapper for apiPut with automatic token refresh
 */
export const apiPutWithRefresh = async (
  endpoint: string,
  body: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequestWithRefresh(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  }, requiresAuth);
};

/**
 * Wrapper for apiDelete with automatic token refresh
 */
export const apiDeleteWithRefresh = async (
  endpoint: string,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequestWithRefresh(endpoint, { method: 'DELETE' }, requiresAuth);
};