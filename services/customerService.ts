import { Tenant, TenancyType, ApiCustomerResponse } from '../types';
import { apiGet, handleApiResponse, getAccessToken } from './apiClient';

// API Configuration
const CUSTOMERS_ENDPOINT = '/customers';

interface ApiCustomer extends ApiCustomerResponse {
}

interface CustomerError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export const fetchCustomersFromApi = async (): Promise<Tenant[]> => {
  try {
    console.log('Fetching customers from API...');
    
    // Check if token is available
    const token = getAccessToken();
    console.log('Token available for customers request:', token ? 'YES' : 'NO');
    
    // Use the new apiClient to make authenticated request
    const response = await apiGet(CUSTOMERS_ENDPOINT);
    const data: ApiCustomer[] = await handleApiResponse(response);
    
    console.log('API Customers Response:', data);
    
    // Verify if customers array exists and is valid
    if (!Array.isArray(data)) {
      console.warn('Invalid customers data format received:', data);
      return []; // Return empty array instead of throwing error
    }
    
    // Map API customers to our tenant format
    const customerTenants = data.map(customer => ({
      id: `c${customer.id}`,
      name: customer.name,
      type: TenancyType.CLIENT as TenancyType,
      email: customer.email,
      phone: customer.phone,
      schema_name: customer.schema_name,
      status: customer.status
    }));
    
    console.log('Mapped customer tenants:', customerTenants);
    return customerTenants;
    
  } catch (error) {
    console.error('Customer fetch error:', error);
    
    // Improved error handling for different scenarios
    if (error instanceof Error) {
      // If it's a 500 error, log it but don't crash the app
      if (error.message.includes('500')) {
        console.error('API server error (500). This might be a backend issue.');
        return []; // Return empty array to allow app to continue
      }
      // If it's a 401 error (not authenticated), return empty array
      if (error.message.includes('401') || error.message.includes('Not authenticated')) {
        console.log('Not authenticated - returning empty tenants (user not logged in)');
        return []; // Return empty array for unauthenticated requests
      }
      throw error;
    }
    
    console.error('Unknown error fetching customers:', error);
    return []; // Return empty array for any other unexpected errors
  }
};



// Function to get all tenants (combining internal, admin, and customer tenants)
export const getAllTenants = async (): Promise<Tenant[]> => {
  // Fetch real customer data from API
  const customerTenants = await fetchCustomersFromApi();
  
  // Combine with internal and admin tenants
  const allTenants = [
    { id: 'internal', name: 'Weboost', type: TenancyType.INTERNAL },
    { id: 'admin', name: 'Admin System', type: TenancyType.ADMIN },
    ...customerTenants
  ];
  
  return allTenants;
};

// Function to get customer data for client registration form
export const getCustomerOptions = async (): Promise<{value: string; label: string}[]> => {
  const customerTenants = await fetchCustomersFromApi();
  return customerTenants.map(customer => ({
    value: customer.id,
    label: `${customer.name} (${customer.email})`
  }));
};