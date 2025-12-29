/**
 * レイアウト構造の構築と基本操作
 */
import { LAYOUT_CONFIG } from './layout-constants.js';
import { SIDEBAR_CONFIG } from '../features/sidebar/sidebar-constants.js';
import { setupResizer } from '../features/sidebar/sidebar-utils.js';
import { initWorkspaceDropdown } from '../components/WorkspaceDropdown.js';

const { Z_INDEX } = LAYOUT_CONFIG;

const createSidebarHTML = () => `
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-[${Z_INDEX.OVERLAY}] hidden md:hidden transition-opacity duration-300"></div>
    <aside id="sidebar" class="flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all duration-300 group z-[${Z_INDEX.SIDEBAR}] fixed md:relative h-full md:translate-x-0 -translate-x-full shadow-xl md:shadow-none" style="width: ${SIDEBAR_CONFIG.DEFAULT_WIDTH}px;">
        ${renderSidebarHeader()}
        <div id="sidebar-content" class="flex-1 overflow-y-auto py-2 custom-scrollbar"></div>
        <div id="sidebar-resizer" class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-[${Z_INDEX.MODAL}] opacity-0 group-hover:opacity-100 hidden md:block"></div>
    </aside>
`;

const renderSidebarHeader = () => `
    <div class="h-12 flex items-center px-4 flex-shrink-0 justify-between">
        <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition select-none">
            <img src="/images/web-app-manifest-512x512.png" alt="Logo" class="h-9 w-9 rounded-lg shadow-sm">
            <span class="text-lg font-bold text-gray-800 dark:text-white tracking-tight">Task<span class="text-blue-600 dark:text-blue-400">Mg</span></span>
        </div>
        <button id="sidebar-close-btn" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800" title="サイドバーを閉じる">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
        </button>
    </div>
`;

const createHeaderHTML = () => `
    <header class="h-12 flex items-center justify-between px-4 border-b border-white/20 dark:border-gray-800/50 flex-shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md z-[${Z_INDEX.HEADER}] relative">
        <div class="flex items-center min-w-0 flex-1 mr-4">
            <button id="sidebar-open-btn" class="mr-2 text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
            <div id="workspace-dropdown" class="relative inline-block text-left mr-3 z-[${Z_INDEX.DROPDOWN}]">
                <button id="workspace-trigger" class="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1 focus:outline-none group">
                    <span id="workspace-label" class="text-sm font-bold text-gray-800 dark:text-gray-200 max-w-[140px] truncate">読み込み中...</span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="workspace-menu" class="absolute left-0 mt-2 w-60 origin-top-left rounded-lg shadow-2xl bg-white dark:bg-gray-800 ring-1 ring-black/5 opacity-0 invisible scale-95 transition-all duration-150 transform pointer-events-none border border-gray-100 dark:border-gray-700 z-50">
                    <div class="py-1 max-h-[300px] overflow-y-auto custom-scrollbar bg-white dark:bg-gray-800" id="workspace-list"></div>
                    <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <div class="py-1 bg-white dark:bg-gray-800">
                        <button id="add-workspace-btn" class="flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            ワークスペースを追加
                        </button>
                    </div>
                </div>
            </div>
            <h2 id="header-title" class="text-base font-medium truncate text-gray-600 dark:text-gray-300 border-l border-gray-300 dark:border-gray-700 pl-3">インボックス</h2>
        </div>
        <div id="header-right-ui" class="flex items-center space-x-2"></div>
    </header>
`;

const createFooterHTML = () => `
    <footer class="h-12 flex items-center justify-center px-4 border-t border-white/20 dark:border-gray-800/50 flex-shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md z-[${Z_INDEX.HEADER}] relative">
        <div id="footer-add-btn-container" class="w-full h-full"></div>
        <div id="footer-input-form-container" class="hidden"></div>
    </footer>
`;

export function renderLayout() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            ${createSidebarHTML()}
            <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
                ${createHeaderHTML()}
                <div id="main-content" class="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <div class="w-full max-w-4xl mx-auto h-full flex flex-col">
                        <div id="task-view" class="w-full h-full animate-fade-in transition-opacity duration-150 flex flex-col"></div>
                        <div id="search-view" class="hidden w-full h-full animate-fade-in overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"></div>
                        <div id="dashboard-view" class="hidden w-full h-full animate-fade-in overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"></div>
                        <div id="target-dashboard-view" class="hidden w-full h-full animate-fade-in overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"></div>
                        <div id="wizard-view" class="hidden w-full h-full animate-fade-in overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"></div>
                        <div id="wiki-view" class="hidden w-full h-full animate-fade-in overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8"></div>
                    </div>
                </div>
                ${createFooterHTML()}
            </main>
        </div>
        <div id="modal-container" class="z-[${Z_INDEX.MODAL}] relative"></div>
    `;

    requestAnimationFrame(() => {
        // 未使用の main 引数を削除
        setupResizer(document.getElementById('sidebar'), document.getElementById('sidebar-resizer'));
        initWorkspaceDropdown();
        setupGlobalShortcuts();
    });
}

function setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
        const isInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('[contenteditable]');
        const hasModal = document.querySelector('[role="dialog"]');

        if (e.key === '/' && !isInput && !hasModal) {
            const searchInput = document.getElementById('page-search-input');
            if (searchInput) {
                e.preventDefault();
                searchInput.focus();
            }
        }
    });
}