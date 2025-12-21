// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 設定画面のモーダル統一（ビュー廃止）、ヘッダー更新責務の整理
 */

import { renderDashboard } from './dashboard.js';
import { renderTaskView } from './task-view.js';
import { getProcessedTasks } from '../logic/search.js';
import { buildDashboardViewHTML, renderKPIItem } from './ui-dom-utils.js';
import { showView, highlightSidebarItem, renderLoginState } from './ui-view-utils.js';
import { renderSearchPage } from './search-view-ctrl.js';
// 設定モーダル
import { showSettingsModal } from './settings.js';

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
        settings: document.getElementById('settings-view') // DOM上は残すが使用しない
    };

    if (!views.task || !views.dashboard || !views.search) return;

    const sortTrigger = document.getElementById('sort-trigger');
    const sortCriteria = sortTrigger?.dataset.value || 'createdAt_desc';

    // 1. ダッシュボード
    if (currentFilter.type === 'dashboard') {
        showView(views.dashboard, [views.task, views.search, views.settings]);
        views.dashboard.innerHTML = buildDashboardViewHTML(renderKPIItem);
        renderDashboard(allTasks, allProjects);
        // ヘッダータイトルの更新はここで行う
        updateHeaderTitle('ダッシュボード');
        highlightSidebarItem(currentFilter);
        return;
    }
    
    // 2. 設定（モーダルへリダイレクト）
    if (currentFilter.type === 'settings') {
        // 設定ビューは廃止されたため、直前のビュー（またはInbox）に戻してモーダルを開く
        // ループ防止のため Inbox へ強制遷移
        currentFilter = { type: 'inbox', id: null };
        highlightSidebarItem(currentFilter);
        showSettingsModal();
        // Inboxの描画へ進む
    }

    // 3. 検索
    if (currentFilter.type === 'search') {
        renderSearchPage(views.search, [views.task, views.dashboard, views.settings], allTasks, allProjects, currentFilter);
        // SearchPage内でヘッダー更新していない場合はここで行う必要があるが、
        // renderSearchPageの実装に依存。念のため。
        updateHeaderTitle('タスク検索');
        return;
    }

    // 4. タスクリストビュー（デフォルト）
    showView(views.task, [views.dashboard, views.settings, views.search]);

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

    // 描画（フリッカー防止）
    views.task.style.opacity = '0';
    requestAnimationFrame(() => {
        renderTaskView(
            processedTasks, 
            allProjects, 
            allLabels,
            config.projectId, 
            config.labelId
        );

        requestAnimationFrame(() => {
            views.task.style.opacity = '1'; 
            highlightSidebarItem(currentFilter);
            
            // ヘッダータイトルは renderTaskView 内で updateHeaderInfo が呼ばれるため
            // ここでの重複更新は行わない
        });
    });
}

/**
 * 簡易ヘッダータイトル更新（Dashboard/Search用）
 */
function updateHeaderTitle(title) {
    const headerTitle = document.getElementById('header-title');
    const headerCount = document.getElementById('header-count');
    if (headerTitle) headerTitle.textContent = title;
    if (headerCount) headerCount.textContent = '';
}