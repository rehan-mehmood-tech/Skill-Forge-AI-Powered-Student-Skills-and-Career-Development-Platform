import axios from 'axios';
import { supabase } from './supabaseClient';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - possible expired token. Please sign in again.");
      // Optional: trigger a custom event or state update to prompt re-login without hard crash
    }
    return Promise.reject(error);
  }
);

export const get = (url: string, config = {}) => apiClient.get(url, config);
export const post = (url: string, data?: any, config = {}) => apiClient.post(url, data, config);
export const put = (url: string, data?: any, config = {}) => apiClient.put(url, data, config);
export const del = (url: string, config = {}) => apiClient.delete(url, config);
