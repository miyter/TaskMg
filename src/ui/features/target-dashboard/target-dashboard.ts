import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { DashboardApp } from './react/DashboardApp';

/**
 * Target Dashboard Entry Point (React)
 * Converted to React: 2025-12-30
 */

let root: Root | null = null;

export function renderTargetDashboard(container: HTMLElement | null): void {
    if (!container) return;

    if (!root) {
        root = createRoot(container);
    }

    root.render(React.createElement(DashboardApp));
}
