// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 設定ビューの廃止（モーダル統一）、検索ビューの安全性向上
 */

import { createGlassCard } from './components/glass-card.js';

/**
 * KPI（重要指標）アイテムのHTMLを生成
 */
export function renderKPIItem(label, value, id, colorClass) {
    return createGlassCard(`
        <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">${label}</span>
        <span id="${id}" class="text-2xl font-bold ${colorClass} dark:text-white font-mono tracking-tight">${value}</span>
    `, 'p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform');
}

/**
 * ダッシュボード画面のHTML構造を生成
 */
export function buildDashboardViewHTML(kpiRenderer) {
    const summaryItems = [
        { id: 'today-count', label: '今日の完了', color: 'text-blue-600' },
        { id: 'weekly-count', label: '今週の完了', color: 'text-green-600' },
        { id: 'monthly-count', label: '今月の完了', color: 'text-purple-600' },
        { id: 'total-count', label: '全期間', color: 'text-gray-600' }
    ];

    const charts = [
        { id: 'daily', label: '日次推移 (直近7日)', dot: 'bg-blue-500' },
        { id: 'weekly', label: '週次推移', dot: 'bg-green-500' },
        { id: 'monthly', label: '月次推移', dot: 'bg-purple-500', fullWidth: true }
    ];

    const renderer = typeof kpiRenderer === 'function' ? kpiRenderer : renderKPIItem;

    return `
        <div class="space-y-4 animate-fade-in p-1">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white px-1 mb-2">ダッシュボード</h2>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                ${summaryItems.map(item => renderer(item.label, '-', item.id, item.color)).join('')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${charts.map(chart => createGlassCard(`
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full ${chart.dot}"></span> ${chart.label}
                    </h3>
                    <div class="relative flex-1 min-h-0 w-full">
                        <canvas id="${chart.id}Chart"></canvas>
                    </div>
                `, `p-3 h-64 flex flex-col ${chart.fullWidth ? 'md:col-span-2' : ''}`)).join('')}
            </div>
        </div>
    `;
}

/**
 * 検索画面のHTML構造を生成
 * 引数が空でもエラーにならないようにガード
 */
export function buildSearchViewHTML(projects = []) {
    const safeProjects = Array.isArray(projects) ? projects : [];
    const options = safeProjects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    
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
            <div id="search-results-container">
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * 古い設定ビュー生成関数（廃止）
 * ui-view-manager.js の修正により呼び出されなくなる想定だが、
 * 安全のため空文字を返すように変更
 */
export function buildSettingsViewHTML() {
    return ''; 
}