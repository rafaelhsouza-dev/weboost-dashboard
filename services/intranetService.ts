import {
  apiGetWithRefresh,
  apiPostWithRefresh,
  apiPutWithRefresh,
  apiDeleteWithRefresh,
  handleApiResponse
} from './apiInterceptor';
import { Alert } from '../types';

const INTRANET_ENDPOINT = '/intranet/alerts/';

export const listAlerts = async (active?: boolean, skip: number = 0, limit: number = 100): Promise<Alert[]> => {
  try {
    let url = `${INTRANET_ENDPOINT}?skip=${skip}&limit=${limit}`;
    if (active !== undefined) {
      url += `&active=${active}`;
    }
    const response = await apiGetWithRefresh(url, true);
    return await handleApiResponse<Alert[]>(response);
  } catch (error) {
    console.error('Failed to list alerts:', error);
    throw error;
  }
};

export const createAlert = async (data: { title: string; message: string; date_enable: string; date_disable: string }): Promise<Alert> => {
  try {
    const response = await apiPostWithRefresh(INTRANET_ENDPOINT, data, true);
    return await handleApiResponse<Alert>(response);
  } catch (error) {
    console.error('Failed to create alert:', error);
    throw error;
  }
};

export const updateAlert = async (id: number, data: { title?: string; message?: string; date_enable?: string; date_disable?: string }): Promise<Alert> => {
  try {
    const response = await apiPutWithRefresh(`${INTRANET_ENDPOINT}${id}`, data, true);
    return await handleApiResponse<Alert>(response);
  } catch (error) {
    console.error(`Failed to update alert ${id}:`, error);
    throw error;
  }
};

export const deleteAlert = async (id: number): Promise<void> => {
  try {
    const response = await apiDeleteWithRefresh(`${INTRANET_ENDPOINT}${id}`, true);
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Failed to delete alert ${id}:`, error);
    throw error;
  }
};

export const confirmAlertRead = async (id: number): Promise<void> => {
  try {
    const response = await apiPostWithRefresh(`${INTRANET_ENDPOINT}${id}/read`, {}, true);
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Failed to confirm alert ${id} read:`, error);
    throw error;
  }
};

export const getAlertUsersStatus = async (id: number): Promise<any[]> => {
  try {
    const response = await apiGetWithRefresh(`${INTRANET_ENDPOINT}${id}/users-status`, true);
    return await handleApiResponse<any[]>(response);
  } catch (error) {
    console.error(`Failed to get status for alert ${id}:`, error);
    throw error;
  }
};

