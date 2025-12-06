// @ts-nocheck
// @miyter:20251129
// DOM生成・イベントハンドラ・ドロップゾーン管理

import { updateTask } from '../store/store.js';
import { deleteProject } from '../store/projects.js';
import { deleteLabel } from '../store/labels.js';
import { showMessageModal } from './components.js';
import { showProjectModal, showLabelModal } from './task-modal.js';
import { setCurrentFilter } from './ui-view-manager.js';

// ==========================================================
// サイドバー静的構造生成
// ==========================================================

/**
 * サイドバーの静的なDOM構造を生成する
 * @returns {string} サイドバーのHTML文字列
 */
export function buildSidebarHTML() {
    return `
        <nav class="space-y-1">
            <a href="#" id="nav-dashboard" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                ダッシュボード
            </a>
            <a href="#" id="nav-inbox" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors drop-target" data-type="inbox">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <span class="flex-1">インボックス</span>
                <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
            </a>
        </nav>

        <div class="mt-8">
            <div class="flex items-center justify-between px-3 mb-2 group">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">プロジェクト</h3>
                <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="project-list" class="space-y-0.5 mb-6"></ul>

            <div class="flex items-center justify-between px-3 mb-2 group">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ラベル</h3>
                <button id="add-label-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="label-list" class="space-y-0.5"></ul>
        </div>
    `;
}

// ==========================================================
// サイドバーアイテム生成
// ==========================================================

/**
 * サイドバーのリストアイテム要素を作成する
 * @param {string} name - アイテム名
 * @param {string} type - 'project' | 'label'
 * @param {string} id - ID
 * @param {string} color - 色コード (ラベル用) またはクラス
 * @param {number} count - タスク数
 * @returns {HTMLElement} 作成されたli要素
 */
export function createSidebarItem(name, type, id, color, count) {
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

    // ★ドロップゾーンとして設定
    setupDropZone(item, type, id);

    return item;
}

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
// ドロップゾーン
// ==========================================================

export function setupDropZone(element, type, id = null) {
    if (!element) return;

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
        const taskId = e.dataTransfer.getData('text/plain');

        if (taskId) {
            try {
                if (type === 'inbox') {
                    await updateTask(taskId, { projectId: null });
                    showMessageModal("タスクをインボックスに戻しました");
                } else if (type === 'project' && id) {
                    await updateTask(taskId, { projectId: id });
                    showMessageModal("プロジェクトへ移動しました");
                } else if (type === 'label' && id) {
                    // ラベル追加ロジックは Store 側で対応が必要
                    showMessageModal("ラベルへのタスク移動は、現在のタスクラベル情報の読み込みが不完全なため、現時点では未実装です。", null);
                }
            } catch (error) {
                console.error("Drop Error:", error);
            }
        }
    });
}