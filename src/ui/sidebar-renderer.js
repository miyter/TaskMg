// @ts-nocheck
// @miyter:20251129

import { getCurrentFilter, showItemContextMenu, createSidebarItem, setLabelMap } from './sidebar-utils.js';
import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { setupDropZone } from './sidebar-utils.js'; // ドロップゾーン設定
import { showProjectModal, showLabelModal } from './task-modal.js'; // モーダル表示
import { getRandomColor } from './sidebar-utils.js'; // カラーヘルパー

/**
 * プロジェクトリストを描画する
 */
export function renderProjects(projects, tasks = [], allLabels = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';

        // ★修正: createSidebarItemを利用
        const item = createSidebarItem(
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
        
        // 右クリックイベントで編集・削除メニューを呼び出す
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
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
    
    // ラベルマップを更新
    setLabelMap(labels);

    labels.forEach(label => {
        const count = tasks ? tasks.filter(t => t.labelIds && t.labelIds.includes(label.id) && t.status !== 'completed').length : 0;
        const countDisplay = count > 0 ? count : '';

        // ★修正: createSidebarItemを利用
        const item = createSidebarItem(
            label.name, 
            'label', 
            label.id, 
            label.color || 'gray', // ラベルの色はsidebar-utils内で処理
            count
        );

        // クリックイベント
        item.addEventListener('click', () => {
            setCurrentFilter({ type: 'label', id: label.id });
            updateView(tasks, allProjects, labels);
        });

        // 右クリックイベントで編集・削除メニューを呼び出す
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
 * UI全体を最新のデータとフィルターに基づいて更新するメイン関数 (app.jsから呼ばれる想定)
 * ★注: これは renderSidebarItems のロジックを受け継ぎます
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

    // ★アクティブリンクの更新
    updateActiveLink(null); 
}

// 補助関数（sidebar-utilsに依存）
function updateActiveLink(newActiveEl) {
    // 既存の全てのアクティブクラスを削除
    document.querySelectorAll('.sidebar-link-active').forEach(el => {
        el.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'sidebar-link-active');
        el.classList.add('text-gray-700', 'dark:text-gray-200', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
    });

    // 現在のフィルター設定を取得
    const filter = getCurrentFilter();
    let targetElement = newActiveEl;

    if (!targetElement) {
        if (filter.type === 'dashboard') {
            targetElement = document.getElementById('nav-dashboard');
        } else if (filter.type === 'settings') {
            targetElement = document.getElementById('settings-link');
        } else if (filter.type === 'inbox') {
            targetElement = document.getElementById('nav-inbox');
        } else {
            // プロジェクトまたはラベルから対象要素を探す
            targetElement = document.querySelector(`li[data-type="${filter.type}"][data-id="${filter.id}"]`);
        }
    }

    // 新しいアクティブクラスを設定
    if (targetElement) {
        targetElement.classList.remove('text-gray-700', 'dark:text-gray-200', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        targetElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'sidebar-link-active');
    }
}

function getCurrentFilterData(allProjects, allLabels) {
    // ui-view-managerのgetCurrentFilterを呼び出す
    const filter = getCurrentFilter(); 
    if (filter.type === 'project') {
        return allProjects.find(p => p.id === filter.id);
    } else if (filter.type === 'label') {
        return allLabels.find(l => l.id === filter.id);
    } else if (['inbox', 'dashboard', 'settings'].includes(filter.type)) {
        return true; 
    }
    return null;
}

// ★追加: updateInboxCountをエクスポート
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