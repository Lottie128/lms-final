import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { supabase } from './supabase';

// Get API URL from env and add /api prefix
const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (!apiUrl) {
    return 'http://localhost:3001/api';
  }
  // Add /api if not already present
  return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token && config.headers) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
