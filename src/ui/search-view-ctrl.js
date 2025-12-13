// @ts-nocheck
// 検索画面の制御ロジック

import { buildSearchViewHTML } from './ui-dom-utils.js';
import { filterTasks } from '../logic/search.js';
import { renderTaskList } from './task-list.js';
import { highlightSidebarItem, updateHeaderTitle, showView } from './ui-view-utils.js';

/**
 * 検索ビューを表示・セットアップする
 */
export function renderSearchPage(searchView, viewsToHide, allTasks, allProjects, currentFilter) {
    showView(searchView, viewsToHide);
    
    // 検索画面を描画
    searchView.innerHTML = buildSearchViewHTML(allProjects);
    
    const searchInput = document.getElementById('page-search-input');
    const projectSelect = document.getElementById('page-search-project');
    const resultsContainer = document.getElementById('search-results-container');

    // 自動フォーカス
    searchInput?.focus();

    // 検索実行関数
    const performSearch = () => {
        const keyword = searchInput.value.trim();
        const projectId = projectSelect.value;

        if (!keyword) {
            resultsContainer.innerHTML = `
                <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                    <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <span class="text-sm">キーワードを入力してタスクを検索</span>
                </div>
            `;
            return;
        }

        const filtered = filterTasks(allTasks, {
            keyword: keyword,
            projectId: projectId || null,
            showCompleted: true
        });

        if (filtered.length === 0) {
            resultsContainer.innerHTML = `<div class="text-center text-gray-400 py-10">該当するタスクが見つかりませんでした</div>`;
        } else {
            resultsContainer.innerHTML = ''; // クリア
            renderTaskList(resultsContainer, filtered);
        }
    };

    // イベントリスナー
    searchInput?.addEventListener('input', performSearch);
    projectSelect?.addEventListener('change', performSearch);

    updateHeaderTitle('検索');
    highlightSidebarItem(currentFilter);
}