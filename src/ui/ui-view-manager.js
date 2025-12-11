// @ts-nocheck
// ビューの表示制御とヘッダー更新ロジック

import { renderDashboard } from './dashboard.js';
import { renderTaskView } from './task-view.js';
// ★追加: 検索画面内でリスト描画するためにインポート
import { renderTaskList } from './task-list.js';
import { initSettings } from './settings.js';
import { filterTasks } from '../logic/search.js';
import { getTimeBlockById } from '../store/timeblocks.js';
import { 
    buildDashboardViewHTML, 
    buildSettingsViewHTML, 
    buildSearchViewHTML, // ★追加
    renderKPIItem 
} from './ui-dom-utils.js';

let currentFilter = { type: 'inbox', id: null };

/**
 * 現在のフィルター設定を更新する。
 * @param {object} filter - 新しいフィルター設定
 */
export function setCurrentFilter(filter) {
    currentFilter = filter;
}

/**
 * 現在のフィルター設定を取得する。
 * @returns {object}
 */
export function getCurrentFilter() {
    return currentFilter;
}

/**
 * ビューを切り替えて描画を行う。
 * @param {Array} allTasks - 全タスクデータ
 * @param {Array} allProjects - 全プロジェクトデータ
 * @param {Array} allLabels - 全ラベルデータ
 */
export function updateView(allTasks, allProjects, allLabels) {
    const taskView = document.getElementById('task-view');
    const dashboardView = document.getElementById('dashboard-view');
    const searchView = document.getElementById('search-view'); // ★追加
    const settingsView = document.getElementById('settings-view');
    
    // ★追加: ソート基準をカスタムドロップダウンから取得
    const sortTrigger = document.getElementById('sort-trigger');
    const currentSortCriteria = sortTrigger ? sortTrigger.dataset.value || 'createdAt_desc' : 'createdAt_desc';

    if (!taskView || !dashboardView || !settingsView || !searchView) return;

    // --- ★修正: 以前のハイライト処理を削除 (タイミングが早すぎた) ---
    // highlightSidebarItem(currentFilter); // 削除

    // --- ビュー切り替えロジック ---
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView, searchView]);
        dashboardView.innerHTML = buildDashboardViewHTML(renderKPIItem);
        renderDashboard(allTasks, allProjects);
        updateHeaderTitle('ダッシュボード');
        highlightSidebarItem(currentFilter); // 基本項目なのでDOMは安定している
        return;
    }
    
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView, searchView]);
        settingsView.innerHTML = buildSettingsViewHTML();
        initSettings(); 
        updateHeaderTitle('設定');
        highlightSidebarItem(currentFilter); // 基本項目なのでDOMは安定している
        return;
    }

    // ★追加: 検索画面
    if (currentFilter.type === 'search') {
        showView(searchView, [taskView, dashboardView, settingsView]);
        
        // 検索画面を描画
        searchView.innerHTML = buildSearchViewHTML(allProjects);
        
        const searchInput = document.getElementById('page-search-input');
        const projectSelect = document.getElementById('page-search-project');
        const resultsContainer = document.getElementById('search-results-container');

        // 自動フォーカス
        searchInput?.focus();

        // 検索実行関数
        const performSearch = () => {
            const keyword = searchInput.value.trim();
            const projectId = projectSelect.value;

            if (!keyword) {
                resultsContainer.innerHTML = `
                    <div class="text-center text-gray-400 py-16 flex flex-col items-center">
                        <svg class="w-12 h-12 mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        <span class="text-sm">キーワードを入力してタスクを検索</span>
                    </div>
                `;
                return;
            }

            const filtered = filterTasks(allTasks, {
                keyword: keyword,
                projectId: projectId || null,
                showCompleted: true // 検索時は完了済みも含めるのが一般的
            });

            if (filtered.length === 0) {
                resultsContainer.innerHTML = `<div class="text-center text-gray-400 py-10">該当するタスクが見つかりませんでした</div>`;
            } else {
                resultsContainer.innerHTML = ''; // クリア
                renderTaskList(resultsContainer, filtered);
            }
        };

        // イベントリスナー
        searchInput?.addEventListener('input', performSearch);
        projectSelect?.addEventListener('change', performSearch);

        updateHeaderTitle('検索');
        highlightSidebarItem(currentFilter); // 基本項目なのでDOMは安定している
        return;
    }

    // タスクビュー表示 (インボックス、プロジェクト別など)
    showView(taskView, [dashboardView, settingsView, searchView]);

    const toggleButton = document.getElementById('toggle-completed-btn');
    const showCompleted = toggleButton?.classList.contains('text-blue-500') || false;

    // フィルタリング設定
    let filterConfig = {
        keyword: '', // リスト画面での検索は廃止
        showCompleted: showCompleted,
        projectId: currentFilter.type === 'project' ? currentFilter.id : null,
        labelId: currentFilter.type === 'label' ? currentFilter.id : null,
        sortCriteria: currentSortCriteria // ★追加: ソート基準を渡す
    };

    let filteredTasks = filterTasks(allTasks, filterConfig);

    // 追加フィルタ（時間帯・所要時間）
    if (currentFilter.type === 'timeblock') {
        if (currentFilter.id === 'unassigned') {
            filteredTasks = filteredTasks.filter(t => !t.timeBlockId || t.timeBlockId === 'null');
        } else {
            filteredTasks = filteredTasks.filter(t => String(t.timeBlockId) === String(currentFilter.id));
        }
    } else if (currentFilter.type === 'duration') {
        filteredTasks = filteredTasks.filter(t => Number(t.duration) === Number(currentFilter.id));
    }
    
    // ★修正: フリッカー防止ロジックを適用
    // 1. 瞬時に opacity:0 にしてフリッカーを完全に隠す
    taskView.style.opacity = '0';
    
    // 2. 次のリペイントまで待機（DOMの読み書きを分離）
    requestAnimationFrame(() => {
        // ここでDOM操作（renderTaskView）を行う
        renderTaskView(
            filteredTasks, 
            allProjects, 
            currentFilter.type === 'project' ? currentFilter.id : null, 
            currentFilter.type === 'label' ? currentFilter.id : null,
            currentSortCriteria // ★追加: renderTaskView にソート基準を渡す
        );

        // 3. 次のフレームで opacity:1 に戻す（スムーズにフェードイン）
        requestAnimationFrame(() => {
            // transitionクラスはlayout.jsのタスクビューコンテナに設定されている前提
            taskView.style.opacity = '1'; 
            
            // ★修正: DOMが更新された後にハイライトとヘッダータイトル更新を実行
            highlightSidebarItem(currentFilter);
            updateHeaderTitleByFilter(allProjects, allLabels);
        });
    });
}

/**
 * 指定した要素を表示し、残りを非表示にする。
 */
function showView(show, hides) {
    hides.forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in');
    });

    show.classList.remove('hidden');
}

/**
 * サイドバーの選択項目をハイライトする
 * @param {object} filter - 現在のフィルター設定
 */
function highlightSidebarItem(filter) {
    // 1. 全てのハイライトを解除 (サイドバーアイテムは .sidebar-item-row 内にある)
    document.querySelectorAll('.sidebar-item-row').forEach(el => {
        el.classList.remove('bg-blue-600', 'dark:bg-blue-600', 'text-white', 'dark:text-white', 'hover:bg-blue-700', 'dark:hover:bg-blue-700');
        // デフォルトの色に戻す
        el.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
        
        // アイコンの色をデフォルトに戻す
        const icon = el.querySelector('svg, span');
        if (icon) {
            icon.classList.remove('text-white', 'dark:text-white');
            // プロジェクトアイコンや基本項目のアイコン色を適切にリセット
            if (el.id.startsWith('nav-') || el.dataset.type === 'project') {
                 icon.classList.add('text-gray-400'); 
            }
        }
    });

    let targetItem = null;

    if (filter.type === 'inbox' || filter.type === 'dashboard' || filter.type === 'search' || filter.type === 'settings') {
        // 基本項目は ID でハイライト
        targetItem = document.getElementById(`nav-${filter.type}`);
    } else if (filter.type === 'project' || filter.type === 'timeblock' || filter.type === 'duration') {
        // 動的生成項目は data-type と data-id でハイライト
        const selector = `.sidebar-item-row[data-type="${filter.type}"][data-id="${filter.id}"]`;
        targetItem = document.querySelector(selector);
    } else if (filter.type === 'custom') {
        // カスタムフィルター (data-type=filter, data-id=filterId)
        const selector = `.sidebar-item-row[data-type="filter"][data-id="${filter.id}"]`;
        targetItem = document.querySelector(selector);
    }
    
    // 選択されたアイテムにハイライトを適用
    if (targetItem) {
        applyHighlightClasses(targetItem);
    }
}

/**
 * 選択項目にハイライトクラスを適用するヘルパー関数
 * @param {HTMLElement} el 
 */
function applyHighlightClasses(el) {
    el.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
    el.classList.add('bg-blue-600', 'dark:bg-blue-600', 'text-white', 'dark:text-white', 'hover:bg-blue-700', 'dark:hover:bg-blue-700');
    
    // アイコンの色を変更
    const icon = el.querySelector('svg, span');
    if (icon) {
        icon.classList.remove('text-gray-400'); // デフォルト色を削除
        icon.classList.add('text-white', 'dark:text-white');
    }
}


/**
 * ヘッダータイトルを更新する。
 */
function updateHeaderTitle(text) {
    const el = document.getElementById('header-title');
    if (el) el.textContent = text;
    // ★追加: ブラウザのタブタイトルも更新
    document.title = `${text} | TaskMg`;
}

/**
 * 現在のフィルターに基づいてヘッダータイトルを更新する。
 */
function updateHeaderTitleByFilter(allProjects, allLabels) {
    if (currentFilter.type === 'project') {
        const p = allProjects.find(x => x.id === currentFilter.id);
        // ★修正: プロジェクト名を表示
        updateHeaderTitle(p ? p.name : '不明なプロジェクト');
    } else if (currentFilter.type === 'label') {
        const l = allLabels.find(x => x.id === currentFilter.id);
        updateHeaderTitle(l ? l.name : '不明なラベル');
    } else if (currentFilter.type === 'timeblock') {
        if (currentFilter.id === 'unassigned') {
            updateHeaderTitle('時間帯: 未定');
        } else {
            const block = getTimeBlockById(currentFilter.id);
            updateHeaderTitle(block ? `時間帯: ${block.start} - ${block.end}` : '時間帯: 不明');
        }
    } else if (currentFilter.type === 'duration') {
        updateHeaderTitle(`所要時間: ${currentFilter.id}分`);
    } else {
        updateHeaderTitle('インボックス');
    }
}

/**
 * ログインが必要な旨を画面に表示する。
 */
export function renderLoginState() {
    const v = document.getElementById('task-view');
    const d = document.getElementById('dashboard-view');
    const s = document.getElementById('settings-view');

    if (v) v.innerHTML = `<div class="p-10 text-center text-gray-400">ログインしてください</div>`;
    if (d) d.innerHTML = '';
    if (s) s.innerHTML = '';
}