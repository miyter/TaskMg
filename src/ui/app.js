import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../core/firebase.js';
import { filterTasks } from '../logic/search.js';
// UIコンポーネントのインポート
import { renderLayout } from './layout.js';
import { initTheme } from './theme.js';
import { initTaskModal } from './task-modal.js';
import { initSidebar, renderProjects, renderLabels, updateInboxCount } from './sidebar.js';
import { renderTaskView } from './task-view.js';
import { renderDashboard } from './dashboard.js';
import { initSettings } from './settings.js';

// --- 状態管理 ---
let allTasks = [];
let allProjects = [];
let allLabels = [];

// フィルタ状態
let currentFilter = { 
    type: 'inbox', // 'inbox', 'project', 'label', 'dashboard', 'settings'
    id: null 
};

// Firestore購読解除用関数
let unsubscribeTasks = null;
let unsubscribeProjects = null;
let unsubscribeLabels = null;

// =========================================================
// 公開メソッド (main.js から呼ばれるエントリーポイント)
// =========================================================

/**
 * アプリケーションの初期化
 */
export function initializeApp() {
    console.log('initializeApp: Starting...');

    // 1. テーマとレイアウトの初期化 (DOM生成)
    initTheme();
    renderLayout();

    // 2. モーダル機能の初期化
    initTaskModal();

    // 3. イベントリスナーの設定
    setupGlobalEventListeners();

    // 4. 認証監視とデータ同期開始
    onAuthStateChanged(auth, (user) => {
        if (user) {
            startDataSync(user.uid);
        } else {
            stopDataSync();
            renderLoginState();
        }
    });
}

// =========================================================
// 内部ロジック
// =========================================================

// --- データ同期 (Firestore -> Local State) ---
function startDataSync(userId) {
    const appId = window.GLOBAL_APP_ID || 'default-app-id';
    
    // タスク購読
    const tasksQuery = query(
        collection(db, `artifacts/${appId}/users/${userId}/tasks`), 
        orderBy('createdAt', 'desc')
    );
    unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
        allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        updateUI(); // データ更新時に画面再描画
    });

    // プロジェクト購読
    const projectsQuery = query(
        collection(db, `artifacts/${appId}/users/${userId}/projects`), 
        orderBy('createdAt', 'asc')
    );
    unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
        allProjects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderProjects(allProjects, allTasks); // サイドバー更新
        updateUI(); 
    });

    // ラベル購読
    const labelsQuery = query(
        collection(db, `artifacts/${appId}/users/${userId}/labels`), 
        orderBy('createdAt', 'asc')
    );
    unsubscribeLabels = onSnapshot(labelsQuery, (snapshot) => {
        allLabels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderLabels(allLabels, allTasks); // サイドバー更新
        updateUI();
    });

    // サイドバーのイベント初期化
    initSidebar();
}

// --- 同期停止 ---
function stopDataSync() {
    if (unsubscribeTasks) unsubscribeTasks();
    if (unsubscribeProjects) unsubscribeProjects();
    if (unsubscribeLabels) unsubscribeLabels();
    
    allTasks = [];
    allProjects = [];
    allLabels = [];
    
    updateUI();
}

// --- UI更新 (メインロジック) ---
function updateUI() {
    // 1. サイドバーの未完了件数バッジを更新
    updateInboxCount(allTasks);

    // 2. DOM要素の取得
    const taskView = document.getElementById('task-view');
    const dashboardView = document.getElementById('dashboard-view');
    const settingsView = document.getElementById('settings-view');
    
    if (!taskView) return; // ログアウト時などでDOMがない場合ガード

    // ヘッダーUIの状態取得
    const searchInput = document.getElementById('search-input');
    const searchKeyword = searchInput ? searchInput.value : '';
    
    const toggleBtn = document.getElementById('toggle-completed-btn');
    const showCompleted = toggleBtn ? toggleBtn.classList.contains('text-blue-500') : false;

    // 3. ビューの切り替え制御
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView]);
        renderDashboard(allTasks, allProjects); // ダッシュボード描画
        updateHeaderTitle('ダッシュボード');
        return;
    } 
    
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView]);
        initSettings(); // 設定画面初期化
        updateHeaderTitle('設定');
        return;
    }

    // --- タスク一覧ビューの描画 ---
    showView(taskView, [dashboardView, settingsView]);

    // フィルタリング実行
    const filteredTasks = filterTasks(allTasks, {
        type: currentFilter.type,
        id: currentFilter.id,
        keyword: searchKeyword,
        showCompleted: showCompleted
    });

    // ビュー描画 (task-view.js に委譲)
    renderTaskView(
        filteredTasks, 
        currentFilter.type === 'project' ? currentFilter.id : null, 
        currentFilter.type === 'label' ? currentFilter.id : null
    );
    
    updateHeaderTitleByFilter();
}

// ヘルパー: ビューの表示/非表示切り替え
function showView(showEl, hideEls) {
    if (showEl) showEl.classList.remove('hidden');
    hideEls.forEach(el => {
        if (el) el.classList.add('hidden');
    });
}

// ヘルパー: ヘッダータイトルの更新
function updateHeaderTitle(text) {
    const titleEl = document.getElementById('header-title');
    if (titleEl) titleEl.textContent = text;
}

// ヘルパー: フィルタ状態に応じたタイトル更新
function updateHeaderTitleByFilter() {
    if (currentFilter.type === 'project') {
        const proj = allProjects.find(p => p.id === currentFilter.id);
        updateHeaderTitle(proj ? proj.name : 'プロジェクト');
    } else if (currentFilter.type === 'label') {
        const label = allLabels.find(l => l.id === currentFilter.id);
        updateHeaderTitle(label ? label.name : 'ラベル');
    } else {
        updateHeaderTitle('インボックス');
    }
}

// 未ログイン時の表示
function renderLoginState() {
    const taskView = document.getElementById('task-view');
    if (taskView) {
        taskView.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
                <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                <p>ログインしてタスクを管理しましょう</p>
            </div>
        `;
    }
}

// --- イベントリスナー設定 ---
function setupGlobalEventListeners() {
    // 1. サイドバーからの画面切り替え (カスタムイベント)
    document.addEventListener('route-change', (e) => {
        const { page, id } = e.detail;
        currentFilter = { type: page, id: id };
        updateUI();
    });

    // 2. 検索入力
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            updateUI();
        });
    }

    // 3. 完了タスク表示切り替え
    const toggleBtn = document.getElementById('toggle-completed-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (toggleBtn.classList.contains('text-blue-500')) {
                toggleBtn.classList.remove('text-blue-500'); // OFF
                toggleBtn.classList.add('text-gray-400');
            } else {
                toggleBtn.classList.add('text-blue-500'); // ON
                toggleBtn.classList.remove('text-gray-400');
            }
            updateUI();
        });
    }

    // 4. ソート順切り替え
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            updateUI();
        });
    }
    
    // 5. 設定ボタン
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            currentFilter = { type: 'settings', id: null };
            updateUI();
        });
    }
}