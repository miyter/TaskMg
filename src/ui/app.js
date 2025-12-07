// @ts-nocheck
// @miyter:20251129

import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../core/firebase.js';

// UI関連
import { updateAuthUI } from './auth.js';
import { renderLayout } from './layout.js';
import { initTheme } from './theme.js';
import { initTaskModal } from './task-modal.js';
import { initSidebar, renderProjects, renderLabels, updateInboxCount } from './sidebar.js';
// ★追加: レンダラーから直接インポート
import { renderTimeBlocks, renderDurations } from './sidebar-renderer.js';

// Store関連
import { subscribeToTasks } from '../store/store.js';
import { subscribeToProjects } from '../store/projects.js';
import { subscribeToLabels } from '../store/labels.js';

// ビュー制御
import { 
    updateView, 
    setCurrentFilter, 
    getCurrentFilter, 
    renderLoginState 
} from './ui-view-manager.js';

let allTasks = [];
let allProjects = [];
let allLabels = [];

let unsubscribeTasks, unsubscribeProjects, unsubscribeLabels;

export function initializeApp() {
    initTheme();
    renderLayout();
    initTaskModal();
    setupGlobalEventListeners();
    
    // 認証状態の監視
    onAuthStateChanged(auth, (user) => {
        updateAuthUI(user);
        user ? startDataSync() : (stopDataSync(), renderLoginState()); 
    });
}

/**
 * データのリアルタイム購読を開始する
 */
function startDataSync() {
    stopDataSync();
    
    // 1. タスク購読
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

/**
 * UI全体を最新のデータとフィルターに基づいて更新するメイン関数
 */
function updateUI() {
    // サイドバーの更新
    updateInboxCount(allTasks);
    if (allProjects.length) renderProjects(allProjects, allTasks);
    // renderLabelsは廃止傾向だが一応残す、ただしTimeBlockとDurationを追加
    
    // ★追加: 時間帯と所要時間のカウントを更新
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    
    // ビューのレンダリングと切り替えを委譲
    updateView(allTasks, allProjects, allLabels);
}


function setupGlobalEventListeners() {
    // サイドバーからのルーティング変更イベント
    document.addEventListener('route-change', (e) => {
        setCurrentFilter({ type: e.detail.page, id: e.detail.id });
        updateUI();
    });
    
    // 検索、トグル、ソートの変更イベント
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    
    document.getElementById('sort-select')?.addEventListener('change', updateUI);

    // ★追加: 設定ボタンのイベントリスナーを復活
    document.getElementById('settings-btn')?.addEventListener('click', () => {
        setCurrentFilter({ type: 'settings', id: null });
        updateUI();
    });
}