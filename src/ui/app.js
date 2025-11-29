// (既存のインポート等はそのまま)
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../core/firebase.js';
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
        user ? startDataSync(user.uid) : (stopDataSync(), renderLoginState());
    });
}

function startDataSync(userId) {
    const appId = window.GLOBAL_APP_ID || 'default-app-id';
    
    // タスク購読 (常時全件取得しメモリ内でフィルタリング)
    unsubscribeTasks = onSnapshot(query(collection(db, `artifacts/${appId}/users/${userId}/tasks`), orderBy('createdAt', 'desc')), (snap) => {
        allTasks = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateUI(); // タスク更新時
    });

    unsubscribeProjects = onSnapshot(query(collection(db, `artifacts/${appId}/users/${userId}/projects`), orderBy('createdAt', 'asc')), (snap) => {
        allProjects = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProjects(allProjects, allTasks);
        updateUI(); // プロジェクト名解決のためUI更新
    });

    unsubscribeLabels = onSnapshot(query(collection(db, `artifacts/${appId}/users/${userId}/labels`), orderBy('createdAt', 'asc')), (snap) => {
        allLabels = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
    if (!taskView) return;

    // ヘッダー情報取得
    const searchKeyword = document.getElementById('search-input')?.value || '';
    const showCompleted = document.getElementById('toggle-completed-btn')?.classList.contains('text-blue-500') || false;

    // ビュー切り替え
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView]);
        renderDashboard(allTasks, allProjects);
        updateHeaderTitle('ダッシュボード');
        return;
    }
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView]);
        initSettings();
        updateHeaderTitle('設定');
        return;
    }

    // タスクビュー表示
    showView(taskView, [dashboardView, settingsView]);

    // ★重要: フィルタリングロジックの修正
    // filterTasks関数が正しく動作することを前提に、引数を渡す
    const filteredTasks = filterTasks(allTasks, {
        type: currentFilter.type, // 'inbox', 'project', 'label'
        id: currentFilter.id,     // プロジェクトID or ラベルID
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
    if (v) v.innerHTML = `<div class="p-10 text-center text-gray-400">ログインしてください</div>`;
}

function setupGlobalEventListeners() {
    document.addEventListener('route-change', (e) => {
        currentFilter = { type: e.detail.page, id: e.detail.id };
        updateUI();
        // モバイル用: サイドバーを閉じる処理などがあればここに
    });
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