import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { supabase } from './supabase';

// Get API URL from env and ensure /api prefix
const getBaseURL = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    console.warn('VITE_API_URL not set, using localhost');
    return 'http://localhost:3001/api';
  }
  
  // Remove trailing slash if present
  const cleanUrl = apiUrl.replace(/\/$/, '');
  // Add /api if not already present
  const baseUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  
  console.log('API Base URL:', baseUrl);
  return baseUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token && config.headers) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting auth session:', error);
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Log error details
    console.error('API Error:', {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized - signing out');
      await supabase.auth.signOut();
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { api };
export default api;
