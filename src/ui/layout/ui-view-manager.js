import { UI_CONFIG } from './ui-view-constants.js';
import { renderDashboard } from '../features/dashboard/dashboard.js';
import { renderTaskView } from '../task-view.js';
import { getProcessedTasks } from '../../logic/search.js';
import { buildDashboardViewHTML } from '../ui-dom-utils.js';
import { showView, highlightSidebarItem, updateHeaderTitleByFilter } from './ui-view-utils.js';
import { renderSearchPage } from '../search-view-ctrl.js';
import { showSettingsModal } from '../settings.js';

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
        settings: document.getElementById(VIEW_IDS.SETTINGS)
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
    if (!UI.task || !UI.dashboard || !UI.search) return;

    const sortTrigger = document.getElementById(CONTROL_IDS.SORT);
    const sortCriteria = sortTrigger?.dataset.value || 'createdAt_desc';
    const allViewElements = [UI.task, UI.dashboard, UI.search, UI.settings];

    // 1. ダッシュボード
    if (currentFilter.type === 'dashboard') {
        showView(UI.dashboard, allViewElements.filter(v => v !== UI.dashboard));
        UI.dashboard.innerHTML = buildDashboardViewHTML();
        renderDashboard(allTasks, allProjects);
        return;
    }

    // 2. 検索
    if (currentFilter.type === 'search') {
        showView(UI.search, allViewElements.filter(v => v !== UI.search));
        renderSearchPage(UI.search, allTasks, allProjects, currentFilter);
        return;
    }

    // 3. タスクリスト
    showView(UI.task, allViewElements.filter(v => v !== UI.task));

    // 安全なボタン参照（存在しない場合はデフォルト false）
    const toggleBtn = document.getElementById(CONTROL_IDS.COMPLETED_TOGGLE);
    const showCompleted = toggleBtn ? toggleBtn.classList.contains('text-blue-500') : false;

    // ヘッダータイトルの解決
    const resolveTitle = () => {
        switch (currentFilter.type) {
            case 'inbox':
                return 'インボックス';
            case 'project':
                return allProjects.find(p => p.id === currentFilter.id)?.name || 'プロジェクト';
            case 'label':
                return allLabels.find(l => l.id === currentFilter.id)?.name || 'ラベル';
            case 'timeblock':
                if (currentFilter.id === 'unassigned' || currentFilter.id === 'none') return '未定';
                return allTimeBlocks.find(b => b.id === currentFilter.id)?.name || '時間帯';
            case 'duration':
                return `${currentFilter.id}分`;
            case 'filter':
            case 'custom': // sidebar sends 'custom'
                return allFilters.find(f => f.id === currentFilter.id)?.name || 'フィルター';
            case 'today': return '今日';
            case 'upcoming': return '今後';
            default:
                // サイドバークリック時のフォールバック
                if (currentFilter.id) return currentFilter.id;
                return 'タスク';
        }
    };

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
        title: resolveTitle()
    };

    const processedTasks = getProcessedTasks(allTasks, config);
    // 第4引数に丸ごとコンテキストを渡す
    renderTaskView(processedTasks, allProjects, allLabels, config);

    // フッターのタスク追加ボタンを更新 (ダッシュボード以外で表示)
    const footerBtnContainer = document.getElementById('footer-add-btn-container');
    const footerFormContainer = document.getElementById('footer-input-form-container');

    if (footerBtnContainer && footerFormContainer) {
        if (currentFilter.type === 'dashboard') {
            footerBtnContainer.classList.add('hidden');
            footerFormContainer.classList.add('hidden');
        } else {
            footerBtnContainer.classList.remove('hidden');
            footerFormContainer.classList.add('hidden');
            footerFormContainer.innerHTML = '';
            renderFixedAddTaskBar(footerBtnContainer, footerFormContainer, config.projectId, config.labelId);
        }
    }
}