/**
 * 検索ビューのコントローラー
 */
import { buildSearchViewHTML, buildSearchEmptyStateHTML, buildSearchNoResultsHTML } from './ui-dom-utils';
import { filterTasks } from '../logic/search.js';
import { renderTaskList } from './task-list.js';
import { clearSidebarHighlight, updateHeaderTitleByFilter, showView } from './layout/ui-view-utils.js';

let UI = {};

/**
 * デバウンス関数
 */
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

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

    // 検索実行にデバウンスを適用
    const onSearch = debounce(() => executeSearch(allTasks), 300);

    UI.input.addEventListener('input', onSearch);
    UI.select?.addEventListener('change', () => executeSearch(allTasks)); // セレクトボックスは即時

    updateHeaderTitleByFilter({ type: 'search' });
    clearSidebarHighlight();

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
        showCompleted: true
    });

    if (filtered.length === 0) {
        UI.results.innerHTML = buildSearchNoResultsHTML();
    } else {
        UI.results.innerHTML = '';
        renderTaskList(UI.results, filtered);
    }
}