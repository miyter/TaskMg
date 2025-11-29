// @ts-nocheck
// @miyter:20251129

import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'; // onSnapshotはsubscribeToTasksRaw内で使用するため残す
import { db, auth } from '../core/firebase.js';

// ★修正: store/store.js を import。これで index.js のラッパーが利用可能
import { subscribeToTasks } from '../store/store.js';
import { subscribeToProjects } from '../store/projects.js';
import { subscribeToLabels } from '../store/labels.js';

import { filterTasks } from '../logic/search.js';
import { renderLayout } from './layout.js';
import { initTheme } from './theme.js';
import { initTaskModal } from './task-modal.js';
import { initSidebar, renderProjects, renderLabels, updateInboxCount } from './sidebar.js';
import { renderTaskView } from './task-view.js';
import { renderDashboard } from './dashboard.js';
import { initSettings } from './settings.js';

let allTasks = [];
let allProjects = [];
let allLabels = [];
let currentFilter = { type: 'inbox', id: null };
let unsubscribeTasks, unsubscribeProjects, unsubscribeLabels;

export function initializeApp() {
    initTheme();
    renderLayout();
    initTaskModal();
    setupGlobalEventListeners();
    onAuthStateChanged(auth, (user) => {
        user ? startDataSync() : (stopDataSync(), renderLoginState()); // ★修正: userIdの受け渡しを削除
    });
}

/**
 * データのリアルタイム購読を開始する
 * ★修正: userId引数を削除
 */
function startDataSync() {
    // 既存の購読があれば停止
    stopDataSync();
    
    // ★修正: onSnapshotをStoreラッパー関数に置き換え、userIdの管理をStore層に委譲
    
    // 1. タスク購読 (Storeラッパーが内部で userId を取得)
    unsubscribeTasks = subscribeToTasks((snap) => {
        allTasks = snap.map(doc => ({ id: doc.id, ...doc }));
        updateUI(); 
    });

    // 2. プロジェクト購読
    unsubscribeProjects = subscribeToProjects((projects) => {
        allProjects = projects;
        renderProjects(allProjects, allTasks);
        updateUI(); 
    });

    // 3. ラベル購読
    unsubscribeLabels = subscribeToLabels((labels) => {
        allLabels = labels;
        renderLabels(allLabels, allTasks);
        updateUI();
    });
    
    initSidebar();
}

function stopDataSync() {
    if (unsubscribeTasks) unsubscribeTasks();
    if (unsubscribeProjects) unsubscribeProjects();
    if (unsubscribeLabels) unsubscribeLabels();
    allTasks = []; allProjects = []; allLabels = [];
    updateUI();
}

function updateUI() {
    updateInboxCount(allTasks);
    // サイドバーの件数表示を最新タスクに基づいて更新
    if (allProjects.length) renderProjects(allProjects, allTasks);
    if (allLabels.length) renderLabels(allLabels, allTasks);

    const taskView = document.getElementById('task-view');
    const dashboardView = document.getElementById('dashboard-view');
    const settingsView = document.getElementById('settings-view');
    
    if (!taskView || !dashboardView || !settingsView) return; // 要素がない場合は早期リターン

    // ヘッダー情報取得
    const searchKeyword = document.getElementById('search-input')?.value || '';
    const toggleButton = document.getElementById('toggle-completed-btn');
    const showCompleted = toggleButton?.classList.contains('text-blue-500') || false;

    // ビュー切り替え
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView]);
        renderDashboard(allTasks, allProjects);
        updateHeaderTitle('ダッシュボード');
        return;
    }
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView]);
        // ★修正: userIdの取得を削除。initSettingsはauth.jsのラッパーが処理するため。
        initSettings(); 
        updateHeaderTitle('設定');
        return;
    }

    // タスクビュー表示
    showView(taskView, [dashboardView, settingsView]);

    // ★重要: フィルタリングロジックの修正
    const filteredTasks = filterTasks(allTasks, {
        projectId: currentFilter.type === 'project' ? currentFilter.id : null, 
        labelId: currentFilter.type === 'label' ? currentFilter.id : null, 
        keyword: searchKeyword,
        showCompleted: showCompleted
    });

    renderTaskView(
        filteredTasks, 
        currentFilter.type === 'project' ? currentFilter.id : null, 
        currentFilter.type === 'label' ? currentFilter.id : null
    );
    
    updateHeaderTitleByFilter();
}

function showView(show, hides) {
    show.classList.remove('hidden');
    hides.forEach(el => el.classList.add('hidden'));
}

function updateHeaderTitle(text) {
    const el = document.getElementById('header-title');
    if (el) el.textContent = text;
}

function updateHeaderTitleByFilter() {
    if (currentFilter.type === 'project') {
        const p = allProjects.find(x => x.id === currentFilter.id);
        updateHeaderTitle(p ? p.name : '不明なプロジェクト');
    } else if (currentFilter.type === 'label') {
        const l = allLabels.find(x => x.id === currentFilter.id);
        updateHeaderTitle(l ? l.name : '不明なラベル');
    } else {
        updateHeaderTitle('インボックス');
    }
}

function renderLoginState() {
    const v = document.getElementById('task-view');
    const d = document.getElementById('dashboard-view');
    const s = document.getElementById('settings-view');

    // ★ 修正: ご指摘の通り、それぞれの要素に対して null チェックを追加
    if (v) v.innerHTML = `<div class="p-10 text-center text-gray-400">ログインしてください</div>`;
    if (d) d.innerHTML = '';
    if (s) s.innerHTML = '';
}

function setupGlobalEventListeners() {
    // サイドバーからのルーティング変更イベント
    document.addEventListener('route-change', (e) => {
        currentFilter = { type: e.detail.page, id: e.detail.id };
        updateUI();
    });
    // 検索、トグル、ソートの変更イベント
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    document.getElementById('sort-select')?.addEventListener('change', updateUI);
    document.getElementById('settings-btn')?.addEventListener('click', () => {
        currentFilter = { type: 'settings', id: null };
        updateUI();
    });
}