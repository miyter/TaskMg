// @ts-nocheck
// UI要素のHTMLスニペットを生成するユーティリティ関数

/**
 * KPIカードのHTMLを生成する。
 * @param {string} title - カードのタイトル
 * @param {string} id - 値を表示する要素のID
 * @param {string} colors - Tailwind CSSのカラースタイル
 * @returns {string} KPIカードのHTML文字列
 */
export function renderKPIItem(title, id, colors) {
    return `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">${title}</span>
            <span id="${id}" class="text-2xl font-bold ${colors} px-3 py-1 rounded-lg">0</span>
        </div>
    `;
}

/**
 * 設定画面のHTML構造全体を生成する。
 * @returns {string} 設定画面のHTML文字列
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

/**
 * ダッシュボード画面のHTML構造全体を生成する。
 * @param {function} renderKPIItemFn - KPIアイテムのHTMLを生成する関数
 * @returns {string} ダッシュボード画面のHTML文字列
 */
export function buildDashboardViewHTML(renderKPIItemFn) {
    return `
        <div class="space-y-6">
            <!-- KPI -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${renderKPIItemFn('未完了タスク', 'kpi-todo', 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400')}
                ${renderKPIItemFn('完了タスク', 'kpi-done', 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400')}
                ${renderKPIItemFn('期限切れ', 'kpi-overdue', 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400')}
                ${renderKPIItemFn('今週の予定', 'kpi-upcoming', 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- ステータス別グラフ -->
                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                    <h3 class="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">ステータス別</h3>
                    <div class="h-64">
                        <canvas id="statusChart"></canvas>
                    </div>
                </div>
                <!-- プロジェクト別グラフ -->
                <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                    <h3 class="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">プロジェクト別（未完了）</h3>
                    <div class="h-64">
                        <canvas id="projectChart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    `;
}