// @ts-nocheck
// @miyter:20251129

import { updateTask } from '../store/store.js';
import { deleteProject } from '../store/projects.js';
import { deleteLabel } from '../store/labels.js';
import { showMessageModal } from './components.js';
import { showProjectModal, showLabelModal } from './task-modal.js';
import { setCurrentFilter } from './ui-view-manager.js';

// 内部状態変数（リサイズ、開閉）
let isSidebarCollapsed = false;
let sidebarWidth = 280; 
let labelMap = {};

// ==========================================================
// 状態/マップ管理
// ==========================================================

export function setLabelMap(labels) {
    labelMap = {};
    labels.forEach(l => labelMap[l.id] = l);
}

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

export function getCurrentFilter() {
    // ui-view-managerのgetCurrentFilterに依存
    // ここでは循環参照を避けるため、実装を省略またはApp.js側で取得
    // ★暫定: App.jsから渡される想定
    return { type: 'inbox', id: null }; 
}

export function getCurrentFilterData(allProjects, allLabels) {
    const filter = getCurrentFilter(); // ★実際のgetCurrentFilterロジックを呼び出す
    if (filter.type === 'project') {
        return allProjects.find(p => p.id === filter.id);
    } else if (filter.type === 'label') {
        return allLabels.find(l => l.id === filter.id);
    } else if (['inbox', 'dashboard', 'settings'].includes(filter.type)) {
        return true; 
    }
    return null;
}

// ==========================================================
// UI状態制御 (開閉/リサイズ)
// ==========================================================

// 動的幅クラスを削除する正規表現ヘルパー
const removeDynamicWidthClasses = (element) => {
    // 'w-[...px]' の形式のクラスを全て削除
    element.classList.remove(...Array.from(element.classList).filter(c => c.startsWith('w-[')));
};

export function updateSidebarState(sidebar, mainContent) {
    const storedState = localStorage.getItem('sidebarCollapsed');
    isSidebarCollapsed = storedState === 'true';

    if (isSidebarCollapsed) {
        // 閉じる
        sidebar.classList.add('w-0', 'p-0');
        removeDynamicWidthClasses(sidebar); // 動的幅を削除
        // ★修正: inline styleを削除し、Tailwindクラスで制御
        mainContent.style.marginLeft = '0px';
    } else {
        // 開く
        sidebar.classList.remove('w-0', 'p-0');
        // ★修正: inline styleを削除し、Tailwindクラスで制御
        removeDynamicWidthClasses(sidebar);
        sidebar.classList.add(`w-[${sidebarWidth}px]`);
        mainContent.style.marginLeft = `${sidebarWidth}px`; // mainContentはstyleで制御を維持
    }
}

export function setupResizer(sidebar, mainContent, resizer) {
    if (!resizer) return;
    let isResizing = false;

    // ★修正: 初期幅をクラスとして設定
    if (sidebar) {
        const storedWidth = localStorage.getItem('sidebarWidth');
        sidebarWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
        
        removeDynamicWidthClasses(sidebar);
        sidebar.classList.add(`w-[${sidebarWidth}px]`);
        mainContent.style.marginLeft = `${sidebarWidth}px`;
    }

    const startResize = (e) => {
        if (isSidebarCollapsed) return;
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    };

    const resize = (e) => {
        if (!isResizing) return;
        let newWidth = e.clientX;
        const minWidth = 150;
        const maxWidth = 500;

        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;

        sidebarWidth = newWidth;
        
        // ★修正: style.width を削除し、classList操作に統一 (警告解消)
        removeDynamicWidthClasses(sidebar);
        sidebar.classList.add(`w-[${newWidth}px]`);

        // mainContent.style.marginLeft はstyleで制御を維持 (Tailwindクラスでは難しい)
        mainContent.style.marginLeft = `${newWidth}px`; 
    };

    const stopResize = () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        localStorage.setItem('sidebarWidth', sidebarWidth);
    };

    resizer.addEventListener('mousedown', startResize);
}

// ==========================================================
// サイドバーアイテム生成
// [Immersive content redacted for brevity.]
// ==========================================================

/**
 * プロジェクト/ラベルの右クリックメニューを表示する
 */
export function showItemContextMenu(e, type, itemData, allProjects, allLabels) {
    document.getElementById('sidebar-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'sidebar-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    menu.innerHTML = `
        <button id="context-edit-btn" class="flex w-full justify-between items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            編集
        </button>
        <button id="context-delete-btn" class="flex w-full justify-between items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;

    document.body.appendChild(menu);

    // 編集ボタンのイベント
    document.getElementById('context-edit-btn').addEventListener('click', () => {
        menu.remove();
        if (type === 'project') {
            showProjectModal(itemData, allProjects);
        } else if (type === 'label') {
            showLabelModal(itemData, allLabels);
        }
    });

    // 削除ボタンのイベント
    document.getElementById('context-delete-btn').addEventListener('click', () => {
        menu.remove();
        showMessageModal(`${itemData.name} を削除しますか？\n（関連するタスクの${type === 'project' ? 'プロジェクト' : 'ラベル'}情報も削除されます）`, async () => {
            try {
                if (type === 'project') {
                    await deleteProject(itemData.id);
                } else if (type === 'label') {
                    await deleteLabel(itemData.id);
                }
                setCurrentFilter({ type: 'inbox', id: null });
                showMessageModal(`${itemData.name} を削除しました。`);

            } catch (error) {
                console.error('Delete failed:', error);
                showMessageModal("削除に失敗しました。", 'error');
            }
        });
    });

    // 画面のどこかをクリックしたらメニューを閉じる
    const dismissMenu = (ev) => {
        if (!menu.contains(ev.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', dismissMenu);
    }, 0);
}


// ==========================================================
// ドロップゾーン/カウント
// [Immersive content redacted for brevity.]
// ==========================================================
export function getRandomColor() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * プロジェクトIDからプロジェクト名を取得する
 * @param {string | null} projectId - 取得したいプロジェクトID
 * @param {Array<object>} allProjects - 全プロジェクトのリスト
 * @returns {string} プロジェクト名 ('インボックス' or '未分類'を含む)
 */
export function getProjectName(projectId, allProjects = []) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    if (!allProjects || !Array.isArray(allProjects)) return '未分類';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}