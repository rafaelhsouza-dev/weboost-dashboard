import { apiGet, apiPost, apiPut, apiDelete, handleApiResponse } from './apiClient';

// API Configuration
const API_BASE_URL = 'https://api.weboost.pt';

interface LeadResponse {
  name: string;
  email: string;
  status: string;
  id: number;
  created_at: string;
}

interface CreateLeadRequest {
  name: string;
  email: string;
  status: string;
}

interface UpdateLeadRequest {
  name?: string;
  email?: string;
  status?: string;
}

export const getLeadsForCustomer = async (customerId: number, skip: number = 0, limit: number = 100): Promise<LeadResponse[]> => {
  try {
    const response = await apiGet(`${API_BASE_URL}/tenants/${customerId}/leads/?skip=${skip}&limit=${limit}`, true);
    return await handleApiResponse<LeadResponse[]>(response);
  } catch (error) {
    console.error(`Failed to get leads for customer ${customerId}:`, error);
    throw error;
  }
};

export const getLeadById = async (customerId: number, leadId: number): Promise<LeadResponse> => {
  try {
    const response = await apiGet(`${API_BASE_URL}/tenants/${customerId}/leads/${leadId}`, true);
    return await handleApiResponse<LeadResponse>(response);
  } catch (error) {
    console.error(`Failed to get lead ${leadId} for customer ${customerId}:`, error);
    throw error;
  }
};

export const createLead = async (customerId: number, leadData: CreateLeadRequest): Promise<LeadResponse> => {
  try {
    const response = await apiPost(`${API_BASE_URL}/tenants/${customerId}/leads/`, leadData, true);
    return await handleApiResponse<LeadResponse>(response);
  } catch (error) {
    console.error(`Failed to create lead for customer ${customerId}:`, error);
    throw error;
  }
};

export const updateLead = async (customerId: number, leadId: number, leadData: UpdateLeadRequest): Promise<LeadResponse> => {
  try {
    const response = await apiPut(`${API_BASE_URL}/tenants/${customerId}/leads/${leadId}`, leadData, true);
    return await handleApiResponse<LeadResponse>(response);
  } catch (error) {
    console.error(`Failed to update lead ${leadId} for customer ${customerId}:`, error);
    throw error;
  }
};

export const deleteLead = async (customerId: number, leadId: number): Promise<void> => {
  try {
    const response = await apiDelete(`${API_BASE_URL}/tenants/${customerId}/leads/${leadId}`, true);
    await handleApiResponse<void>(response);
  } catch (error) {
    console.error(`Failed to delete lead ${leadId} for customer ${customerId}:`, error);
    throw error;
  }
};