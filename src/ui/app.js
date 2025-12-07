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
import { showSettingsModal } from './settings.js';

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
        updateUI();
    });
    
    // 検索、トグル、ソートの変更イベント
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    
    // ★修正: ネイティブな sort-select のリスナーを削除し、カスタムドロップダウンロジックを実装
    // document.getElementById('sort-select')?.addEventListener('change', updateUI); // <- 削除

    setupCustomSortDropdown();

    // 設定ボタン: 設定モーダルを直接開く
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#settings-btn');
        if (btn) {
            e.preventDefault();
            showSettingsModal();
        }
    });
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
    const toggleMenu = (open) => {
        if (open) {
            menu.classList.remove('opacity-0', 'invisible', 'scale-95', 'pointer-events-none');
            menu.classList.add('opacity-100', 'visible', 'scale-100', 'pointer-events-auto');
            // 外クリックで閉じるリスナーを設定
            setTimeout(() => { 
                document.addEventListener('click', closeMenu); 
            }, 0);
        } else {
            menu.classList.remove('opacity-100', 'visible', 'scale-100', 'pointer-events-auto');
            menu.classList.add('opacity-0', 'invisible', 'scale-95', 'pointer-events-none');
            document.removeEventListener('click', closeMenu);
        }
    };
    
    const closeMenu = (e) => {
        // メニュー内クリックまたはトリガークリックでない場合のみ閉じる
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) {
            return;
        }
        toggleMenu(false);
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
            
            // 2. 内部的な値を更新 (ここではカスタムドロップダウンなので、DOM要素は使えない)
            // 擬似的に `<select>` と同じように振る舞うため、カスタムイベントを発火させる
            // または、直接 updateUI を呼ぶ
            
            // updateUIのロジックがソートオプションをどこから取得しているか確認
            // -> sort.jsでcriteriaとして渡される。criteriaはどこから来る？
            // -> updateView (ui-view-manager.js)が filterTasks の前にソートオプションを読み込むロジックがない。

            // 【重要】ソートオプションを保存する仕組みがないため、ここで直接DOMにセットする
            // 以前のネイティブ select の値を取得していた場所がないため、
            // 新しいロジックでは、ソートオプションをグローバルに保存する変数が必要になる。
            // しかし、現状の `updateUI` は引数を取らない。ソート値は DOM から取得すべき。

            // 暫定的に、ソート値をトリガーボタンのdata属性に保存し、そこから取得するようにする。
            trigger.dataset.value = value;
            
            // ソートイベント発火 (updateUIを呼び出す)
            updateUI(); 

            // 3. メニュー閉じる
            toggleMenu(false);
        });
    });

    // 初期ソート値のセットアップ
    // 初期のソート基準は 'createdAt_desc'
    trigger.dataset.value = 'createdAt_desc';
    label.textContent = "作成日(新しい順)";
}