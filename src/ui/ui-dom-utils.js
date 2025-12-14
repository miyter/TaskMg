// @ts-nocheck
// UI要素のHTMLスニペットを生成するユーティリティ関数
import { createGlassCard } from './components/glass-card.js';

/**
 * ダッシュボード画面のHTML構造全体を生成する。
 * Glassmorphism化されたサマリーカードとグラフカードを含む
 */
export function buildDashboardViewHTML() {
    // 0. サマリーカードのHTML生成ヘルパー
    const createSummaryItem = (id, label, textColorClass) => `
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">${label}</span>
        <span id="${id}" class="text-2xl font-bold ${textColorClass} dark:text-white font-mono tracking-tight">-</span>
    `;

    // 1. 直近4日間の完了数 (日次)
    const dailyChartHTML = `
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 日次推移 (直近4日)
        </h3>
        <div class="relative flex-1 min-h-0 w-full">
            <canvas id="dailyChart"></canvas>
        </div>
    `;

    // 2. 直近4週間の完了数 (週次)
    const weeklyChartHTML = `
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> 週次推移
        </h3>
        <div class="relative flex-1 min-h-0 w-full">
            <canvas id="weeklyChart"></canvas>
        </div>
    `;

    // 3. 直近4ヶ月の完了数 (月次)
    const monthlyChartHTML = `
        <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 月次推移
        </h3>
        <div class="relative flex-1 min-h-0 w-full">
            <canvas id="monthlyChart"></canvas>
        </div>
    `;

    return `
        <div class="space-y-4 animate-fade-in p-1">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white px-1 mb-2">ダッシュボード</h2>

            <!-- 1. サマリーカードエリア -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                ${createGlassCard(createSummaryItem('today-count', '今日の完了', 'text-blue-600'), 'p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform')}
                ${createGlassCard(createSummaryItem('weekly-count', '今週の完了', 'text-green-600'), 'p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform')}
                ${createGlassCard(createSummaryItem('monthly-count', '今月の完了', 'text-purple-600'), 'p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform')}
                ${createGlassCard(createSummaryItem('total-count', '全期間', 'text-gray-600'), 'p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform')}
            </div>

            <!-- 2. グラフエリア (Grid & 高さ統一) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${createGlassCard(dailyChartHTML, 'p-3 h-64 flex flex-col')}
                ${createGlassCard(weeklyChartHTML, 'p-3 h-64 flex flex-col')}
            </div>
            
            <!-- 3. 月次 (下部配置) -->
            ${createGlassCard(monthlyChartHTML, 'p-3 h-64 flex flex-col')}
        </div>
    `;
}

/**
 * 検索画面のHTML構造を生成する
 * @param {Array} projects - プロジェクトリスト
 */
export function buildSearchViewHTML(projects) {
    const options = projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    
    // 検索フォームの中身
    const searchFormHTML = `
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
    `;

    return `
        <div class="max-w-3xl mx-auto mt-4">
            <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2 px-1">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                タスク検索
            </h2>
            
            <!-- 共通GlassCardを使用 -->
            ${createGlassCard(searchFormHTML, 'p-8 mb-8')}

            <div id="search-results-container">
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * KPIカード (互換性維持)
 */
export function renderKPIItem(title, id, colors) {
    return ''; 
}

/**
 * 設定画面のHTML構造全体を生成する。
 */
export function buildSettingsViewHTML() {
    // パスワード設定の中身
    const passwordHTML = `
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
    `;

    // データエクスポートの中身
    const exportHTML = `
        <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">データ管理</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">現在のすべてのタスク、プロジェクト、ラベルをJSONファイルとしてダウンロードします。</p>
        <button id="export-data-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
            データのエクスポート
        </button>
    `;

    return `
        <div class="space-y-6">
            <!-- 共通GlassCardを使用 -->
            ${createGlassCard(passwordHTML, 'p-6')}
            ${createGlassCard(exportHTML, 'p-6')}
        </div>
    `;
}