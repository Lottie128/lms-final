import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { supabase } from './supabase';

// Get API URL from env and ALWAYS ensure /api suffix
const getBaseURL = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  
  // Default for local development
  if (!envUrl) {
    console.warn('[API] VITE_API_URL not set, using localhost');
    return 'http://localhost:3001/api';
  }
  
  // Clean the URL - remove trailing slashes
  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  
  // Remove /api if it exists (we'll add it back to ensure consistency)
  if (cleanUrl.endsWith('/api')) {
    cleanUrl = cleanUrl.slice(0, -4);
  }
  
  // Always add /api
  const finalUrl = `${cleanUrl}/api`;
  
  console.log('[API] Environment URL:', envUrl);
  console.log('[API] Final Base URL:', finalUrl);
  
  return finalUrl;
};

const baseURL = getBaseURL();

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
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
      console.error('[API] Error getting auth session:', error);
    }

    // Always log the full URL being called
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`);
    
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request interceptor error:', error);
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
    const fullUrl = originalRequest ? `${originalRequest.baseURL}${originalRequest.url}` : 'unknown';

    console.error('[API] Error Response:', {
      url: fullUrl,
      method: originalRequest?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
    });

    if (error.response?.status === 401) {
      console.log('[API] Unauthorized - signing out');
      await supabase.auth.signOut();
      
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Export for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).__API_BASE_URL__ = baseURL;
}

export { api };
export default api;
