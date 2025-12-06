// @ts-nocheck
// @miyter:20251129

// ★修正: showItemContextMenu をここから削除 (sidebar-dom.jsへ移動したため)
import { getCurrentFilter, setLabelMap, getCurrentFilterData } from './sidebar-utils.js';
import { updateView, setCurrentFilter } from './ui-view-manager.js';
// ★修正: showItemContextMenu をここに追加
import { createSidebarItem, setupDropZone, showItemContextMenu } from './sidebar-dom.js'; 

// ==========================================================
// レンダリング関数群
// ==========================================================

/**
 * プロジェクトリストを描画する
 */
export function renderProjects(projects, tasks = [], allLabels = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;
        
        // sidebar-dom.js の createSidebarItem を使用
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
        
        // 右クリックイベント
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(e, 'project', proj, projects, allLabels);
        });

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
    
    setLabelMap(labels);

    labels.forEach(label => {
        const count = tasks ? tasks.filter(t => t.labelIds && t.labelIds.includes(label.id) && t.status !== 'completed').length : 0;

        const item = createSidebarItem(
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
    
    const count = allTasks ? allTasks.filter(t => !t.projectId && t.status !== 'completed').length : 0;
    
    inboxCountEl.textContent = count;
    if (count > 0) {
        inboxCountEl.classList.remove('hidden');
    } else {
        inboxCountEl.classList.add('hidden');
    }
}

// 内部ヘルパー: アクティブリンク更新
function updateActiveLink() {
    // 既存の全てのアクティブクラスを削除
    document.querySelectorAll('.sidebar-link-active').forEach(el => {
        el.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'sidebar-link-active');
        el.classList.add('text-gray-700', 'dark:text-gray-200', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
    });

    const filter = getCurrentFilter();
    let targetElement = null;

    if (filter.type === 'dashboard') {
        targetElement = document.getElementById('nav-dashboard');
    } else if (filter.type === 'settings') {
        targetElement = document.getElementById('settings-link'); 
    } else if (filter.type === 'inbox') {
        targetElement = document.getElementById('nav-inbox');
    } else {
        targetElement = document.querySelector(`li[data-type="${filter.type}"][data-id="${filter.id}"]`);
    }

    if (targetElement) {
        targetElement.classList.remove('text-gray-700', 'dark:text-gray-200', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        targetElement.classList.add('bg-blue-100', 'dark:bg-blue-900', 'text-blue-700', 'dark:text-blue-300', 'sidebar-link-active');
    }
}