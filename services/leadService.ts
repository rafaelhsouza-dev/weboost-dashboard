import {
  apiGetWithRefresh,
  apiPostWithRefresh,
  apiPutWithRefresh,
  apiDeleteWithRefresh,
  handleApiResponse
} from './apiInterceptor';

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
  phone?: string;
}

interface UpdateLeadRequest {
  name?: string;
  email?: string;
  status?: string;
  phone?: string;
}

const getEndpoint = (customerId: number, leadId?: number) => {
  let endpoint = `/tenants/${customerId}/leads/`;
  if (leadId) {
    endpoint += `${leadId}`;
  }
  return endpoint;
}

export const getLeadsForCustomer = async (customerId: number, skip: number = 0, limit: number = 100): Promise<LeadResponse[]> => {
  try {
    const response = await apiGetWithRefresh(`${getEndpoint(customerId)}?skip=${skip}&limit=${limit}`, true);
    return await handleApiResponse<LeadResponse[]>(response);
  } catch (error) {
    console.error(`Failed to get leads for customer ${customerId}:`, error);
    throw error;
  }
};

export const getLeadById = async (customerId: number, leadId: number): Promise<LeadResponse> => {
  try {
    const response = await apiGetWithRefresh(getEndpoint(customerId, leadId), true);
    return await handleApiResponse<LeadResponse>(response);
  } catch (error) {
    console.error(`Failed to get lead ${leadId} for customer ${customerId}:`, error);
    throw error;
  }
};

export const createLead = async (customerId: number, leadData: CreateLeadRequest): Promise<LeadResponse> => {
  try {
    const response = await apiPostWithRefresh(getEndpoint(customerId), leadData, true);
    return await handleApiResponse<LeadResponse>(response);
  } catch (error) {
    console.error(`Failed to create lead for customer ${customerId}:`, error);
    throw error;
  }
};

export const updateLead = async (customerId: number, leadId: number, leadData: UpdateLeadRequest): Promise<LeadResponse> => {
  try {
    const response = await apiPutWithRefresh(getEndpoint(customerId, leadId), leadData, true);
    return await handleApiResponse<LeadResponse>(response);
  } catch (error) {
    console.error(`Failed to update lead ${leadId} for customer ${customerId}:`, error);
    throw error;
  }
};

export const deleteLead = async (customerId: number, leadId: number): Promise<void> => {
  try {
    const response = await apiDeleteWithRefresh(getEndpoint(customerId, leadId), true);
    await handleApiResponse<void>(response);
  } catch (error) {
    console.error(`Failed to delete lead ${leadId} for customer ${customerId}:`, error);
    throw error;
  }
};