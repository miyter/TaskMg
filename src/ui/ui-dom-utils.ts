/**
 * 更新日: 2025-12-21
 * 内容: 検索ステート表示関数のエクスポート、ビルドエラーの解消
 * TypeScript化: 2025-12-29
 */
import { Project } from '../store/schema'; // Project型インポート
import { createGlassCard } from './components/glass-card';
import { DASHBOARD_CONFIG } from './features/dashboard/dashboard-constants';

/**
 * 簡易HTMLエスケープ
 */
function escapeHTML(str: string | number | null | undefined): string {
    if (str == null) return ''; // null or undefined check
    const s = String(str);
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return s.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * KPI（重要指標）アイテムのHTMLを生成
 */
export function renderKPIItem(label: string, value: string | number, id: string, colorClass: string): string {
    return createGlassCard(`
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">${escapeHTML(label)}</span>
        <span id="${id}" class="text-2xl font-bold ${colorClass} dark:text-white font-mono tracking-tight">${escapeHTML(value)}</span>
    `, DASHBOARD_CONFIG.CLASSES.KPI_CARD);
}

/**
 * ダッシュボード画面のHTML構造を生成
 */
export function buildDashboardViewHTML(): string {
    return `
        <div class="max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col overflow-hidden">
            <div class="flex-shrink-0 mb-4">
                <h2 class="font-bold text-gray-800 dark:text-white">ダッシュボード</h2>
            </div>
            <div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-4 animate-fade-in">
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
        </div>
    `;
}

/**
 * 検索画面のHTML構造を生成
 */
export function buildSearchViewHTML(projects: Project[] = []): string {
    const safeProjects = Array.isArray(projects) ? projects : [];
    const options = safeProjects.map(p => `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)}</option>`).join('');

    const formHTML = `
        <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
                <label for="page-search-input" class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">キーワード</label>
                <input type="text" id="page-search-input" placeholder="タスク名を入力..." 
                    class="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700/50 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800 dark:text-white placeholder-gray-400 text-sm">
            </div>
            <div class="md:w-1/3">
                <label for="page-search-project" class="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">プロジェクト</label>
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
        <div class="max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col">
            <div class="flex-shrink-0 mb-4">
                <h2 class="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    タスク検索
                </h2>
            </div>
            <div class="flex-shrink-0 mb-6">
                ${createGlassCard(formHTML, 'p-6')}
            </div>
            <div id="search-results-container" class="flex-1 min-h-0 overflow-y-auto custom-scrollbar"></div>
        </div>
    `;
}

/**
 * 検索画面：キーワード未入力時の空状態HTML
 */
export function buildSearchEmptyStateHTML(): string {
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
export function buildSearchNoResultsHTML(): string {
    return `
        <div class="text-center text-gray-400 py-12 flex flex-col items-center">
            <span class="text-sm">一致するタスクが見つかりませんでした</span>
        </div>
    `;
}

/**
 * 廃止済みの設定ビュー生成（互換性維持のため空文字を返す）
 */
export function buildSettingsViewHTML(): string {
    return '';
}
