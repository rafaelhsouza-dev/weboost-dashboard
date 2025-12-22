import { Tenant, TenancyType, ApiCustomerResponse, ApiUserResponse } from '../types';
import {
  apiGetWithRefresh,
  apiPostWithRefresh,
  apiDeleteWithRefresh,
  apiPutWithRefresh,
  handleApiResponse
} from './apiInterceptor';
import { getAccessToken } from './authService';

// API Configuration
const CUSTOMERS_ENDPOINT = '/customers/';

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
    const response = await apiGetWithRefresh(CUSTOMERS_ENDPOINT, true); // true for requiresAuth
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



// Function to fetch customers with pagination
export const fetchCustomers = async (skip: number = 0, limit: number = 100): Promise<ApiCustomer[]> => {
  try {
    console.log('Fetching customers from API...');
    
    // Check if token is available
    const token = getAccessToken();
    console.log('Token available for customers request:', token ? 'YES' : 'NO');
    
    // Use the new apiClient to make authenticated request
    const response = await apiGetWithRefresh(`${CUSTOMERS_ENDPOINT}?skip=${skip}&limit=${limit}`, true);
    const data: ApiCustomer[] = await handleApiResponse(response);
    
    console.log('API Customers Response:', data);
    
    // Verify if customers array exists and is valid
    if (!Array.isArray(data)) {
      console.warn('Invalid customers data format received:', data);
      return []; // Return empty array instead of throwing error
    }
    
    return data;
    
  } catch (error) {
    console.error('Customer fetch error:', error);
    throw error;
  }
};

// Function to fetch a single customer by ID
export const fetchCustomerById = async (customerId: number): Promise<ApiCustomer> => {
  try {
    console.log(`Fetching customer ${customerId} from API...`);
    
    const response = await apiGetWithRefresh(`${CUSTOMERS_ENDPOINT}${customerId}`, true);
    const data: ApiCustomer = await handleApiResponse(response);
    
    console.log('API Customer Response:', data);
    return data;
    
  } catch (error) {
    console.error(`Customer ${customerId} fetch error:`, error);
    throw error;
  }
};

// Function to create a new customer
export const createCustomer = async (customerData: any): Promise<ApiCustomer> => {
  try {
    console.log('Creating customer with data:', customerData);
    
    const response = await apiPostWithRefresh(CUSTOMERS_ENDPOINT, customerData, true);
    const data: ApiCustomer = await handleApiResponse(response);
    
    console.log('Customer created successfully:', data);
    return data;
    
  } catch (error) {
    console.error('Customer creation error:', error);
    throw error;
  }
};

// Function to update a customer
export const updateCustomer = async (customerId: number, customerData: any): Promise<ApiCustomer> => {
  try {
    console.log(`Updating customer ${customerId} with data:`, customerData);
    
    const response = await apiPutWithRefresh(`${CUSTOMERS_ENDPOINT}${customerId}`, customerData, true);
    const data: ApiCustomer = await handleApiResponse(response);
    
    console.log('Customer updated successfully:', data);
    return data;
    
  } catch (error) {
    console.error(`Customer ${customerId} update error:`, error);
    throw error;
  }
};

// Function to delete a customer
export const deleteCustomer = async (customerId: number): Promise<void> => {
  try {
    console.log(`Deleting customer ${customerId}...`);
    
    const response = await apiDeleteWithRefresh(`${CUSTOMERS_ENDPOINT}${customerId}`, true);
    await handleApiResponse(response);
    
    console.log('Customer deleted successfully');
    
  } catch (error) {
    console.error(`Customer ${customerId} deletion error:`, error);
    throw error;
  }
};

// Function to list users of a customer
export const listCustomerUsers = async (customerId: number): Promise<ApiUserResponse[]> => {
  try {
    const response = await apiGetWithRefresh(`${CUSTOMERS_ENDPOINT}${customerId}/users`, true);
    return await handleApiResponse<ApiUserResponse[]>(response);
  } catch (error) {
    console.error(`Failed to get users for customer ${customerId}:`, error);
    throw error;
  }
};

// Function to add a user to a customer
export const addUserToCustomer = async (customerId: number, userId: number): Promise<{ message: string }> => {
  try {
    const response = await apiPostWithRefresh(`${CUSTOMERS_ENDPOINT}${customerId}/users/${userId}`, {}, true);
    return await handleApiResponse(response);
  } catch (error) {
    console.error(`Failed to add user ${userId} to customer ${customerId}:`, error);
    throw error;
  }
};

// Function to remove a user from a customer
export const removeUserFromCustomer = async (customerId: number, userId: number): Promise<void> => {
  try {
    const response = await apiDeleteWithRefresh(`${CUSTOMERS_ENDPOINT}${customerId}/users/${userId}`, true);
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Failed to remove user ${userId} from customer ${customerId}:`, error);
    throw error;
  }
};

// Customer Types
export const listCustomerTypes = async (): Promise<any[]> => {
  try {
    const response = await apiGetWithRefresh(`${CUSTOMERS_ENDPOINT}types`, true);
    return await handleApiResponse<any[]>(response);
  } catch (error) {
    console.error('Failed to list customer types:', error);
    throw error;
  }
};

export const addCustomerType = async (typeData: { name: string; description: string }): Promise<any> => {
  try {
    const response = await apiPostWithRefresh(`${CUSTOMERS_ENDPOINT}types`, typeData, true);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Failed to add customer type:', error);
    throw error;
  }
};

// Customer Statuses
export const listCustomerStatuses = async (): Promise<any[]> => {
  try {
    const response = await apiGetWithRefresh(`${CUSTOMERS_ENDPOINT}statuses`, true);
    return await handleApiResponse<any[]>(response);
  } catch (error) {
    console.error('Failed to list customer statuses:', error);
    throw error;
  }
};

export const addCustomerStatus = async (statusData: { name: string; is_active_status: boolean }): Promise<any> => {
  try {
    const response = await apiPostWithRefresh(`${CUSTOMERS_ENDPOINT}statuses`, statusData, true);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Failed to add customer status:', error);
    throw error;
  }
};

// Admin Operations
export const runAllMigrations = async (): Promise<any> => {
  try {
    const response = await apiPostWithRefresh('/admin/migrations/run-all-tenants/', {}, true);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Failed to run all migrations:', error);
    throw error;
  }
};

export const getSystemStatus = async (): Promise<any> => {
  try {
    const response = await apiGetWithRefresh('/admin/tenants/status/', true);
    return await handleApiResponse(response);
  } catch (error) {
    console.error('Failed to get system status:', error);
    throw error;
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