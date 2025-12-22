import { getAccessToken, getRefreshToken, refreshAccessToken } from './authService';

/**
 * Interceptor for API requests to handle token refresh
 */
export const apiRequestWithRefresh = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<Response> => {
  // First, try the request with the current token
  const apiClient = await import('./apiClient');
  
  try {
    const response = await apiClient.apiRequest(endpoint, options, requiresAuth);
    
    // If the request is successful, return the response
    if (response.ok) {
      return response;
    }
    
    // If we get a 401 error, try to refresh the token and retry
    if (response.status === 401 && requiresAuth) {
      console.log('Token expired, attempting to refresh...');
      
      const currentRefreshToken = getRefreshToken();
      
      if (!currentRefreshToken) {
        console.error('No refresh token available');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      try {
        // Try to refresh the token
        const { accessToken, refreshToken } = await refreshAccessToken(currentRefreshToken);
        
        // Store the new tokens
        localStorage.setItem('weboost_access_token', accessToken);
        localStorage.setItem('weboost_refresh_token', refreshToken);
        
        console.log('Token refreshed successfully, retrying request...');
        
        // Retry the original request with the new token
        const retryResponse = await apiClient.apiRequest(endpoint, options, requiresAuth);
        
        return retryResponse;
        
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        
        // Clear tokens if refresh fails
        localStorage.removeItem('weboost_access_token');
        localStorage.removeItem('weboost_refresh_token');
        
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
    }
    
    // For other errors, just return the response
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