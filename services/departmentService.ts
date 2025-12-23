import {
  apiGetWithRefresh,
  apiPostWithRefresh,
  apiPutWithRefresh,
  apiDeleteWithRefresh,
  handleApiResponse
} from './apiInterceptor';
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

export const createDepartment = async (data: { name: string; description?: string }): Promise<Department> => {
  try {
    const response = await apiPostWithRefresh(DEPARTMENTS_ENDPOINT, data, true);
    return await handleApiResponse<Department>(response);
  } catch (error) {
    console.error('Failed to create department:', error);
    throw error;
  }
};

export const updateDepartment = async (id: number, data: { name?: string; description?: string }): Promise<Department> => {
  try {
    const response = await apiPutWithRefresh(`${DEPARTMENTS_ENDPOINT}${id}`, data, true);
    return await handleApiResponse<Department>(response);
  } catch (error) {
    console.error(`Failed to update department ${id}:`, error);
    throw error;
  }
};

export const deleteDepartment = async (id: number): Promise<void> => {
  try {
    const response = await apiDeleteWithRefresh(`${DEPARTMENTS_ENDPOINT}${id}`, true);
    await handleApiResponse(response);
  } catch (error) {
    console.error(`Failed to delete department ${id}:`, error);
    throw error;
  }
};