/**
 * API Client with Authentication Token Management
 * 
 * This module provides a centralized way to make authenticated API requests
 * by automatically adding the access token to all requests.
 */

// API Configuration
const API_BASE_URL = 'https://api.weboost.pt';

/**
 * Get the current access token from storage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('weboost_access_token');
};

/**
 * Make an authenticated API request
 * 
 * @param endpoint - API endpoint (without base URL)
 * @param options - Request options
 * @param requiresAuth - Whether to add authentication token (default: true)
 * @returns Response from the API
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<Response> => {
  // Get the full URL
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  // Clone options to avoid mutation
  const requestOptions: RequestInit = { ...options };

  // Set default headers
  requestOptions.headers = {
    ...requestOptions.headers,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  // Add authentication token if required
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

  // Add credentials for cookies (refresh token)
  requestOptions.credentials = 'include';

  console.log(`Making ${requiresAuth ? 'authenticated' : 'public'} request to:`, url);
  console.log('Request options:', requestOptions);

  try {
    const response = await fetch(url, requestOptions);
    
    // Log response status for debugging
    console.log(`API Response status: ${response.status} for ${url}`);
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Make an authenticated GET request
 */
export const apiGet = async (
  endpoint: string,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequest(endpoint, { method: 'GET' }, requiresAuth);
};

/**
 * Make an authenticated POST request
 */
export const apiPost = async (
  endpoint: string,
  body: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  }, requiresAuth);
};

/**
 * Make an authenticated PUT request
 */
export const apiPut = async (
  endpoint: string,
  body: any,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body)
  }, requiresAuth);
};

/**
 * Make an authenticated DELETE request
 */
export const apiDelete = async (
  endpoint: string,
  requiresAuth: boolean = true
): Promise<Response> => {
  return apiRequest(endpoint, { method: 'DELETE' }, requiresAuth);
};

/**
 * Handle API response and parse JSON
 */
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      
      let errorMessage = 'API request failed';
      
      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
      } else if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
      
      // For server errors (500+), include status code in message
      if (response.status >= 500) {
        errorMessage = `Server error (${response.status}): ${errorMessage}`;
      }
      
      throw new Error(errorMessage);
    } catch (parseError) {
      console.error('Failed to parse error response:', parseError);
      
      // Special handling for 500 errors - don't crash the app
      if (response.status === 500) {
        console.error('Server returned 500 Internal Server Error');
        throw new Error('Server error: Please try again later');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  try {
    return await response.json();
  } catch (jsonError) {
    console.error('Failed to parse successful response as JSON:', jsonError);
    // For 204 No Content, return empty object
    if (response.status === 204) {
      return {} as T;
    }
    throw new Error('Invalid response format from server');
  }
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
