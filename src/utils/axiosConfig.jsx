import axios from 'axios';
import  store  from '@/redux/store';
import { logout } from '@/redux/authSlice';
import { toast } from 'sonner';
import { backend_url } from '@/constants';

const axiosInstance = axios.create({
  baseURL: backend_url,
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle token expiration (401) and server errors (500)
      if (error.response.status === 401 || error.response.status === 500) {
        // Clear auth state
        store.dispatch(logout());
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        // Show error message
        const errorMsg = error.response.status === 401 
          ? 'Session expired. Please login again.' 
          : 'Internal server error. Please try again.';
        
        toast.error(errorMsg);
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;