import { Tenant, TenancyType } from '../types';

// API Configuration
const API_BASE_URL = 'https://api.weboost.pt';
const CUSTOMERS_ENDPOINT = `${API_BASE_URL}/customers/customers`;

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
    const response = await fetch(`${CUSTOMERS_ENDPOINT}?page=1&per_page=50`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include' // Important for authentication
    });

    if (!response.ok) {
      try {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        let errorMessage = 'Failed to fetch customers.';
        
        if (errorData.detail && Array.isArray(errorData.detail) && errorData.detail.length > 0) {
          errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
        } else if (errorData.detail && typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
        
        console.error('Customer fetch error:', errorMessage);
        throw new Error(errorMessage);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const data: CustomersResponse = await response.json();
    console.log('API Customers Response:', data);
    
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
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to fetch customers. Please try again.');
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