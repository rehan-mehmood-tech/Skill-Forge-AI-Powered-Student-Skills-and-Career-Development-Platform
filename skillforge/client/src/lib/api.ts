import axios from 'axios';
import { supabase } from './supabaseClient';
import toast from 'react-hot-toast';

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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("Unauthorized. Please sign in again.");
          console.warn("Unauthorized access - possible expired token. Please sign in again.");
          break;
        case 403:
          toast.error("Forbidden. You don't have access to this resource.");
          break;
        case 422:
          toast.error("Validation error. Please check your inputs.");
          break;
        case 500:
          toast.error("Server error. We're working on it!");
          break;
        default:
          toast.error(error.response.data?.error || "An error occurred.");
      }
    } else if (error.request) {
      toast.error("Network error. Could not connect to servers.");
    } else {
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export const get = (url: string, config = {}) => apiClient.get(url, config);
export const post = (url: string, data?: any, config = {}) => apiClient.post(url, data, config);
export const put = (url: string, data?: any, config = {}) => apiClient.put(url, data, config);
export const del = (url: string, config = {}) => apiClient.delete(url, config);
