/**
 * 検索ビューのコントローラー
 */
import { filterTasks } from '../logic/search';
import { Project, Task } from '../store/schema';
import { clearSidebarHighlight, showView, updateHeaderTitleByFilter } from './layout/ui-view-utils';
import { renderTaskList } from './task-list';
import { buildSearchEmptyStateHTML, buildSearchNoResultsHTML, buildSearchViewHTML } from './ui-dom-utils';

interface SearchUIElements {
    input: HTMLInputElement | null;
    select: HTMLSelectElement | null;
    results: HTMLElement | null;
}

let UI: SearchUIElements = {
    input: null,
    select: null,
    results: null
};

/**
 * デバウンス関数
 */
function debounce(fn: Function, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

function cacheSearchElements(container: HTMLElement) {
    UI = {
        input: container.querySelector('#page-search-input'),
        select: container.querySelector('#page-search-project'),
        results: container.querySelector('#search-results-container')
    };
}

/**
 * 検索ビューを表示・セットアップ
 */
export function renderSearchPage(searchView: HTMLElement, viewsToHide: HTMLElement[], allTasks: Task[], allProjects: Project[], currentFilter: any): void {
    showView(searchView, viewsToHide);
    searchView.innerHTML = buildSearchViewHTML(allProjects);

    cacheSearchElements(searchView);
    if (!UI.input || !UI.results) return;

    // 検索実行にデバウンスを適用
    const onSearch = debounce(() => executeSearch(allTasks), 300);

    UI.input.addEventListener('input', onSearch as EventListener);
    UI.select?.addEventListener('change', () => executeSearch(allTasks)); // セレクトボックスは即時

    updateHeaderTitleByFilter({ type: 'search' });
    clearSidebarHighlight();

    requestAnimationFrame(() => UI.input?.focus());
}

function executeSearch(allTasks: Task[]): void {
    if (!UI.input) return;

    const keyword = UI.input.value.trim().toLowerCase();
    const projectId = UI.select?.value || null;

    if (!keyword) {
        if (UI.results) UI.results.innerHTML = buildSearchEmptyStateHTML();
        return;
    }

    const filtered = filterTasks(allTasks, {
        keywords: [keyword], // Use array for keywords in new filter logic
        projects: projectId ? [projectId] : [],
        labels: [],
        timeBlocks: [],
        durations: [],
        dates: [],
        status: []
        // projectId, showCompleted handled in filter logic via criteria object?
        // Wait, filterTasks accepts FilterConditions object.
        // My filter-parser produces { keywords: [], projects: [], ... }
        // Let's match correct structure.
    });
    // filterTasks default logic might check status. If I want showCompleted: true, 
    // I should ensure filter logic allows everything unless restricted. 
    // My previous filterTasks implementation:
    /*
        // 1. Status Check
        if (conditions.status.length > 0) ...
            if (lookingForCompleted && status !== 'completed') return false;
    */
    // If status is empty, it returns all status? 
    // "Assuming default excludes completed unless specified" -> I implemented:
    /*
            const status = task.status || 'todo';
            const lookingForCompleted = conditions.status.includes('completed');
            if (lookingForCompleted && status !== 'completed') return false;
            // 'active' or 'todo' logic could be added here if needed
            // Assuming default excludes completed unless specified...
    */
    // Wait, if status condition is EMPTY, does it include completed?
    // Reviewing `search.ts`:
    /*
        if (conditions.status.length > 0) {
            // ... logic
        }
        // If length == 0, it skips status check (returns true for this check).
        // So it includes completed if no status filter is set. This is good for "Search all".
    */

    if (filtered.length === 0) {
        if (UI.results) UI.results.innerHTML = buildSearchNoResultsHTML();
    } else {
        if (UI.results) {
            UI.results.innerHTML = '';
            renderTaskList(UI.results, filtered, [], { isSelectionMode: false, selectedIds: new Set() }, {});
        }
    }
}
