import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntegrationManager } from './pages/IntegrationManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IntegrationManager />
    </QueryClientProvider>
  );
}

export default App;
