// @ts-nocheck
// @miyter:20251129

import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'; // onSnapshotはsubscribeToTasksRaw内で使用するため残す
import { db, auth } from '../core/firebase.js';

// ★追加: auth.js から認証UI更新関数をインポート
import { updateAuthUI } from './auth.js';
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
        // ★修正: updateAuthUI を最初に呼び出す（認証UIを安全に更新）
        updateAuthUI(user);
        user ? startDataSync() : (stopDataSync(), renderLoginState()); 
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
    
    // layout.js がまだDOM要素を生成していない場合はここで処理を中断
    if (!taskView || !dashboardView || !settingsView) return; 

    // ヘッダー情報取得
    const searchKeyword = document.getElementById('search-input')?.value || '';
    const toggleButton = document.getElementById('toggle-completed-btn');
    const showCompleted = toggleButton?.classList.contains('text-blue-500') || false;

    // ビュー切り替え
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView]);
        
        // ★修正: DashboardのHTMLをここで描画してからChart関数を呼び出す
        dashboardView.innerHTML = `
            <div class="space-y-6">
                <!-- KPI -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${renderKPIItem('未完了タスク', 'kpi-todo', 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400')}
                    ${renderKPIItem('完了タスク', 'kpi-done', 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400')}
                    ${renderKPIItem('期限切れ', 'kpi-overdue', 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400')}
                    ${renderKPIItem('今週の予定', 'kpi-upcoming', 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400')}
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- ステータス別グラフ -->
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                        <h3 class="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">ステータス別</h3>
                        <div class="h-64">
                            <canvas id="statusChart"></canvas>
                        </div>
                    </div>
                    <!-- プロジェクト別グラフ -->
                    <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                        <h3 class="text-md font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">プロジェクト別（未完了）</h3>
                        <div class="h-64">
                            <canvas id="projectChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;

        renderDashboard(allTasks, allProjects);
        updateHeaderTitle('ダッシュボード');
        return;
    }
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView]);
        
        // ★修正: SettingsのHTMLをここで描画してからinitSettingsを呼び出す
        settingsView.innerHTML = `
            <div class="space-y-6">
                <!-- パスワード更新 -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                    <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">アカウント設定</h3>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">新しいパスワード (6文字以上)</label>
                            <input type="password" id="new-password-input" placeholder="新しいパスワード"
                                class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-100">
                        </div>
                        <button id="update-password-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">
                            パスワードを更新
                        </button>
                    </div>
                </div>

                <!-- データエクスポート -->
                <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
                    <h3 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-700 pb-3">データ管理</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">現在のすべてのタスク、プロジェクト、ラベルをJSONファイルとしてダウンロードします。</p>
                    <button id="export-data-btn" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition">
                        データのエクスポート
                    </button>
                </div>
            </div>
        `;
        
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

function renderKPIItem(title, id, colors) {
    return `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">${title}</span>
            <span id="${id}" class="text-2xl font-bold ${colors} px-3 py-1 rounded-lg">0</span>
        </div>
    `;
}

function showView(show, hides) {
    show.classList.remove('hidden');
    hides.forEach(el => el.classList.add('hidden'));
}

function updateHeaderTitle(text) {
    const el = document.getElementById('header-title');
    // ★修正: シンプルなNull Guardに戻す (updateUI()内のガードで十分なはず)
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