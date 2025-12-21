// @ts-nocheck
// @miyter:20251221
// 検索画面の制御ロジック（関数分割・整理版）

import { buildSearchViewHTML } from './ui-dom-utils.js';
import { filterTasks } from '../logic/search.js';
import { renderTaskList } from './task-list.js';
import { highlightSidebarItem, updateHeaderTitle, showView } from './ui-view-utils.js';

/**
 * 検索ビューを表示・セットアップする
 */
export function renderSearchPage(searchView, viewsToHide, allTasks, allProjects, currentFilter) {
    // 1. ビュー切り替え
    showView(searchView, viewsToHide);
    
    // 2. 検索フォーム描画
    searchView.innerHTML = buildSearchViewHTML(allProjects);
    
    const elements = {
        input: document.getElementById('page-search-input'),
        select: document.getElementById('page-search-project'),
        container: document.getElementById('search-results-container')
    };

    if (!elements.input || !elements.container) return;

    // 検索実行関数の定義
    const handleSearch = () => executeSearch(elements, allTasks);

    // イベントリスナー設定
    elements.input.addEventListener('input', handleSearch);
    elements.select?.addEventListener('change', handleSearch);

    // 初期化処理
    updateHeaderTitle('検索');
    // 検索画面ではサイドバーの特定の項目をハイライトしない
    highlightSidebarItem(null);

    // フォーカス
    setTimeout(() => elements.input.focus(), 0);
}

/**
 * 検索実行ロジック
 */
function executeSearch(elements, allTasks) {
    const keyword = elements.input.value.trim().toLowerCase();
    const projectId = elements.select?.value || null;

    // キーワード未入力時
    if (!keyword) {
        renderEmptyState(elements.container);
        return;
    }

    // フィルタリング実行
    const filtered = filterTasks(allTasks, {
        keyword,
        projectId,
        showCompleted: true // 将来的に設定化を検討
    });

    // 結果描画
    if (filtered.length === 0) {
        renderNoResults(elements.container);
    } else {
        renderResults(elements.container, filtered);
    }
}

/**
 * 初期状態（キーワードなし）の表示
 */
function renderEmptyState(container) {
    container.innerHTML = `
        <div class="text-center text-gray-400 py-16 flex flex-col items-center">
            <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-sm font-medium">キーワードを入力してタスクを検索</span>
        </div>
    `;
}

/**
 * 検索結果ゼロの表示
 */
function renderNoResults(container) {
    container.innerHTML = `
        <div class="text-center text-gray-400 py-12 flex flex-col items-center">
            <span class="text-sm">一致するタスクが見つかりませんでした</span>
        </div>
    `;
}

/**
 * 検索結果リストの表示
 */
function renderResults(container, tasks) {
    container.innerHTML = '';
    renderTaskList(container, tasks);
}