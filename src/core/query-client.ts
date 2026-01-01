import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity, // Realtime updates via onSnapshot, so we don't need manual refetching
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});
