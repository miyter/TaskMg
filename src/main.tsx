import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { initZodI18n } from './core/i18n/zod-setup';
import './index.css';
import { initErrorLogger } from './utils/error-logger';

// Load fonts asynchronously to reduce initial bundle size and render blocking
import('./core/fonts');

// QueryClient is used for React Query cache management
// Note: As of 2026-01-05, we are migrating to useSyncExternalStore for Firestore data,
// but QueryClient is still used for other async operations and legacy components.
import { queryClient } from './core/query-client';

// グローバルエラーハンドラーを初期化
initErrorLogger();
initZodI18n();

const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

// Conditionally wrap with StrictMode only in development
// StrictMode causes double-mounting which can impact performance and cause issues with subscriptions
const AppTree = (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </ErrorBoundary>
);

ReactDOM.createRoot(rootElement).render(
    import.meta.env.DEV ? <React.StrictMode>{AppTree}</React.StrictMode> : AppTree
);
