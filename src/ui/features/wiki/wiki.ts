import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { WikiApp } from './react/WikiApp';

/**
 * Wiki Render Entry Point (React)
 * Converted to React: 2025-12-30
 */

let root: Root | null = null;

export function renderWiki(container: HTMLElement | null): void {
    if (!container) return;

    if (!root) {
        root = createRoot(container);
    }

    root.render(React.createElement(WikiApp));
}
