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
import { renderTimeBlocks, renderDurations } from './sidebar-renderer.js';
import { initSettings } from './settings.js';

// Store関連
import { subscribeToTasks } from '../store/store.js';
import { subscribeToProjects } from '../store/projects.js';
import { subscribeToLabels } from '../store/labels.js';

// ビュー制御
import { 
    updateView, 
    setCurrentFilter, 
    renderLoginState 
} from './ui-view-manager.js';

let allTasks = [];
let allProjects = [];
let allLabels = [];

let unsubscribeTasks, unsubscribeProjects, unsubscribeLabels;

export function initializeApp() {
    initTheme();
    renderLayout();
    initSettings(); // ★修正: DOM生成直後に呼び出すことで、確実にイベントを登録する
    initTaskModal();
    setupGlobalEventListeners();
    
    // ★追加: ページ状態の復元 (リロード対策)
    // Grokレビュー対応: localStorageから前回のページ状態を読み込んでセットする
    try {
        const saved = localStorage.getItem('lastPage');
        if (saved) {
            const { page, id } = JSON.parse(saved);
            setCurrentFilter({ type: page, id: id || null });
        } else {
            setCurrentFilter({ type: 'inbox' }); // デフォルト
        }
    } catch (e) {
        console.error('Failed to restore page state:', e);
        setCurrentFilter({ type: 'inbox' });
    }
    // データ未ロードのためupdateUI()は呼ばないが、filter設定は完了。
    // データ同期開始時にこのフィルター設定が適用される。

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
    
    // 時間帯と所要時間のカウントを更新
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    
    // ビューのレンダリングと切り替えを委譲
    updateView(allTasks, allProjects, allLabels);
}


function setupGlobalEventListeners() {
    // サイドバーからのルーティング変更イベント
    document.addEventListener('route-change', (e) => {
        setCurrentFilter({ type: e.detail.page, id: e.detail.id });
        
        // ★追加: ページ切り替え時に状態を保存 (リロード対策)
        localStorage.setItem('lastPage', JSON.stringify({ 
            page: e.detail.page, 
            id: e.detail.id || null 
        }));

        updateUI();
    });
    
    // 検索、トグル、ソートの変更イベント
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    
    setupCustomSortDropdown();

    // ★削除: 設定ボタンのイベントリスナーは initSettings() (src/ui/settings.js) 側に集約したため削除
}

/**
 * カスタムソートドロップダウンのイベントロジックを設定する
 */
function setupCustomSortDropdown() {
    const trigger = document.getElementById('sort-trigger');
    const menu = document.getElementById('sort-menu');
    const label = document.getElementById('sort-label');
    const options = document.querySelectorAll('.sort-option');

    if (!trigger || !menu || !label) return;
    
    // --- メニュー開閉ロジック ---
    
    const closeMenu = (e) => {
        // メニュー内クリックまたはトリガークリックでない場合のみ閉じる
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) {
            return;
        }
        toggleMenu(false);
    };
    
    const toggleMenu = (open) => {
        if (open) {
            // 開く: クラスを切り替え、リスナーを即座に登録 (setTimeoutを削除)
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu); 
        } else {
            // 閉じる: クラスを切り替え、リスナーを解除
            menu.classList.replace('opacity-100', 'opacity-0');
            menu.classList.replace('visible', 'invisible');
            menu.classList.replace('scale-100', 'scale-95');
            menu.classList.replace('pointer-events-auto', 'pointer-events-none');
            document.removeEventListener('click', closeMenu);
        }
    };

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); // documentへの伝播を防ぎ、closeMenuが即発火するのを防ぐ
        const isOpen = menu.classList.contains('opacity-100');
        toggleMenu(!isOpen);
    });
    
    // --- 選択処理 ---
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const value = option.dataset.value;
            const text = option.textContent;
            
            // 1. UI更新
            label.textContent = text;
            
            // 2. ソート値をトリガーボタンのdata属性に保存
            trigger.dataset.value = value;
            
            // 3. ソートイベント発火 (updateUIを呼び出す)
            updateUI(); 

            // 4. メニュー閉じる
            toggleMenu(false);
        });
    });

    // 初期ソート値のセットアップ
    // 初期のソート基準は 'createdAt_desc'
    if (!trigger.dataset.value) {
        trigger.dataset.value = 'createdAt_desc';
        // label.textContent は layout.js で初期値が設定されているため不要だが、念のため
        label.textContent = "作成日(新しい順)";
    }
}