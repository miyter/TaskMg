// @ts-nocheck
// @miyter:20251129

import { getCurrentFilter, showItemContextMenu, createSidebarItem, setLabelMap, getCurrentFilterData } from './sidebar-utils.js'; // 循環参照に注意が必要ですが、構成上utilsからimportします
import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { setupDropZone } from './sidebar-utils.js'; // ドロップゾーン設定
import { showProjectModal, showLabelModal } from './task-modal.js'; // モーダル表示

// DOM操作を含むレンダリング関数群

/**
 * プロジェクトリストを描画する
 */
export function renderProjects(projects, tasks = [], allLabels = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;
        
        // createSidebarItemを利用 (sidebar-utils.jsからインポートされていると想定、またはここで定義)
        // ※ createSidebarItem もDOM生成なので、本来はこのファイルにあるべきです。
        // ここでは sidebar-utils.js にある createSidebarItem を使っていますが、
        // 分割の意図としては createSidebarItem もこのファイルに移動するのが適切です。
        // 今回は指示通り分割するため、createSidebarItem もこちらに定義します。
        
        const item = createSidebarItemLocal(
            proj.name, 
            'project', 
            proj.id, 
            proj.color || 'blue', 
            count
        );

        // クリックイベント
        item.addEventListener('click', () => {
            setCurrentFilter({ type: 'project', id: proj.id });
            updateView(tasks, projects, allLabels);
        });
        
        // 右クリックイベント
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // showItemContextMenu も DOM操作なのでこちらに移動すべきですが、
            // sidebar-utils.js にある場合は import して使います。
            // 今回は sidebar-utils.js から import して使う形にします。
            showItemContextMenu(e, 'project', proj, projects, allLabels);
        });

        setupDropZone(item, 'project', proj.id);
        list.appendChild(item);
    });
}

/**
 * ラベルリストを描画する
 */
export function renderLabels(labels, tasks = [], allProjects = []) {
    const list = document.getElementById('label-list');
    if (!list) return;
    list.innerHTML = '';
    
    // ラベルマップを更新 (utils側の関数を呼ぶ)
    setLabelMap(labels);

    labels.forEach(label => {
        const count = tasks ? tasks.filter(t => t.labelIds && t.labelIds.includes(label.id) && t.status !== 'completed').length : 0;

        const item = createSidebarItemLocal(
            label.name, 
            'label', 
            label.id, 
            label.color || 'gray',
            count
        );

        // クリックイベント
        item.addEventListener('click', () => {
            setCurrentFilter({ type: 'label', id: label.id });
            updateView(tasks, allProjects, labels);
        });

        // 右クリックイベント
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(e, 'label', label, allProjects, labels);
        });

        setupDropZone(item, 'label', label.id);
        list.appendChild(item);
    });
}

/**
 * UI全体を最新のデータとフィルターに基づいて更新するメイン関数
 */
export function renderSidebarItems(sidebar, allTasks, allProjects, allLabels) {
    if (!sidebar) return;
    
    // UIを再構築
    renderProjects(allProjects, allTasks, allLabels);
    renderLabels(allLabels, allTasks, allProjects);

    // フィルターのデータが存在しない場合はインボックスに切り替える
    const currentFilter = getCurrentFilterData(allProjects, allLabels);
    if (!currentFilter) {
        setCurrentFilter({ type: 'inbox', id: null });
    }

    // アクティブリンクの更新
    updateActiveLink(); 
}

/**
 * インボックスの未完了タスク数を更新する
 */
export function updateInboxCount(allTasks) {
    const inboxCountEl = document.getElementById('inbox-count');
    if (!inboxCountEl) return;
    
    // インボックス（プロジェクトなし）かつ未完了のタスク数を計算
    const count = allTasks ? allTasks.filter(t => !t.projectId && t.status !== 'completed').length : 0;
    
    inboxCountEl.textContent = count;
    if (count > 0) {
        inboxCountEl.classList.remove('hidden');
    } else {
        inboxCountEl.classList.add('hidden');
    }
}

// 内部ヘルパー: DOM要素生成
function createSidebarItemLocal(name, type, id, color, count) {
    const item = document.createElement('li');
    item.dataset.type = type;
    item.dataset.id = id;
    item.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target';

    // アイコン部分の生成
    let iconHtml = '';
    if (type === 'project') {
        iconHtml = `<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;
    } else {
        const colorStyle = color ? `background-color: ${color};` : 'background-color: #a0aec0;';
        iconHtml = `<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="${colorStyle}"></span>`;
    }

    const countHtml = count > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${count}</span>` : '';

    item.innerHTML = `
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            ${iconHtml}
            <span class="truncate">${name}</span>
        </div>
        <div class="flex items-center">
            ${countHtml}
        </div>
    `;

    return item;
}

// 内部ヘルパー: アクティブリンク更新
function updateActiveLink() {
    // 既存の全てのアクティブクラスを削除
    document.querySelectorAll('.sidebar-link-active').forEach(el => {
        el.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'sidebar-link-active');
        el.classList.add('text-gray-700', 'dark:text-gray-200', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
    });

    // 現在のフィルター設定を取得
    const filter = getCurrentFilter();
    let targetElement = null;

    if (filter.type === 'dashboard') {
        targetElement = document.getElementById('nav-dashboard');
    } else if (filter.type === 'settings') {
        targetElement = document.getElementById('settings-link'); // settings-btn かもしれないので確認要
    } else if (filter.type === 'inbox') {
        targetElement = document.getElementById('nav-inbox');
    } else {
        // プロジェクトまたはラベルから対象要素を探す
        targetElement = document.querySelector(`li[data-type="${filter.type}"][data-id="${filter.id}"]`);
    }

    // 新しいアクティブクラスを設定
    if (targetElement) {
        targetElement.classList.remove('text-gray-700', 'dark:text-gray-200', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        targetElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'sidebar-link-active');
    }
}