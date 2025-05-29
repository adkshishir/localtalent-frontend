// File: src/lib/api.ts
import axios from 'axios';

export const VITE_API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: VITE_API_BASE_URL,
  withCredentials: true, // ⭐️ Send cookies!
});

const getAccessToken = () => localStorage.getItem('access_token');

// Request interceptor to add access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${VITE_API_BASE_URL}/auth/refresh`,
          null,
          {
            withCredentials: true,
          }
        );
        const newAccessToken = await response.data.data.accessToken;
        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem(
          'localtalent_user',
          JSON.stringify(response.data.data.user)
        );

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export const http = {
  get: <T = any>(url: string, config = {}) => api.get<T>(url, config),
  post: <T = any>(url: string, data: any, config = {}) =>
    api.post<T>(url, data, config),
  put: <T = any>(url: string, data: any, config = {}) =>
    api.put<T>(url, data, config),
  del: <T = any>(url: string, config = {}) => api.delete<T>(url, config),
  postWithFile: <T = any>(url: string, data: FormData, config = {}) =>
    api.post<T>(url, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      ...config,
    }),
};
