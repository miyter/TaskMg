// @ts-nocheck
// ビューの表示制御 - エントリーポイント

import { renderDashboard } from './dashboard.js';
import { renderTaskView } from './task-view.js';
import { initSettings } from './settings.js';
import { filterTasks } from '../logic/search.js';
import { 
    buildDashboardViewHTML, 
    buildSettingsViewHTML, 
    renderKPIItem 
} from './ui-dom-utils.js';

// 分割したモジュールをインポート
import { 
    showView, 
    highlightSidebarItem, 
    updateHeaderTitle, 
    updateHeaderTitleByFilter,
    renderLoginState // エクスポートしておく
} from './ui-view-utils.js';
import { renderSearchPage } from './search-view-ctrl.js';

let currentFilter = { type: 'inbox', id: null };

export function setCurrentFilter(filter) {
    currentFilter = filter;
}

export function getCurrentFilter() {
    return currentFilter;
}

// renderLoginStateを再エクスポートして互換性を維持
export { renderLoginState };

/**
 * ビューを切り替えて描画を行う。
 */
export function updateView(allTasks, allProjects, allLabels) {
    const taskView = document.getElementById('task-view');
    const dashboardView = document.getElementById('dashboard-view');
    const searchView = document.getElementById('search-view');
    const settingsView = document.getElementById('settings-view');
    
    const sortTrigger = document.getElementById('sort-trigger');
    const currentSortCriteria = sortTrigger ? sortTrigger.dataset.value || 'createdAt_desc' : 'createdAt_desc';

    if (!taskView || !dashboardView || !settingsView || !searchView) return;

    // --- ダッシュボード ---
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView, searchView]);
        dashboardView.innerHTML = buildDashboardViewHTML(renderKPIItem);
        renderDashboard(allTasks, allProjects);
        updateHeaderTitle('ダッシュボード');
        highlightSidebarItem(currentFilter);
        return;
    }
    
    // --- 設定画面 ---
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView, searchView]);
        settingsView.innerHTML = buildSettingsViewHTML();
        initSettings(); 
        updateHeaderTitle('設定');
        highlightSidebarItem(currentFilter);
        return;
    }

    // --- 検索画面 (ロジック分離) ---
    if (currentFilter.type === 'search') {
        renderSearchPage(
            searchView, 
            [taskView, dashboardView, settingsView], 
            allTasks, 
            allProjects, 
            currentFilter
        );
        return;
    }

    // --- タスクリストビュー (メイン) ---
    showView(taskView, [dashboardView, settingsView, searchView]);

    const toggleButton = document.getElementById('toggle-completed-btn');
    const showCompleted = toggleButton?.classList.contains('text-blue-500') || false;

    // フィルタリング
    let filterConfig = {
        keyword: '', 
        showCompleted: showCompleted,
        projectId: currentFilter.type === 'project' ? currentFilter.id : null,
        labelId: currentFilter.type === 'label' ? currentFilter.id : null,
        sortCriteria: currentSortCriteria
    };

    let filteredTasks = filterTasks(allTasks, filterConfig);

    // 追加フィルタ
    if (currentFilter.type === 'timeblock') {
        if (currentFilter.id === 'unassigned') {
            filteredTasks = filteredTasks.filter(t => !t.timeBlockId || t.timeBlockId === 'null');
        } else {
            filteredTasks = filteredTasks.filter(t => String(t.timeBlockId) === String(currentFilter.id));
        }
    } else if (currentFilter.type === 'duration') {
        filteredTasks = filteredTasks.filter(t => Number(t.duration) === Number(currentFilter.id));
    }
    
    // フリッカー防止描画
    taskView.style.opacity = '0';
    
    requestAnimationFrame(() => {
        renderTaskView(
            filteredTasks, 
            allProjects, 
            currentFilter.type === 'project' ? currentFilter.id : null, 
            currentFilter.type === 'label' ? currentFilter.id : null,
            currentSortCriteria
        );

        requestAnimationFrame(() => {
            taskView.style.opacity = '1'; 
            highlightSidebarItem(currentFilter);
            updateHeaderTitleByFilter(currentFilter, allProjects, allLabels);
        });
    });
}