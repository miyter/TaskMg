/**
 * Sidebar UI Elements State
 * TypeScript conversion: 2025-12-30
 */

export interface SidebarUI {
    container: HTMLElement | null;
    sidebar: HTMLElement | null;
    resizer: HTMLElement | null;
    openBtn: HTMLElement | null;
    closeBtn: HTMLElement | null;
    inbox: HTMLElement | null;
    overlay: HTMLElement | null;
}

// UI要素のキャッシュをシングルトン的に管理
let UI: SidebarUI = {
    container: null,
    sidebar: null,
    resizer: null,
    openBtn: null,
    closeBtn: null,
    inbox: null,
    overlay: null
};

export function cacheSidebarElements(): SidebarUI {
    UI = {
        container: document.getElementById('sidebar-content'),
        sidebar: document.getElementById('sidebar'),
        resizer: document.getElementById('sidebar-resizer'),
        openBtn: document.getElementById('sidebar-open-btn'),
        closeBtn: document.getElementById('sidebar-close-btn'),
        inbox: document.getElementById('nav-inbox'),
        overlay: document.getElementById('sidebar-overlay')
    };
    return UI;
}

export function getSidebarUI(): SidebarUI {
    return UI;
}
