import { renderSidebar } from './sidebar.js';
import { toggleTheme, initTheme } from './theme.js';

export function renderLayout() {
    const app = document.getElementById('app');
    if (!app) return;

    initTheme();

    // 以前の固定幅クラス (w-[280px]) を削除し、インラインスタイルで幅を制御
    // リサイズハンドル (#sidebar-resizer) を追加
    app.innerHTML = `
        <aside id="sidebar" class="hidden md:flex flex-col flex-shrink-0 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transition-colors duration-200 relative group" style="width: 280px;">
            <!-- ロゴ -->
            <div class="h-[48px] flex items-center px-4 flex-shrink-0">
                <div class="flex items-center text-blue-600 dark:text-blue-400 font-bold text-lg cursor-pointer hover:opacity-80 transition select-none">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    mytask
                </div>
            </div>
            
            <!-- コンテンツ -->
            <div id="sidebar-content" class="flex-1 overflow-y-auto py-2 custom-scrollbar"></div>
            
            <!-- フッター -->
            <div class="p-3 border-t border-gray-200 dark:border-gray-800">
                <button id="settings-btn" class="w-full text-left px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition flex items-center">
                   <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   設定
                </button>
            </div>

            <!-- リサイズハンドル -->
            <div id="sidebar-resizer" class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"></div>
        </aside>

        <!-- メインエリア -->
        <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200">
            <!-- ヘッダー -->
            <header class="h-[48px] flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900 z-10">
                <div class="flex items-center min-w-0 flex-1 mr-4">
                    <button class="md:hidden mr-2 text-gray-500 hover:text-gray-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h2 id="header-title" class="text-base font-bold truncate text-gray-800 dark:text-gray-100">インボックス</h2>
                    <span id="header-count" class="ml-2 text-xs text-gray-500 font-normal hidden sm:inline-block"></span>
                </div>

                <div class="flex items-center space-x-1 sm:space-x-2">
                    <div class="relative group hidden sm:block">
                        <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <svg class="h-4 w-4 text-gray-400 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></path></svg>
                        </div>
                        <input type="text" id="search-input" placeholder="検索 (/)" 
                               class="w-32 lg:w-48 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 pl-8 pr-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 border-none outline-none placeholder-gray-500 dark:text-gray-200">
                    </div>
                    <div class="relative">
                        <select id="sort-select" class="appearance-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 text-xs py-1.5 pl-2 pr-6 rounded cursor-pointer focus:outline-none">
                            <option value="createdAt_desc">作成日(新しい順)</option>
                            <option value="createdAt_asc">作成日(古い順)</option>
                            <option value="dueDate_asc">期限日(近い順)</option>
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    <button id="toggle-completed-btn" class="p-1.5 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="完了タスク表示切替">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button>
                    <button id="theme-toggle" class="p-1.5 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <svg id="theme-icon-moon" class="w-4 h-4 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        <svg id="theme-icon-sun" class="w-4 h-4 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    </button>
                    
                    <!-- ★追加: ログイン/ログアウトUIコンテナ -->
                    <div id="auth-ui" class="ml-1 flex items-center space-x-2">
                        <!-- ログアウト状態の時に表示されるログインフォーム -->
                        <div id="login-form-container" class="space-x-2 flex items-center">
                            <input type="email" id="email-input" placeholder="メール"
                                class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 border-none outline-none placeholder-gray-500 dark:text-gray-200" style="min-width: 0;">
                            <input type="password" id="password-input" placeholder="パスワード"
                                class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 border-none outline-none placeholder-gray-500 dark:text-gray-200" style="min-width: 0;">
                            <button id="email-login-btn" 
                                    class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded shadow-md transition duration-150">
                                ログイン
                            </button>
                        </div>

                        <!-- ログイン状態の時に表示 -->
                        <div id="user-info" class="hidden flex items-center space-x-2">
                            <span id="user-display-name" class="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px]"></span>
                            <button id="logout-btn" 
                                    class="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-3 rounded shadow-md transition duration-150">
                                ログアウト
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div id="main-content" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:px-10 lg:py-6 custom-scrollbar scroll-smooth">
                <div id="task-view" class="max-w-3xl mx-auto w-full animate-fade-in"></div>
                <div id="dashboard-view" class="hidden max-w-4xl mx-auto w-full animate-fade-in"></div>
                <div id="settings-view" class="hidden max-w-2xl mx-auto w-full animate-fade-in"></div>
            </div>
        </main>
        
        <div id="modal-container" class="z-50 relative"></div>
    `;

    renderSidebar();
    enableSidebarResize(); // リサイズ機能有効化
    
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            document.getElementById('search-input')?.focus();
        }
    });
}

// サイドバーリサイズロジック
function enableSidebarResize() {
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');
    if (!sidebar || !resizer) return;

    let isResizing = false;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.classList.add('select-none'); // 選択防止
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const newWidth = e.clientX;
        if (newWidth > 150 && newWidth < 500) { // 最小/最大幅制限
            sidebar.style.width = `${newWidth}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.classList.remove('select-none');
        }
    });
}