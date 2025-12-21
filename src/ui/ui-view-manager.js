/**
 * 更新日: 2025-12-21
 * 内容: DOMキャッシュ化、副作用の統合、定数連携、フリッカー抑制の簡略化
 */
import { UI_VIEW_CONFIG } from './ui-view-constants.js';
import { renderDashboard } from './dashboard.js';
import { renderTaskView } from './task-view.js';
import { getProcessedTasks } from '../logic/search.js';
import { buildDashboardViewHTML } from './ui-dom-utils.js';
import { showView, highlightSidebarItem, updateHeaderTitleByFilter } from './ui-view-utils.js';
import { renderSearchPage } from './search-view-ctrl.js';
import { showSettingsModal } from './settings.js';

let currentFilter = { type: 'inbox', id: null };
let UI = {};

function cacheViews() {
    const { VIEW_IDS } = UI_VIEW_CONFIG;
    UI = {
        task: document.getElementById(VIEW_IDS.TASK),
        dashboard: document.getElementById(VIEW_IDS.DASHBOARD),
        search: document.getElementById(VIEW_IDS.SEARCH),
        settings: document.getElementById(VIEW_IDS.SETTINGS)
    };
}

/**
 * フィルター更新 + UI同期
 */
export function setCurrentFilter(filter, allProjects = [], allLabels = []) {
    currentFilter = filter;
    
    // 設定遷移のインターセプト
    if (filter.type === 'settings') {
        currentFilter = { type: 'inbox', id: null };
        showSettingsModal();
    }

    highlightSidebarItem(currentFilter);
    updateHeaderTitleByFilter(currentFilter, allProjects, allLabels);
}

export function getCurrentFilter() {
    return currentFilter;
}

export function updateView(allTasks, allProjects, allLabels) {
    if (Object.keys(UI).length === 0) cacheViews();
    if (!UI.task || !UI.dashboard || !UI.search) return;

    const sortTrigger = document.getElementById('sort-trigger');
    const sortCriteria = sortTrigger?.dataset.value || 'createdAt_desc';
    const otherViews = [UI.task, UI.dashboard, UI.search, UI.settings].filter(v => !!v);

    // 1. ダッシュボード
    if (currentFilter.type === 'dashboard') {
        showView(UI.dashboard, otherViews.filter(v => v !== UI.dashboard));
        UI.dashboard.innerHTML = buildDashboardViewHTML();
        renderDashboard(allTasks, allProjects);
        return;
    }
    
    // 2. 検索
    if (currentFilter.type === 'search') {
        renderSearchPage(UI.search, otherViews.filter(v => v !== UI.search), allTasks, allProjects, currentFilter);
        return;
    }

    // 3. タスクリスト
    showView(UI.task, otherViews.filter(v => v !== UI.task));
    const showCompleted = document.getElementById('toggle-completed-btn')?.classList.contains('text-blue-500') || false;

    const config = {
        keyword: '', 
        showCompleted,
        projectId: currentFilter.type === 'project' ? currentFilter.id : null,
        labelId: currentFilter.type === 'label' ? currentFilter.id : null,
        timeBlockId: currentFilter.type === 'timeblock' ? currentFilter.id : null,
        duration: currentFilter.type === 'duration' ? currentFilter.id : null,
        sortCriteria
    };

    const processedTasks = getProcessedTasks(allTasks, config);

    // 描画
    UI.task.style.opacity = '0.5'; 
    renderTaskView(processedTasks, allProjects, allLabels, config.projectId, config.labelId);
    UI.task.style.opacity = '1';
}