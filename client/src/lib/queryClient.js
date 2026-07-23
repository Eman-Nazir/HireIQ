import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { getErrorMessage } from './errorMessage';

// This function gets set from main.jsx once ToastProvider mounts, avoiding a circular import
let globalToastHandler = null;
export const setGlobalToastHandler = (fn) => { globalToastHandler = fn; };

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show a global toast if the component didn't already handle the error itself
      if (query.meta?.silent) return;
      globalToastHandler?.(getErrorMessage(error), 'error');
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, variables, context, mutation) => {
      if (mutation.meta?.silent) return;
      globalToastHandler?.(getErrorMessage(error), 'error');
    },
  }),
});

export default queryClient;