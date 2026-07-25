import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { getErrorMessage } from './errorMessage';

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