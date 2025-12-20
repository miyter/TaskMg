// @ts-nocheck
// @miyter:20251221
// 検索画面の制御ロジック

import { buildSearchViewHTML } from './ui-dom-utils.js';
import { filterTasks } from '../logic/search.js';
import { renderTaskList } from './task-list.js';
import { highlightSidebarItem, updateHeaderTitle, showView } from './ui-view-utils.js';

/**
 * 検索ビューを表示・セットアップする
 * @param {HTMLElement} searchView - 検索ビューのコンテナ
 * @param {HTMLElement[]} viewsToHide - 非表示にする他のビュー
 * @param {Array} allTasks - 全タスクデータ
 * @param {Array} allProjects - 全プロジェクトデータ
 * @param {Object} currentFilter - 現在のフィルター状態
 */
export function renderSearchPage(searchView, viewsToHide, allTasks, allProjects, currentFilter) {
    // 1. 他のビューを非表示にし、検索ビューを表示
    showView(searchView, viewsToHide);
    
    // 2. 検索フォームの基本構造を描画
    searchView.innerHTML = buildSearchViewHTML(allProjects);
    
    const searchInput = document.getElementById('page-search-input');
    const projectSelect = document.getElementById('page-search-project');
    const resultsContainer = document.getElementById('search-results-container');

    if (!searchInput || !resultsContainer) return;

    // 検索実行ロジック（UI更新）
    const performSearch = () => {
        const keyword = searchInput.value.trim().toLowerCase();
        const projectId = projectSelect?.value || null;

        // キーワードが空の場合は初期表示に戻す
        if (!keyword) {
            resultsContainer.innerHTML = `
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm font-medium">キーワードを入力してタスクを検索</span>
                </div>
            `;
            return;
        }

        // ロジック層のフィルタリング機能を呼び出し
        const filtered = filterTasks(allTasks, {
            keyword,
            projectId,
            showCompleted: true // 検索時は完了済みも含めて探せるようにする
        });

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center text-gray-400 py-12 flex flex-col items-center">
                    <span class="text-sm">一致するタスクが見つかりませんでした</span>
                </div>
            `;
        } else {
            // 結果を表示（renderTaskListに委譲）
            resultsContainer.innerHTML = ''; 
            renderTaskList(resultsContainer, filtered);
        }
    };

    // イベントリスナーの設定
    searchInput.addEventListener('input', performSearch);
    projectSelect?.addEventListener('change', performSearch);

    // 初期状態の反映
    updateHeaderTitle('検索');
    highlightSidebarItem(currentFilter);

    // ページ遷移直後にフォーカス
    requestAnimationFrame(() => searchInput.focus());
}