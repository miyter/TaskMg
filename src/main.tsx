import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './index.css';

// Self-hosted fonts
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/m-plus-2/400.css';
import '@fontsource/m-plus-2/500.css';
import '@fontsource/m-plus-2/700.css';
import { initZodI18n } from './core/i18n/zod-setup';
import { initErrorLogger } from './utils/error-logger';

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
