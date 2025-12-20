// @ts-nocheck
// @miyter:20251221
// サイドバーのUIコンポーネント（リストアイテム、コンテキストメニュー）

import { deleteProject } from '../store/projects.js';
import { deleteFilter } from '../store/filters.js';
import { deleteWorkspace } from '../store/workspace.js';
import { showFilterModal } from './filter-modal.js';
import { showMessageModal } from './components.js';
import { showProjectModal } from './modal/project-modal.js';
import { showWorkspaceModal } from './modal/workspace-modal.js';
import { setCurrentFilter } from './ui-view-manager.js';

/**
 * リストアイテム要素を作成
 */
export function createSidebarItem(name, type, id, color, count) {
    const item = document.createElement('li');
    const isCompact = localStorage.getItem('sidebar_compact') === 'true';
    
    item.dataset.type = type;
    item.dataset.id = id;
    item.className = `group flex items-center justify-between px-3 ${isCompact ? 'py-0.5' : 'py-1.5'} font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors sidebar-item-row`;

    const iconHtml = type === 'project' 
        ? `<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`
        : `<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="background-color: ${color || '#a0aec0'}"></span>`;

    const countHtml = count > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${count}</span>` : '';

    item.innerHTML = `
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            ${iconHtml}
            <span class="truncate">${name}</span>
        </div>
        <div class="flex items-center">${countHtml}</div>
    `;

    return item;
}

/**
 * 右クリックメニューを表示
 */
export function showItemContextMenu(e, type, itemData) {
    const configs = {
        project: {
            editLabel: '編集',
            onEdit: () => showProjectModal(itemData),
            onDelete: async () => {
                await deleteProject(itemData.id);
                setCurrentFilter({ type: 'inbox', id: null });
            },
            deleteMsg: `${itemData.name} を削除しますか？\n（関連タスクのプロジェクト情報も削除されます）`
        },
        filter: {
            editLabel: '編集 / 名前変更',
            onEdit: () => showFilterModal(itemData),
            onDelete: async () => {
                await deleteFilter(itemData.id);
                document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'inbox' } }));
            },
            deleteMsg: `フィルター「${itemData.name}」を削除しますか？`
        },
        workspace: {
            editLabel: '名前変更',
            onEdit: () => showWorkspaceModal(itemData),
            onDelete: async () => await deleteWorkspace(itemData.id),
            deleteMsg: `ワークスペース「${itemData.name}」を削除しますか？`
        }
    };

    const config = configs[type];
    if (!config) return;

    document.getElementById('sidebar-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'sidebar-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[160px]';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    menu.innerHTML = `
        <button id="ctx-edit-btn" class="flex w-full items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            ${config.editLabel}
        </button>
        <button id="ctx-delete-btn" class="flex w-full items-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition border-t border-gray-100 dark:border-gray-700">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;

    document.body.appendChild(menu);

    menu.querySelector('#ctx-edit-btn').onclick = () => { menu.remove(); config.onEdit(); };
    menu.querySelector('#ctx-delete-btn').onclick = () => {
        menu.remove();
        showMessageModal(config.deleteMsg, async () => {
            try { await config.onDelete(); }
            catch (err) { showMessageModal("失敗しました", 'error'); }
        });
    };

    const close = (ev) => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener('click', close); } };
    setTimeout(() => document.addEventListener('click', close), 0);
}