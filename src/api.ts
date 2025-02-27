import axios from 'axios';
import { Task } from './types';

const API_URL = 'http://localhost:5000/api';

// Add timeout to axios requests
axios.defaults.timeout = 10000; // 10 seconds

// Check if server is available
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    // First check if server is healthy
    const isHealthy = await checkServerHealth();
    if (!isHealthy) {
      throw new Error('Server is not available. Please make sure the backend server is running.');
    }
    
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
        throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
      }
      if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      }
    }
    throw error;
  }
};

export const fetchTask = async (id: string): Promise<Task> => {
  const response = await axios.get(`${API_URL}/tasks/${id}`);
  return response.data;
};

export const createTask = async (task: Omit<Task, '_id'>): Promise<Task> => {
  const response = await axios.post(`${API_URL}/tasks`, task);
  return response.data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
  const response = await axios.put(`${API_URL}/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/tasks/${id}`);
};