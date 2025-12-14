// @ts-nocheck
// サイドバーのUIコンポーネント（リストアイテム、コンテキストメニュー）

import { deleteProject } from '../store/projects.js';
import { deleteFilter } from '../store/filters.js';
import { deleteWorkspace } from '../store/workspace.js'; // 追加
import { showFilterModal } from './filter-modal.js';
import { showMessageModal } from './components.js';
// ★修正: 本格モーダルへ切り替え
import { showProjectModal } from './modal/project-modal.js';
import { showWorkspaceModal } from './modal/workspace-modal.js'; // 追加
import { setCurrentFilter } from './ui-view-manager.js';

/**
 * サイドバーのリストアイテム要素を作成する (汎用)
 * @param {string} name - アイテム名
 * @param {string} type - 'project' | 'timeblock' | 'duration' etc
 * @param {string} id - ID
 * @param {string} color - 色コード
 * @param {number} count - カウント数
 * @returns {HTMLElement} 作成されたli要素
 */
export function createSidebarItem(name, type, id, color, count) {
    const item = document.createElement('li');
    
    const isCompact = localStorage.getItem('sidebar_compact') === 'true';
    const paddingClass = isCompact ? 'py-0.5' : 'py-1.5';
    
    item.dataset.type = type;
    item.dataset.id = id;
    
    item.className = `group flex items-center justify-between px-3 ${paddingClass} font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target sidebar-item-row`;

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

/**
 * 右クリックメニューを表示する（プロジェクト & フィルター & ワークスペース対応）
 */
export function showItemContextMenu(e, type, itemData, extraData = {}) {
    // workspaceを追加
    if (!['project', 'filter', 'workspace'].includes(type)) return;

    document.getElementById('sidebar-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'sidebar-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[160px]';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    let menuItems = '';
    
    // 編集ボタンの出しわけ
    if (type === 'project') {
        menuItems = `
            <button id="context-edit-btn" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                編集
            </button>
        `;
    } else if (type === 'filter') {
        menuItems = `
            <button id="context-edit-btn" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                編集 / 名前変更
            </button>
        `;
    } else if (type === 'workspace') {
        menuItems = `
            <button id="context-edit-btn" class="flex w-full items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                名前変更
            </button>
        `;
    }

    // 共通: 削除ボタン
    menuItems += `
        <button id="context-delete-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;

    menu.innerHTML = menuItems;
    document.body.appendChild(menu);

    // 編集ボタン
    document.getElementById('context-edit-btn')?.addEventListener('click', () => {
        menu.remove();
        if (type === 'project') {
            showProjectModal(itemData);
        } else if (type === 'filter') {
            showFilterModal(itemData);
        } else if (type === 'workspace') {
            showWorkspaceModal(itemData);
        }
    });

    // 削除ボタン
    document.getElementById('context-delete-btn').addEventListener('click', () => {
        menu.remove();
        let confirmMsg = '';

        if (type === 'project') {
            confirmMsg = `${itemData.name} を削除しますか？\n（関連するタスクのプロジェクト情報も削除されます）`;
        } else if (type === 'filter') {
            confirmMsg = `フィルター「${itemData.name}」を削除しますか？`;
        } else if (type === 'workspace') {
            confirmMsg = `ワークスペース「${itemData.name}」を削除しますか？`;
        }

        showMessageModal(confirmMsg, async () => {
            try {
                if (type === 'project') {
                    await deleteProject(itemData.id);
                    setCurrentFilter({ type: 'inbox', id: null });
                } else if (type === 'filter') {
                    await deleteFilter(itemData.id);
                    document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'inbox' } }));
                } else if (type === 'workspace') {
                    await deleteWorkspace(itemData.id);
                    // ワークスペース削除後のリダイレクト等は store/workspace.js 内でハンドリングされる
                }
            } catch (error) {
                console.error('Delete failed:', error);
                showMessageModal("削除に失敗しました。", 'error');
            }
        });
    });

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