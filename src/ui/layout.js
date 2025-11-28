/**
 * アプリケーションのHTML構造をレンダリングする
 * @param {HTMLElement} appContainer - 描画対象のコンテナ (div#app)
 */
export function renderLayout(appContainer) {
    if (!appContainer) return;

    appContainer.innerHTML = `
    <!-- ヘッダー -->
    <header class="bg-white dark:bg-gray-800 shadow-sm z-10 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div class="flex items-center">
                <i class="fas fa-check-double text-blue-600 dark:text-blue-400 text-xl mr-2"></i>
                <h1 class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">mytask</h1>
            </div>
            <div class="flex-1 max-w-lg mx-4 hidden md:block">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><i class="fas fa-search text-gray-400 dark:text-gray-500"></i></span>
                    <input type="text" id="search-input" class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-white dark:focus:bg-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out" placeholder="検索...">
                </div>
            </div>
            <div id="auth-ui" class="flex items-center space-x-4">
                <button id="theme-toggle-btn" class="text-gray-400 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-300 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="テーマ切り替え">
                    <i id="theme-toggle-icon" class="fas fa-sun fa-lg"></i>
                </button>

                <div id="login-form-container" class="flex space-x-2">
                    <input type="email" id="email-input" placeholder="Email" class="p-1 border dark:border-gray-600 rounded text-sm w-32 md:w-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white">
                    <input type="password" id="password-input" placeholder="Pass" class="p-1 border dark:border-gray-600 rounded text-sm w-24 md:w-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-700 dark:text-white">
                    <button id="email-login-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition shadow-sm">Login</button>
                </div>
                <div id="user-info" class="hidden flex items-center space-x-3">
                    <span id="user-display-name" class="text-sm text-gray-600 dark:text-gray-300 font-medium hidden sm:inline-block"></span>
                    <button id="settings-btn" class="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="設定"><i class="fas fa-cog fa-lg"></i></button>
                    <button id="logout-btn" class="text-gray-400 hover:text-red-500 transition p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="ログアウト"><i class="fas fa-sign-out-alt fa-lg"></i></button>
                </div>
            </div>
        </div>
    </header>

    <div class="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        <!-- サイドバー -->
        <aside class="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col hidden md:flex transition-colors duration-200">
            <div class="p-4 overflow-y-auto flex-1">
                <div class="mb-6">
                    <ul class="space-y-1">
                        <li id="nav-dashboard" class="px-2 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-sm font-medium cursor-pointer flex items-center transition-colors"><i class="fas fa-chart-pie w-5 text-center mr-2 text-purple-500"></i> ダッシュボード</li>
                    </ul>
                </div>
                <div class="mb-6">
                    <div class="flex justify-between items-center mb-2 px-2">
                        <h3 class="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider">Projects</h3>
                        <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"><i class="fas fa-plus"></i></button>
                    </div>
                    <ul id="project-list" class="space-y-1"></ul>
                </div>
                <div>
                    <div class="flex justify-between items-center mb-2 px-2">
                        <h3 class="text-xs font-semibold text-gray-500 dark:text-white uppercase tracking-wider">Tags</h3>
                        <button id="add-label-btn" class="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"><i class="fas fa-plus"></i></button>
                    </div>
                    <ul id="label-list" class="space-y-1"></ul>
                </div>
            </div>
        </aside>

        <!-- メインエリア -->
        <main class="flex-1 flex flex-col bg-white dark:bg-gray-800 overflow-hidden relative transition-colors duration-200">
            <!-- ダッシュボード -->
            <div id="dashboard-view" class="hidden p-6 overflow-y-auto h-full custom-scrollbar">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">ダッシュボード</h2>
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-300 font-medium">未完了タスク</p><p id="kpi-todo" class="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">0</p></div>
                    <div class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-300 font-medium">完了済み</p><p id="kpi-done" class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">0</p></div>
                    <div class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-300 font-medium">期限切れ</p><p id="kpi-overdue" class="text-3xl font-bold text-red-500 dark:text-red-400 mt-2">0</p></div>
                    <div class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"><p class="text-sm text-gray-500 dark:text-gray-300 font-medium">今週の予定</p><p id="kpi-upcoming" class="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">0</p></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
                    <div class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"><h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">タスクステータス</h3><div class="relative h-64"><canvas id="statusChart"></canvas></div></div>
                    <div class="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm"><h3 class="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">プロジェクト別 未完了数</h3><div class="relative h-64"><canvas id="projectChart"></canvas></div></div>
                </div>
            </div>

            <!-- タスク管理 -->
            <div id="task-view" class="flex flex-col h-full overflow-hidden">
                <div class="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 flex-shrink-0">
                    <div class="flex items-center space-x-3"><h2 id="current-view-title" class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">インボックス</h2><span id="task-count-badge" class="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2.5 py-1 rounded-full font-medium">0</span></div>
                    <div class="flex items-center space-x-4">
                        <label class="flex items-center cursor-pointer group"><div class="relative"><input type="checkbox" id="show-completed-toggle" class="sr-only"><div class="w-10 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shadow-inner group-hover:bg-gray-300 dark:group-hover:bg-gray-500 transition-colors"></div><div class="dot absolute w-4 h-4 bg-white rounded-full shadow left-1 top-1 transition"></div></div><span class="ml-2 text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">完了を表示</span></label>
                        <select id="sort-select" class="text-sm border-gray-300 dark:border-gray-600 border rounded-lg p-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 shadow-sm hover:border-gray-400 transition-colors">
                            <option value="created_desc">作成日 (新しい順)</option><option value="created_asc">作成日 (古い順)</option><option value="due_asc">期限 (近い順)</option><option value="project_asc">プロジェクト名順</option>
                        </select>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-inner">
                    <div class="flex flex-col md:flex-row gap-3 mb-3">
                        <input type="text" id="task-title-input" class="flex-1 pl-4 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800" placeholder="新しいタスクを追加...">
                        <button id="add-task-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition-all transform active:scale-95 whitespace-nowrap flex items-center justify-center"><i class="fas fa-plus mr-2"></i> 追加</button>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 shadow-sm hover:border-gray-400 transition-colors"><i class="fas fa-calendar-alt text-gray-400 mr-2"></i><input type="date" id="task-due-date-input" class="text-sm text-gray-700 dark:text-gray-200 focus:outline-none bg-transparent dark:[color-scheme:dark]"></div>
                        <div class="flex-1 min-w-[200px]"><input type="text" id="task-desc-input" class="w-full text-sm bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none py-1.5 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-colors" placeholder="詳細メモを追加 (オプション)"></div>
                        <select id="task-recurrence-select" class="text-sm py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 shadow-sm hover:border-gray-400 outline-none cursor-pointer transition-colors">
                            <option value="none">🔄 繰り返しなし</option><option value="daily">毎日</option><option value="weekly">毎週</option><option value="monthly">毎月</option>
                        </select>
                    </div>
                </div>
                <div id="task-list-container" class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-50 dark:bg-gray-900"><ul id="task-list" class="space-y-2 pb-20 max-w-4xl mx-auto"><li class="text-center text-gray-400 mt-10">読み込み中...</li></ul></div>
            </div>
            <div id="toast-container" class="absolute bottom-4 right-4 space-y-2 pointer-events-none z-50"></div>
        </main>
    </div>
    `;
}