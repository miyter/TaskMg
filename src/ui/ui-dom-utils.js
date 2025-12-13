// @ts-nocheck
// UI要素のHTMLスニペットを生成するユーティリティ関数

/**
 * ダッシュボード画面のHTML構造全体を生成する。
 */
export function buildDashboardViewHTML() {
    return `
        <div class="space-y-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white px-1">ダッシュボード</h2>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- 1. 直近4日間の完了数 -->
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <span class="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-1.5 rounded-lg mr-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </span>
                        日次完了数 (直近4日)
                    </h3>
                    <div class="h-64 relative w-full">
                        <canvas id="dailyChart"></canvas>
                    </div>
                </div>

                <!-- 2. 直近4週間の完了数 -->
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <span class="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-1.5 rounded-lg mr-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        </span>
                        週間完了数 (直近4週 / 日曜起算)
                    </h3>
                    <div class="h-64 relative w-full">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>

                <!-- 3. 直近4ヶ月の完了数 -->
                <div class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow border border-gray-100 dark:border-gray-700 lg:col-span-2">
                    <h3 class="text-md font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                        <span class="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-1.5 rounded-lg mr-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        </span>
                        月次完了数 (直近4ヶ月)
                    </h3>
                    <div class="h-64 relative w-full">
                        <canvas id="monthlyChart"></canvas>
                    </div>
                </div>

            </div>
        </div>
    `;
}

/**
 * 検索画面のHTML構造を生成する
 * @param {Array} projects - プロジェクトリスト
 */
export function buildSearchViewHTML(projects) {
    const options = projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    
    return `
        <div class="max-w-3xl mx-auto mt-4">
            <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2 px-1">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                タスク検索
            </h2>
            
            <div class="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 dark:border-gray-800/30 mb-8">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">キーワード</label>
                        <input type="text" id="page-search-input" placeholder="タスク名を入力..." 
                            class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400 transition-colors text-sm">
                    </div>
                    <div class="md:w-1/3">
                        <label class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">プロジェクト</label>
                        <select id="page-search-project" 
                            class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white transition-colors text-sm appearance-none cursor-pointer">
                            <option value="">全てのプロジェクト</option>
                            ${options}
                        </select>
                    </div>
                </div>
            </div>

            <div id="search-results-container">
                <!-- 検索結果がここに表示されます -->
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * KPIカードのHTMLを生成する
 */
export function renderKPIItem(title, id, colors) {
    // 互換性のため残置
    return ''; 
}

/**
 * 設定画面のHTML構造全体を生成する。
 */
export function buildSettingsViewHTML() {
    return `
        <div class="space-y-6">
            <!-- パスワード更新 -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">アカウント設定</h3>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新しいパスワード (6文字以上)</label>
                        <input type="password" id="new-password-input" placeholder="新しいパスワード"
                            class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-100">
                    </div>
                    <button id="update-password-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
                        パスワードを更新
                    </button>
                </div>
            </div>

            <!-- データエクスポート -->
            <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">データ管理</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">現在のすべてのタスク、プロジェクト、ラベルをJSONファイルとしてダウンロードします。</p>
                <button id="export-data-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
                    データのエクスポート
                </button>
            </div>
        </div>
    `;
}