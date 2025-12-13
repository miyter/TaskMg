// @ts-nocheck
import { toggleTheme, initTheme } from './theme.js';
// sidebar-utilsからリサイズ機能をインポート
import { setupResizer } from './sidebar-utils.js'; 

export function renderLayout() {
    const app = document.getElementById('app');
    if (!app) return;

    initTheme();

    // レイアウト: サイドバーとメインコンテンツをFlexboxで配置
    app.innerHTML = `
        <div class="flex h-screen w-full overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
            <!-- サイドバー -->
            <!-- ★修正: 開閉制御用にカスタムクラス 'sidebar-closed' を追加/削除する -->
            <!-- デフォルトで開いている状態のクラスを設定 -->
            <aside id="sidebar" class="flex-shrink-0 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 transition-all duration-300 group z-20 fixed md:relative h-full md:translate-x-0 -translate-x-full shadow-xl md:shadow-none" style="width: 280px;">
                <!-- ロゴエリア -->
                <div class="h-12 flex items-center px-4 flex-shrink-0 justify-between">
                    <!-- 画像ロゴに差し替え -->
                    <div class="flex items-center cursor-pointer hover:opacity-80 transition select-none">
                        <img src="public/images/TaskMg_title.png" alt="TaskMg" class="h-7 w-auto">
                    </div>
                    <!-- サイドバー閉じるボタン (モバイル/デスクトップ共通) -->
                    <button id="sidebar-close-btn" class="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800" title="サイドバーを閉じる">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                    </button>
                </div>
                
                <!-- サイドバーコンテンツ -->
                <div id="sidebar-content" class="flex-1 overflow-y-auto py-2 custom-scrollbar"></div>
                
                <!-- リサイズハンドル -->
                <div id="sidebar-resizer" class="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors z-50 opacity-0 group-hover:opacity-100"></div>
            </aside>

            <!-- メインコンテンツラッパー -->
            <main class="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 transition-colors duration-200 relative">
                <!-- ヘッダー -->
                <header class="h-12 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900 z-10">
                    <div class="flex items-center min-w-0 flex-1 mr-4">
                        <!-- サイドバーを開くボタン -->
                        <button id="sidebar-open-btn" class="mr-3 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" title="サイドバーを開く">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        </button>
                        
                        <h2 id="header-title" class="text-base font-bold truncate text-gray-800 dark:text-gray-100">インボックス</h2>
                        <span id="header-count" class="ml-2 text-xs text-gray-500 font-normal hidden sm:inline-block"></span>
                    </div>

                    <div class="flex items-center space-x-1 sm:space-x-2">
                        <!-- ソート (カスタムドロップダウンに置き換え) -->
                        <div id="custom-sort-dropdown" class="relative inline-block text-left z-10">
                            <!-- トリガー（ボタン） -->
                            <button 
                                id="sort-trigger"
                                type="button"
                                class="appearance-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 text-xs py-1.5 pl-2 pr-6 rounded cursor-pointer focus:outline-none flex items-center">
                                <span id="sort-label">作成日(新しい順)</span>
                                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                                    <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </button>

                            <!-- ドロップダウンメニュー（初期は非表示） -->
                            <div 
                                id="sort-menu"
                                class="absolute right-0 mt-2 w-[180px] origin-top-right rounded-lg shadow-lg 
                                       bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 
                                       opacity-0 invisible scale-95 transition-all duration-150 ease-out 
                                       pointer-events-none z-50">
                                <div class="py-1">
                                    <button data-value="createdAt_desc"  class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">作成日(新しい順)</button>
                                    <button data-value="createdAt_asc"   class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">作成日(古い順)</button>
                                    <button data-value="dueDate_asc"     class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">期限日(近い順)</button>
                                    <button data-value="timeBlockId_asc" class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">時間帯順</button>
                                    <button data-value="projectId_asc"   class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">プロジェクト名順</button>
                                    <button data-value="title_asc"       class="sort-option block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">タスク名順</button>
                                </div>
                            </div>
                        </div>

                        <!-- 認証UI -->
                        <div id="auth-ui" class="ml-1 flex items-center space-x-2">
                             <div id="login-form-container" class="space-x-2 flex items-center">
                                 <span class="text-xs text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">未ログイン</span>
                                 <input type="email" id="email-input" placeholder="メール" class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 border-none outline-none placeholder-gray-500 dark:text-gray-200" style="min-width: 0;">
                                 <input type="password" id="password-input" placeholder="パスワード" class="w-24 lg:w-32 bg-gray-100 dark:bg-gray-800 text-sm rounded py-1 px-2 focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 border-none outline-none placeholder-gray-500 dark:text-gray-200" style="min-width: 0;">
                                 <button id="email-login-btn" class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded shadow-md transition duration-150">ログイン</button>
                             </div>
                             <div id="user-info" class="hidden items-center space-x-2">
                                 <span id="user-display-name" class="hidden text-sm text-gray-600 dark:text-gray-300 truncate max-w-[100px]"></span>
                                 <span class="text-xs font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">ログイン中</span>
                             </div>
                        </div>
                    </div>
                </header>

                <!-- メインコンテンツエリア -->
                <div id="main-content" class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar scroll-smooth">
                    <div class="w-full max-w-4xl mx-auto">
                        <div id="task-view" class="w-full animate-fade-in transition-opacity duration-150" style="opacity: 1;"></div>
                        <div id="search-view" class="hidden w-full animate-fade-in"></div>
                        <div id="dashboard-view" class="hidden w-full animate-fade-in"></div>
                        <div id="settings-view" class="hidden w-full animate-fade-in"></div>
                    </div>
                </div>
            </main>
        </div>
        
        <div id="modal-container" class="z-50 relative"></div>
    `;

    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('main');
    const resizer = document.getElementById('sidebar-resizer');
    
    if (setupResizer) {
        setupResizer(sidebar, mainContent, resizer);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            document.getElementById('page-search-input')?.focus();
        }
    });
}