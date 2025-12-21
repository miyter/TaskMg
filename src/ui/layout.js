// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: モバイル対応（オーバーレイ）、ユーザー情報表示修正、z-index調整
 */

import { setupResizer } from './sidebar-utils.js';
import { initWorkspaceDropdown } from './components/WorkspaceDropdown.js';

/**
 * サイドバーのテンプレート
 */
const createSidebarHTML = () => `
    <!-- モバイル用オーバーレイ -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-20 hidden md:hidden transition-opacity duration-300"></div>

    <aside id="sidebar" class="flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all duration-300 group z-30 fixed md:relative h-full md:translate-x-0 -translate-x-full shadow-xl md:shadow-none" style="width: 280px;">
        <div class="h-12 flex items-center px-4 flex-shrink-0 justify-between">
            <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition select-none">
                <img src="/images/web-app-manifest-512x512.png" alt="Logo" class="h-9 w-9 rounded-lg shadow-sm">
                <span class="text-lg font-bold text-gray-800 dark:text-white tracking-tight">
                    Task<span class="text-blue-600 dark:text-blue-400">Mg</span>
                </span>
            </div>
            <button id="sidebar-close-btn" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 hidden md:block" title="サイドバーを閉じる">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
            </button>
            <button id="sidebar-close-mobile" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden" title="閉じる">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <div id="sidebar-content" class="flex-1 overflow-y-auto py-2 custom-scrollbar"></div>
        <div id="sidebar-resizer" class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100 hidden md:block"></div>
    </aside>
`;

/**
 * ヘッダーのテンプレート
 */
const createHeaderHTML = () => `
    <header class="h-12 flex items-center justify-between px-4 border-b border-white/20 dark:border-gray-800/50 flex-shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md z-10 relative">
        <div class="flex items-center min-w-0 flex-1 mr-4">
            <button id="sidebar-open-btn" class="mr-2 text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            <!-- ワークスペース -->
            <div id="workspace-dropdown" class="relative inline-block text-left mr-3 z-30">
                <button id="workspace-trigger" class="flex items-center space-x-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-1 focus:outline-none group">
                    <span id="workspace-label" class="text-sm font-bold text-gray-800 dark:text-gray-200 max-w-[140px] truncate">読み込み中...</span>
                    <svg class="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="workspace-menu" class="absolute left-0 mt-2 w-60 origin-top-left rounded-lg shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 opacity-0 invisible scale-95 transition-all duration-150 transform pointer-events-none border border-gray-100 dark:border-gray-700">
                    <div class="py-1 max-h-[300px] overflow-y-auto custom-scrollbar" id="workspace-list"></div>
                    <div class="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <div class="py-1">
                        <button id="add-workspace-btn" class="flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700/50 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            ワークスペースを追加
                        </button>
                        <button id="settings-workspace-btn" class="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                            設定
                        </button>
                    </div>
                </div>
            </div>
            
            <h2 id="header-title" class="text-base font-medium truncate text-gray-600 dark:text-gray-300 border-l border-gray-300 dark:border-gray-700 pl-3">インボックス</h2>
            <span id="header-count" class="ml-2 text-xs text-gray-500 font-normal hidden sm:inline-block"></span>
        </div>

        <div class="flex items-center space-x-2">
            <!-- ソート -->
            <div id="custom-sort-dropdown" class="relative inline-block text-left z-20">
                <button id="sort-trigger" class="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 text-xs py-1.5 pl-2 pr-6 rounded cursor-pointer focus:outline-none flex items-center transition-colors">
                    <span id="sort-label">作成日(新しい順)</span>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1">
                        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </button>
                <div id="sort-menu" class="absolute right-0 mt-2 w-[180px] origin-top-right rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black/5 opacity-0 invisible scale-95 transition-all duration-150 pointer-events-none z-50 border border-gray-100 dark:border-gray-700">
                    <div class="py-1">
                        <button data-value="createdAt_desc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">作成日(新しい順)</button>
                        <button data-value="createdAt_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">作成日(古い順)</button>
                        <button data-value="dueDate_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">期限日(近い順)</button>
                        <button data-value="timeBlockId_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">時間帯順</button>
                        <button data-value="projectId_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">プロジェクト名順</button>
                        <button data-value="title_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">タスク名順</button>
                    </div>
                </div>
            </div>

            <!-- 認証UI -->
            <div id="auth-ui" class="ml-1 flex items-center space-x-2">
                 <div id="login-form-container" class="space-x-2 flex items-center">
                     <span class="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">未ログイン</span>
                     <input type="email" id="email-input" placeholder="メール" class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 border-none outline-none placeholder-gray-500 dark:text-gray-200">
                     <input type="password" id="password-input" placeholder="パスワード" class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 border-none outline-none placeholder-gray-500 dark:text-gray-200">
                     <button id="email-login-btn" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded shadow-md transition duration-150">ログイン</button>
                 </div>
                 <!-- ユーザー情報表示エリア -->
                 <div id="user-info" class="hidden items-center space-x-2">
                     <div class="flex flex-col items-end">
                         <span class="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">ログイン中</span>
                         <span id="user-email-display" class="text-[10px] text-gray-500 dark:text-gray-400 font-mono hidden sm:block"></span>
                     </div>
                 </div>
            </div>
        </div>
    </header>
`;

/**
 * レイアウト描画
 */
export function renderLayout() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            ${createSidebarHTML()}
            
            <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
                ${createHeaderHTML()}
                
                <div id="main-content" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
                    <div class="w-full max-w-4xl mx-auto">
                        <div id="task-view" class="w-full animate-fade-in transition-opacity duration-150"></div>
                        <div id="search-view" class="hidden w-full animate-fade-in"></div>
                        <div id="dashboard-view" class="hidden w-full animate-fade-in"></div>
                        <div id="settings-view" class="hidden w-full animate-fade-in"></div>
                    </div>
                </div>
            </main>
        </div>
        <!-- モーダルコンテナ (z-index管理のため最前面に配置) -->
        <div id="modal-container" class="z-50 relative"></div>
    `;

    // 初期化処理の実行
    setupResizer(document.getElementById('sidebar'), document.querySelector('main'), document.getElementById('sidebar-resizer'));
    initWorkspaceDropdown();
    setupGlobalShortcuts();
    setupMobileSidebarOverlay();
}

/**
 * モバイル用サイドバーオーバーレイのイベント設定
 */
function setupMobileSidebarOverlay() {
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('sidebar-close-mobile');

    // オーバーレイクリックで閉じる
    overlay?.addEventListener('click', () => {
        if (!sidebar.classList.contains('-translate-x-full')) {
            document.getElementById('sidebar-close-btn')?.click(); // 既存のトグルロジックを利用
        }
    });

    // モバイル閉じるボタン
    closeBtn?.addEventListener('click', () => {
        document.getElementById('sidebar-close-btn')?.click();
    });

    // サイドバーの開閉を監視してオーバーレイを表示/非表示（MutationObserver）
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const isClosed = sidebar.classList.contains('-translate-x-full');
                if (!isClosed) {
                    overlay?.classList.remove('hidden');
                } else {
                    overlay?.classList.add('hidden');
                }
            }
        });
    });
    
    if (sidebar) observer.observe(sidebar, { attributes: true });
}

/**
 * 全局ショートカットの設定
 */
function setupGlobalShortcuts() {
    document.addEventListener('keydown', (e) => {
        // 「/」キーで検索フォーカス
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            e.preventDefault();
            document.getElementById('page-search-input')?.focus();
        }
    });
}