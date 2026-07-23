import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient, { setGlobalToastHandler } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { useToast } from './hooks/useToast';
import ErrorBoundary from './components/ErrorBoundary';
import App from './App.jsx';
import './index.css';

// Small bridge component: registers the toast function globally once mounted
function ToastBridge({ children }) {
  const { showToast } = useToast();
  useEffect(() => { setGlobalToastHandler(showToast); }, [showToast]);
  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <ToastProvider>
                <ToastBridge>
                  <App />
                </ToastBridge>
              </ToastProvider>
            </AuthProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);