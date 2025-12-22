import {
  apiGetWithRefresh,
  apiPostWithRefresh,
  apiPutWithRefresh,
  apiDeleteWithRefresh,
  handleApiResponse
} from './apiInterceptor';
import { getAccessToken, decodeJWT } from './authService';

// API Configuration
const USERS_ENDPOINT = '/users/';

interface UserResponse {
  name: string;
  email: string;
  role_id: number;
  status: boolean;
  id: number;
  created_at: string;
  updated_at: string;
  role: {
    name: string;
    description: string;
    id: number;
  };
}

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role_id: number;
  status?: boolean;
}

interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  role_id?: number;
  status?: boolean;
}

export const getCurrentUser = async (): Promise<UserResponse | null> => {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.email) {
      throw new Error('Invalid token or email not found in token');
    }
    const userEmail = decodedToken.email;
    
    const allUsers = await getAllUsers();
    const currentUser = allUsers.find(user => user.email === userEmail);

    if (!currentUser) {
      throw new Error('Current user not found in user list');
    }
    
    return currentUser;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

export const getAllUsers = async (skip: number = 0, limit: number = 100): Promise<UserResponse[]> => {
  try {
    const response = await apiGetWithRefresh(`${USERS_ENDPOINT}?skip=${skip}&limit=${limit}`, true);
    return await handleApiResponse<UserResponse[]>(response);
  } catch (error) {
    console.error('Failed to get users:', error);
    throw error;
  }
};

export const getUserById = async (userId: number): Promise<UserResponse> => {
  try {
    const response = await apiGetWithRefresh(`${USERS_ENDPOINT}${userId}`, true);
    return await handleApiResponse<UserResponse>(response);
  } catch (error) {
    console.error(`Failed to get user ${userId}:`, error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserRequest): Promise<UserResponse> => {
  try {
    const response = await apiPostWithRefresh(USERS_ENDPOINT, userData, true);
    return await handleApiResponse<UserResponse>(response);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
};

export const updateUser = async (userId: number, userData: UpdateUserRequest): Promise<UserResponse> => {
  try {
    const response = await apiPutWithRefresh(`${USERS_ENDPOINT}${userId}`, userData, true);
    return await handleApiResponse<UserResponse>(response);
  } catch (error) {
    console.error(`Failed to update user ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const response = await apiDeleteWithRefresh(`${USERS_ENDPOINT}${userId}`, true);
    await handleApiResponse<void>(response);
  } catch (error) {
    console.error(`Failed to delete user ${userId}:`, error);
    throw error;
  }
};