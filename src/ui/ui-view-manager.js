// @ts-nocheck
// @miyter:20251221
// ビューの表示制御

import { renderDashboard } from './dashboard.js';
import { renderTaskView } from './task-view.js';
import { initSettings } from './settings.js';
import { getProcessedTasks } from '../logic/search.js';
import { buildDashboardViewHTML, buildSettingsViewHTML, renderKPIItem } from './ui-dom-utils.js';
import { showView, highlightSidebarItem, updateHeaderTitle, updateHeaderTitleByFilter, renderLoginState } from './ui-view-utils.js';
import { renderSearchPage } from './search-view-ctrl.js';

let currentFilter = { type: 'inbox', id: null };

export function setCurrentFilter(filter) {
    currentFilter = filter;
}

export function getCurrentFilter() {
    return currentFilter;
}

export { renderLoginState };

/**
 * ビューの切り替えと描画
 */
export function updateView(allTasks, allProjects, allLabels) {
    const views = {
        task: document.getElementById('task-view'),
        dashboard: document.getElementById('dashboard-view'),
        search: document.getElementById('search-view'),
        settings: document.getElementById('settings-view')
    };

    if (!views.task || !views.dashboard || !views.settings || !views.search) return;

    // ソート条件の取得
    const sortTrigger = document.getElementById('sort-trigger');
    const sortCriteria = sortTrigger?.dataset.value || 'createdAt_desc';

    // 1. ダッシュボード
    if (currentFilter.type === 'dashboard') {
        showView(views.dashboard, [views.task, views.settings, views.search]);
        views.dashboard.innerHTML = buildDashboardViewHTML(renderKPIItem);
        renderDashboard(allTasks, allProjects);
        updateHeaderTitle('ダッシュボード');
        highlightSidebarItem(currentFilter);
        return;
    }
    
    // 2. 設定
    if (currentFilter.type === 'settings') {
        showView(views.settings, [views.task, views.dashboard, views.search]);
        views.settings.innerHTML = buildSettingsViewHTML();
        initSettings(); 
        updateHeaderTitle('設定');
        highlightSidebarItem(currentFilter);
        return;
    }

    // 3. 検索
    if (currentFilter.type === 'search') {
        renderSearchPage(views.search, [views.task, views.dashboard, views.settings], allTasks, allProjects, currentFilter);
        return;
    }

    // 4. タスクリストビュー
    showView(views.task, [views.dashboard, views.settings, views.search]);

    const showCompleted = document.getElementById('toggle-completed-btn')?.classList.contains('text-blue-500') || false;

    // フィルタ・ソート設定の構築
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

    // 描画（フリッカー防止）
    views.task.style.opacity = '0';
    requestAnimationFrame(() => {
        renderTaskView(
            processedTasks, 
            allProjects, 
            config.projectId, 
            config.labelId,
            sortCriteria
        );

        requestAnimationFrame(() => {
            views.task.style.opacity = '1'; 
            highlightSidebarItem(currentFilter);
            updateHeaderTitleByFilter(currentFilter, allProjects, allLabels);
        });
    });
}