// @miyter:20251125
// Vite導入後、アプリケーションのエントリーポイントとして機能。
// Tailwind CSSパッケージの直接インポートを削除し、ローカルCSSをインポートするよう修正済み。

// --- 修正: CSSパッケージの直接インポートを削除し、ローカルCSSをインポート ---
// import "tailwindcss/tailwind.css"; // ★削除！
import "../index.css"; // ★修正: プロジェクトルート直下のCSSファイルをインポート

// --- モジュールインポート (Vite絶対パス '@' に修正) ---
import { initAuthListener } from '@/core/auth.js';
import { subscribeToTasks, addTask } from '@/store/store.js';
import { subscribeToProjects } from '@/store/projects.js';
import { subscribeToLabels } from '@/store/labels.js';
import { filterTasks, sortTasks } from '@/logic/search.js';
import { initAuthUI, updateAuthUI } from './auth.js';
import { initSidebar, renderProjects, renderLabels } from './sidebar.js';
import { initTaskView, renderTaskList } from './task-view.js'; 
import { renderDashboard } from './dashboard.js';
import { initSettings } from './settings.js';
import { renderModals } from './components.js'; 

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

// アプリ初期化
document.addEventListener('DOMContentLoaded', () => {
    // 共通モーダルをDOMに挿入
    renderModals();
    
    initAuthUI();
    
    initAuthListener(
        // ログイン時
        (user) => {
            updateAuthUI(user);
            initializeApp(user.uid);
        },
        // ログアウト時
        () => {
            updateAuthUI(null);
            // 画面クリア等の処理
            renderTaskList([], null);
        }
    );
});

function initializeApp(userId) {
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
        // 現在選択中のプロジェクトIDを付与
        if (currentFilter.projectId) taskData.projectId = currentFilter.projectId;
        await addTask(userId, taskData);
    });

    // フィルタ・検索UIイベント
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

function setupFilterEvents() {
    // 検索ボックス
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter.keyword = e.target.value;
            updateView();
        });
    }

    // 完了表示トグル
    const toggle = document.getElementById('show-completed-toggle');
    if (toggle) {
        toggle.addEventListener('change', (e) => {
            currentFilter.showCompleted = e.target.checked;
            updateView();
        });
    }

    // ソート選択
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSort = e.target.value;
            updateView();
        });
    }
    
    // ダッシュボード切替
    const navDash = document.getElementById('nav-dashboard');
    if(navDash) {
        navDash.addEventListener('click', () => {
            document.getElementById('task-view').classList.add('hidden');
            document.getElementById('dashboard-view').classList.remove('hidden');
        });
    }
    
    // インボックス(タイトル)クリックで戻る
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

function updateView() {
    // タイトル更新
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
    
    // タスクリスト描画
    import('@/core/auth.js').then(m => {
        renderTaskList(sorted, m.currentUserId);
    });
    
    // ダッシュボード更新
    renderDashboard(allTasks, allProjects); 
}