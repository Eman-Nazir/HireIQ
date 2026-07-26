import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000,
});

// Automatically retry requests that fail due to network errors,
// timeouts, or cold-start-related failures (no response received).
axiosRetry(api, {
  retries: 2,
  retryDelay: (retryCount) => retryCount * 1500, 
  retryCondition: (error) => {
    // Retry on network errors / no response (covers cold starts, dropped connections)
    // Do NOT retry on actual server responses like 400/401/404/500 — those are real answers, not failures
    return !error.response;
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

const attachUserMessage = (error) => {
  if (!error.response) {
    error.userMessage = 'Network error. Please check your connection and try again.';
  } else {
    error.userMessage = error.response.data?.message || 'Something went wrong. Please try again.';
  }
  return error;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Network error don't attempt refresh, just fail cleanly
    if (!error.response) {
      return Promise.reject(attachUserMessage(error));
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
        return Promise.reject(attachUserMessage(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(attachUserMessage(error));
  }
);

export default api;