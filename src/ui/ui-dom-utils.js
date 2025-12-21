/**
 * 更新日: 2025-12-21
 * 内容: 検索ステート表示関数のエクスポート、ビルドエラーの解消
 */
import { createGlassCard } from './components/glass-card.js';
import { DASHBOARD_CONFIG } from './dashboard-constants.js';

/**
 * 簡易HTMLエスケープ
 */
function escapeHTML(str) {
    if (!str) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * KPI（重要指標）アイテムのHTMLを生成
 */
export function renderKPIItem(label, value, id, colorClass) {
    return createGlassCard(`
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">${escapeHTML(label)}</span>
        <span id="${id}" class="text-2xl font-bold ${colorClass} dark:text-white font-mono tracking-tight">${escapeHTML(value)}</span>
    `, DASHBOARD_CONFIG.CLASSES.KPI_CARD);
}

/**
 * ダッシュボード画面のHTML構造を生成
 */
export function buildDashboardViewHTML() {
    return `
        <div class="space-y-4 animate-fade-in p-1">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white px-1 mb-2">ダッシュボード</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                ${DASHBOARD_CONFIG.KPI_ITEMS.map(item => renderKPIItem(item.label, '-', item.id, item.color)).join('')}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${DASHBOARD_CONFIG.CHARTS.map(chart => createGlassCard(`
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full ${chart.dot}"></span> ${escapeHTML(chart.label)}
                    </h3>
                    <div class="${DASHBOARD_CONFIG.CLASSES.CHART_CONTAINER}">
                        <canvas id="${chart.id}Chart"></canvas>
                    </div>
                `, `${DASHBOARD_CONFIG.CLASSES.CHART_CARD} ${chart.fullWidth ? 'md:col-span-2' : ''}`)).join('')}
            </div>
        </div>
    `;
}

/**
 * 検索画面のHTML構造を生成
 */
export function buildSearchViewHTML(projects = []) {
    const safeProjects = Array.isArray(projects) ? projects : [];
    const options = safeProjects.map(p => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join('');
    
    const formHTML = `
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">キーワード</label>
                <input type="text" id="page-search-input" placeholder="タスク名を入力..." 
                    class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm">
            </div>
            <div class="md:w-1/3">
                <label class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">プロジェクト</label>
                <div class="relative">
                    <select id="page-search-project" class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white text-sm appearance-none cursor-pointer">
                        <option value="">全てのプロジェクト</option>
                        ${options}
                    </select>
                </div>
            </div>
        </div>
    `;

    return `
        <div class="max-w-3xl mx-auto mt-4">
            <h2 class="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2 px-1">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                タスク検索
            </h2>
            ${createGlassCard(formHTML, 'p-8 mb-8')}
            <div id="search-results-container"></div>
        </div>
    `;
}

/**
 * 検索画面：キーワード未入力時の空状態HTML
 */
export function buildSearchEmptyStateHTML() {
    return `
        <div class="text-center text-gray-400 py-16 flex flex-col items-center">
            <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="text-sm font-medium">キーワードを入力してタスクを検索</span>
        </div>
    `;
}

/**
 * 検索画面：結果ゼロ時のHTML
 */
export function buildSearchNoResultsHTML() {
    return `
        <div class="text-center text-gray-400 py-12 flex flex-col items-center">
            <span class="text-sm">一致するタスクが見つかりませんでした</span>
        </div>
    `;
}

/**
 * 廃止済みの設定ビュー生成（互換性維持のため空文字を返す）
 */
export function buildSettingsViewHTML() {
    return ''; 
}