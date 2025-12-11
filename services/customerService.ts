import { Tenant, TenancyType } from '../types';
import { apiGet, handleApiResponse } from './apiClient';

// API Configuration
const CUSTOMERS_ENDPOINT = '/customers/customers';

interface ApiCustomer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  street_name: string | null;
  street_number: string | null;
  city: string | null;
  country: string | null;
  zip: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomersResponse {
  customers: ApiCustomer[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
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
    
    // Use the new apiClient to make authenticated request
    const response = await apiGet(`${CUSTOMERS_ENDPOINT}?page=1&per_page=50`);
    const data: CustomersResponse = await handleApiResponse(response);
    
    console.log('API Customers Response:', data);
    
    // Verify if customers array exists and is valid
    if (!data.customers || !Array.isArray(data.customers)) {
      console.warn('Invalid customers data format received:', data);
      return []; // Return empty array instead of throwing error
    }
    
    // Map API customers to our tenant format
    const customerTenants = data.customers.map(customer => ({
      id: `c${customer.id}`,
      name: customer.name,
      type: TenancyType.CLIENT as TenancyType,
      email: customer.email,
      phone: customer.phone,
      address: customer.street_name && customer.street_number 
        ? `${customer.street_name}, ${customer.street_number}`
        : null,
      city: customer.city,
      country: customer.country,
      zip: customer.zip
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
    { id: 'internal', name: 'Weboost (Utilizador)', type: TenancyType.INTERNAL },
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