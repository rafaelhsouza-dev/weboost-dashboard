import { apiGetWithRefresh, handleApiResponse } from './apiInterceptor';
import { Department } from '../types';

const DEPARTMENTS_ENDPOINT = '/users/departments/';

export const listDepartments = async (skip: number = 0, limit: number = 100): Promise<Department[]> => {
  try {
    const response = await apiGetWithRefresh(`${DEPARTMENTS_ENDPOINT}?skip=${skip}&limit=${limit}`, true);
    return await handleApiResponse<Department[]>(response);
  } catch (error) {
    console.error('Failed to list departments:', error);
    throw error;
  }
};
