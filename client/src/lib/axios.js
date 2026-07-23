import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000, // 30s — prevents infinite hanging requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network error (no response at all) — don't attempt refresh, just fail cleanly
    if (!error.response) {
      return Promise.reject(error);
    }

    // Don't try to refresh on the /auth/me check itself, or on the refresh call, or on login/register
    const skipRefreshUrls = ['/auth/refresh', '/auth/login', '/auth/register'];
    const shouldSkip = skipRefreshUrls.some((url) => originalRequest.url?.includes(url));

    if (error.response.status === 401 && !originalRequest._retry && !shouldSkip) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;