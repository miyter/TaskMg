/**
 * 更新日: 2025-12-21
 * 内容: DOMキャッシュ、テンプレート分離、ハイライト制御の改善
 */
import { buildSearchViewHTML, buildSearchEmptyStateHTML, buildSearchNoResultsHTML } from './ui-dom-utils.js';
import { filterTasks } from '../logic/search.js';
import { renderTaskList } from './task-list.js';
import { clearSidebarHighlight, updateHeaderTitleByFilter, showView } from './ui-view-utils.js';

let UI = {};

function cacheSearchElements(container) {
    UI = {
        input: container.querySelector('#page-search-input'),
        select: container.querySelector('#page-search-project'),
        results: container.querySelector('#search-results-container')
    };
}

/**
 * 検索ビューを表示・セットアップ
 */
export function renderSearchPage(searchView, viewsToHide, allTasks, allProjects, currentFilter) {
    showView(searchView, viewsToHide);
    searchView.innerHTML = buildSearchViewHTML(allProjects);
    
    cacheSearchElements(searchView);
    if (!UI.input || !UI.results) return;

    const onSearch = () => executeSearch(allTasks);

    UI.input.addEventListener('input', onSearch);
    UI.select?.addEventListener('change', onSearch);

    updateHeaderTitleByFilter({ type: 'search' });
    clearSidebarHighlight();

    // フォーカス（タイミング依存を避ける）
    requestAnimationFrame(() => UI.input.focus());
}

function executeSearch(allTasks) {
    const keyword = UI.input.value.trim().toLowerCase();
    const projectId = UI.select?.value || null;

    if (!keyword) {
        UI.results.innerHTML = buildSearchEmptyStateHTML();
        return;
    }

    const filtered = filterTasks(allTasks, {
        keyword,
        projectId,
        showCompleted: true // 将来的に設定ストアから取得可能にする
    });

    if (filtered.length === 0) {
        UI.results.innerHTML = buildSearchNoResultsHTML();
    } else {
        UI.results.innerHTML = '';
        renderTaskList(UI.results, filtered);
    }
}