// アプリケーションのコアロジック
import { subscribeToTasks, addTask } from '@/store/store.js';
import { subscribeToProjects } from '@/store/projects.js';
import { subscribeToLabels } from '@/store/labels.js';
import { filterTasks, sortTasks } from '@/logic/search.js';
import { initSidebar, renderProjects, renderLabels } from './sidebar.js';
import { initTaskView, renderTaskList } from './task-view.js';
import { renderDashboard } from './dashboard.js';
import { initSettings } from './settings.js';

// 状態管理
let allTasks = [];
let allProjects = [];
let allLabels = [];
let currentFilter = {
    keyword: '',
    projectId: null, // null = Inbox
    labelId: null,
    showCompleted: false
};
let currentSort = 'created_desc';

/**
 * ログイン後のアプリ初期化とデータ購読
 */
export function initializeApp(userId) {
    // 1. 各種イベントリスナー初期化
    initSidebar(userId, (filter) => {
        if (filter.type === 'dashboard') {
            document.getElementById('task-view').classList.add('hidden');
            document.getElementById('dashboard-view').classList.remove('hidden');
        } else {
            currentFilter.projectId = filter.type === 'project' ? filter.value : null;
            currentFilter.labelId = filter.type === 'label' ? filter.value : null;
            document.getElementById('task-view').classList.remove('hidden');
            document.getElementById('dashboard-view').classList.add('hidden');
            updateView();
        }
    });
    initSettings(userId);
    
    // タスク追加イベントを task-view に委譲
    initTaskView(async (taskData) => {
        if (currentFilter.projectId) taskData.projectId = currentFilter.projectId;
        await addTask(userId, taskData);
    });

    setupFilterEvents();

    // 2. データ購読開始
    subscribeToProjects(userId, (projects) => {
        allProjects = projects;
        renderProjects(projects, (filter) => {
            currentFilter.projectId = filter.value;
            currentFilter.labelId = null;
            updateView();
        });
        updateView();
    });

    subscribeToLabels(userId, (labels) => {
        allLabels = labels;
        renderLabels(labels, (filter) => {
            currentFilter.labelId = filter.value;
            currentFilter.projectId = null;
            updateView();
        }, userId);
        updateView();
    });

    subscribeToTasks(userId, (tasks) => {
        allTasks = tasks;
        updateView();
    });
}

/**
 * フィルタ・検索UIイベントの設定
 */
function setupFilterEvents() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter.keyword = e.target.value;
            updateView();
        });
    }

    const toggle = document.getElementById('show-completed-toggle');
    if (toggle) {
        toggle.addEventListener('change', (e) => {
            currentFilter.showCompleted = e.target.checked;
            updateView();
        });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            updateView();
        });
    }

    const navDash = document.getElementById('nav-dashboard');
    if(navDash) {
        navDash.addEventListener('click', () => {
            document.getElementById('task-view').classList.add('hidden');
            document.getElementById('dashboard-view').classList.remove('hidden');
        });
    }

    const title = document.getElementById('current-view-title');
    if(title) {
        title.addEventListener('click', () => {
             document.getElementById('task-view').classList.remove('hidden');
             document.getElementById('dashboard-view').classList.add('hidden');
             currentFilter.projectId = null;
             currentFilter.labelId = null;
             updateView();
        });
    }
}

/**
 * 画面の更新（フィルタリング・ソート・描画）
 */
function updateView() {
    const titleEl = document.getElementById('current-view-title');
    if (currentFilter.projectId) {
        const proj = allProjects.find(p => p.id === currentFilter.projectId);
        titleEl.textContent = proj ? proj.name : "プロジェクト";
    } else if (currentFilter.labelId) {
        const label = allLabels.find(l => l.id === currentFilter.labelId);
        titleEl.textContent = label ? label.name : "ラベル";
    } else {
        titleEl.textContent = "インボックス";
    }

    const filtered = filterTasks(allTasks, currentFilter);
    const sorted = sortTasks(filtered, currentSort);
    
    // 循環依存を避けるため動的インポートでユーザーIDを取得して描画
    import('@/core/auth.js').then(m => {
        renderTaskList(sorted, m.currentUserId);
    });
    
    renderDashboard(allTasks, allProjects);
}