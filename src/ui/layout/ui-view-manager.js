import { UI_CONFIG } from './ui-view-constants.js';
import { renderDashboard } from '../features/dashboard/dashboard.js';
import { renderTaskView } from '../task-view.js';
import { getProcessedTasks } from '../../logic/search.js';
import { buildDashboardViewHTML } from '../ui-dom-utils.js';
import { showView, highlightSidebarItem, updateHeaderTitleByFilter, resolveTitleText } from './ui-view-utils.js';
import { renderSearchPage } from '../search-view-ctrl.js';
import { showSettingsModal } from '../settings.js';
import { renderWizard } from '../features/wizard/wizard.js';
import { renderTargetDashboard } from '../features/target-dashboard/target-dashboard.js';
import { renderWiki } from '../features/wiki/wiki.js';

let currentFilter = { type: 'inbox', id: null };
let UI = null;

// 特定のコントロールIDの定数化（本来は UI_CONFIG にあるべきだが、現状に合わせる）
const CONTROL_IDS = {
    SORT: 'sort-trigger',
    COMPLETED_TOGGLE: 'toggle-completed-btn'
};

import { renderFixedAddTaskBar } from '../task-input.js';

/**
 * ビュー要素のキャッシュ（初回のみ実行）
 */
function ensureUICache() {
    if (UI) return;
    const { VIEW_IDS } = UI_CONFIG;
    UI = {
        task: document.getElementById(VIEW_IDS.TASK),
        dashboard: document.getElementById(VIEW_IDS.DASHBOARD),
        search: document.getElementById(VIEW_IDS.SEARCH),
        settings: document.getElementById(VIEW_IDS.SETTINGS),
        wizard: document.getElementById(VIEW_IDS.WIZARD),
        targetDashboard: document.getElementById(VIEW_IDS.TARGET_DASHBOARD),
        wiki: document.getElementById(VIEW_IDS.WIKI)
    };
}

export function setCurrentFilter(filter, allProjects = [], allLabels = []) {
    if (filter.type === 'settings') {
        showSettingsModal();
        return;
    }

    currentFilter = filter;
    highlightSidebarItem(currentFilter);
    updateHeaderTitleByFilter(currentFilter, allProjects, allLabels);
}

export function getCurrentFilter() {
    return currentFilter;
}

/**
 * 更新日: 2025-12-29
 * 内容: ヘッダータイトルの動的解決とコンテキストオブジェクトの受け渡し
 */
export function updateView(allTasks, allProjects, allLabels, allTimeBlocks = [], allFilters = []) {
    ensureUICache();
    if (!UI.task) return;

    const sortTrigger = document.getElementById(CONTROL_IDS.SORT);
    const sortCriteria = sortTrigger?.dataset.value || 'createdAt_desc';
    const allViewElements = Object.values(UI).filter(el => el); // すべてのビュー要素（null除く）

    // 1. ダッシュボード
    if (currentFilter.type === 'dashboard') {
        showView(UI.dashboard, allViewElements.filter(v => v !== UI.dashboard));
        UI.dashboard.innerHTML = buildDashboardViewHTML();
        renderDashboard(allTasks, allProjects);
        updateFooterVisibility(true);
        return;
    }

    // 2. 検索
    if (currentFilter.type === 'search') {
        showView(UI.search, allViewElements.filter(v => v !== UI.search));
        renderSearchPage(UI.search, allTasks, allProjects, currentFilter);
        updateFooterVisibility(true, null, null);
        return;
    }

    // 3. New Views
    if (currentFilter.type === 'wizard') {
        if (UI.wizard) {
            showView(UI.wizard, allViewElements.filter(v => v !== UI.wizard));
            renderWizard(UI.wizard);
            updateFooterVisibility(true);
        }
        return;
    }

    if (currentFilter.type === 'target-dashboard') {
        if (UI.targetDashboard) {
            showView(UI.targetDashboard, allViewElements.filter(v => v !== UI.targetDashboard));
            renderTargetDashboard(UI.targetDashboard);
            updateFooterVisibility(true);
        }
        return;
    }

    if (currentFilter.type === 'wiki') {
        if (UI.wiki) {
            showView(UI.wiki, allViewElements.filter(v => v !== UI.wiki));
            renderWiki(UI.wiki);
            updateFooterVisibility(true);
        }
        return;
    }

    // 4. タスクリスト (Default)
    showView(UI.task, allViewElements.filter(v => v !== UI.task));

    // 安全なボタン参照（存在しない場合はデフォルト false）
    const toggleBtn = document.getElementById(CONTROL_IDS.COMPLETED_TOGGLE);
    const showCompleted = toggleBtn ? toggleBtn.classList.contains('text-blue-500') : false;

    const config = {
        keyword: '',
        showCompleted,
        projectId: currentFilter.type === 'inbox' ? 'unassigned' : (currentFilter.type === 'project' ? currentFilter.id : null),
        labelId: currentFilter.type === 'label' ? currentFilter.id : null,
        timeBlockId: currentFilter.type === 'timeblock' ? currentFilter.id : null,
        duration: currentFilter.type === 'duration' ? currentFilter.id : null,
        savedFilter: (currentFilter.type === 'custom' || currentFilter.type === 'filter')
            ? allFilters.find(f => f.id === currentFilter.id)
            : null,
        sortCriteria,
        title: resolveTitleText(currentFilter, allProjects, allLabels, allTimeBlocks, allFilters)
    };

    // Saved Filterに時間帯が含まれている場合、timeBlockIdを設定してプログレスバーを表示させる (ユーザー要望対応)
    if (config.savedFilter && !config.timeBlockId) {
        const query = config.savedFilter.query || '';
        const match = query.match(/timeblock:([^ ]+)/);
        if (match) {
            const ids = match[1].split(',');
            // 先頭の有効なIDを使用
            if (ids.length > 0 && ids[0] !== 'null' && ids[0] !== 'none') {
                config.timeBlockId = ids[0];
            }
        }
    }

    const processedTasks = getProcessedTasks(allTasks, config);
    // 第4引数に丸ごとコンテキストを渡す
    renderTaskView(processedTasks, allProjects, allLabels, config);

    updateFooterVisibility(true, config.projectId, config.labelId);
}

function updateFooterVisibility(show, projectId = null, labelId = null) {
    const globalFooter = document.getElementById('global-footer');
    const footerBtnContainer = document.getElementById('footer-add-btn-container');
    const footerFormContainer = document.getElementById('footer-input-form-container');

    if (globalFooter && footerBtnContainer && footerFormContainer) {
        if (!show) {
            // フッター全体を完全に非表示にする
            globalFooter.style.display = 'none';
            globalFooter.style.height = '0';
            globalFooter.style.padding = '0';
            globalFooter.style.margin = '0';

            footerBtnContainer.classList.add('hidden');
            footerBtnContainer.style.height = '0';
            footerBtnContainer.style.minHeight = '0';
            footerBtnContainer.innerHTML = '';

            footerFormContainer.classList.add('hidden');
            footerFormContainer.style.height = '0';
            footerFormContainer.style.minHeight = '0';
            footerFormContainer.innerHTML = '';
        } else {
            // フッター全体を表示する
            globalFooter.style.display = '';
            globalFooter.style.height = '';
            globalFooter.style.padding = '';
            globalFooter.style.margin = '';

            footerBtnContainer.classList.remove('hidden');
            footerBtnContainer.style.height = '';
            footerBtnContainer.style.minHeight = '';

            footerFormContainer.classList.add('hidden');
            footerFormContainer.innerHTML = '';

            renderFixedAddTaskBar(footerBtnContainer, footerFormContainer, projectId, labelId);
        }
    }
}