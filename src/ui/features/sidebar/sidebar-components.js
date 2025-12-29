/**
 * サイドバーの共有コンポーネント
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { deleteProject } from '../../../store/projects';
import { deleteFilter } from '../../../store/filters';
import { deleteWorkspace, getWorkspaces, setCurrentWorkspaceId } from '../../../store/workspace';
import { showFilterModal } from '../../modals/filter-modal.js';
import { showMessageModal } from '../../components';
import { showProjectModal } from '../../modals/project-modal.js';
import { showWorkspaceModal } from '../../modals/workspace-modal.js';

/**
 * リストアイテム要素を作成
 * 毎回 localStorage を見ないよう isCompact を引数で受け取る
 */
export function createSidebarItem(name, type, id, meta = {}, count = 0, densityLevel = 'normal') {
    const item = document.createElement('li');
    const { DENSITY_CLASSES, COLORS } = SIDEBAR_CONFIG;

    item.dataset.type = type;
    item.dataset.id = id;

    // Resolve padding class based on density level
    const pyClass = DENSITY_CLASSES[densityLevel] || DENSITY_CLASSES.normal;

    item.className = `group flex items-center justify-between px-3 ${pyClass} font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors sidebar-item-row select-none`;

    const iconMap = {
        project: `<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`,
        label: `<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="background-color: ${meta.color || COLORS.DEFAULT}"></span>`,
        timeblock: `<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="background-color: ${meta.color || COLORS.DEFAULT}"></span>`,
        duration: meta.iconHtml || `<span class="mr-3">⏱️</span>`,
        filter: meta.iconHtml || `<span class="mr-3">🔍</span>`
    };

    const iconHtml = iconMap[type] || `<span class="mr-3">🔹</span>`;
    const countHtml = count > 0 ? `<span class="text-gray-400 font-light mr-2" style="font-size: 0.85em;">${count}</span>` : '';

    item.innerHTML = `
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            ${iconHtml}
            <span class="truncate">${name}</span>
        </div>
        <div class="flex items-center">${countHtml}</div>
    `;

    return item;
}

export function showItemContextMenu(e, type, itemData) {
    const config = getMenuConfig(type, itemData);
    if (!config) return;

    document.getElementById('sidebar-context-menu')?.remove();

    const menu = buildMenuHTML(config);
    document.body.appendChild(menu);

    adjustMenuPosition(menu, e);
    setupMenuEvents(menu, config);
}

/**
 * 汎用的なコンテキストメニューを表示
 * @param {Event} e - event
 * @param {Array<{label: string, icon?: string, action: Function, danger?: boolean}>} items - menu items
 */
export function showCustomContextMenu(e, items) {
    e.preventDefault();
    document.querySelectorAll('.app-context-menu, #sidebar-context-menu').forEach(el => el.remove());

    const menu = document.createElement('div');
    menu.className = 'app-context-menu fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg py-1 z-[100] animate-fade-in text-sm min-w-[180px]';

    items.forEach((item, index) => {
        if (index > 0 && item.separator) {
            const sep = document.createElement('div');
            sep.className = 'border-t border-gray-100 dark:border-gray-700 my-1';
            menu.appendChild(sep);
        }

        const btn = document.createElement('button');
        const colorClass = item.danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';
        btn.className = `flex w-full items-center px-4 py-2 text-left transition ${colorClass}`;

        // アイコンがあれば追加（簡易的）
        let iconHtml = '';
        if (item.icon) {
            iconHtml = `<span class="mr-2 w-4 h-4">${item.icon}</span>`;
        } else if (item.label.includes('ウィンドウ')) {
            // デフォルトアイコン
            iconHtml = `<svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>`;
        }

        btn.innerHTML = `${iconHtml}${item.label}`;
        btn.onclick = (ev) => {
            ev.stopPropagation();
            menu.remove();
            item.action();
        };
        menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    adjustMenuPosition(menu, e);

    const cleanup = () => {
        menu.remove();
        document.removeEventListener('click', cleanup);
        document.removeEventListener('contextmenu', cleanup);
    };
    // contextmenuイベント直後にclickが発火することへの対策でsetTimeout
    setTimeout(() => {
        document.addEventListener('click', cleanup);
        document.addEventListener('contextmenu', cleanup); // 他の場所で右クリックしたら閉じる
    }, 50);
}


import { APP_EVENTS } from '../../../core/event-constants';

function dispatchRoute(page, id = null) {
    document.dispatchEvent(new CustomEvent(APP_EVENTS.ROUTE_CHANGE, { detail: { page, id } }));
}

function getMenuConfig(type, itemData) {
    const configs = {
        project: {
            editLabel: '編集',
            onEdit: () => showProjectModal(itemData),
            onDelete: async () => {
                await deleteProject(itemData.id);
                dispatchRoute('inbox');
            },
            deleteMsg: `${itemData.name} を削除するか？\n（関連タスクのプロジェクト情報も削除される）`
        },
        filter: {
            editLabel: '編集 / 名前変更',
            onEdit: () => showFilterModal(itemData),
            onDelete: async () => {
                await deleteFilter(itemData.id);
                dispatchRoute('inbox');
            },
            deleteMsg: `フィルター「${itemData.name}」を削除するか？`
        },
        workspace: {
            editLabel: '名前変更',
            onEdit: () => showWorkspaceModal(itemData),
            onDelete: async () => {
                const workspaces = getWorkspaces();
                if (workspaces.length <= 1) throw new Error("最後のワークスペースは削除できない。");

                await deleteWorkspace(itemData.id);

                const remaining = getWorkspaces().filter(ws => ws.id !== itemData.id);
                if (remaining.length > 0) {
                    setCurrentWorkspaceId(remaining[0].id);
                    dispatchRoute('dashboard');
                }
            },
            deleteMsg: `ワークスペース「${itemData.name}」を本当に削除するか？\n関連データもすべて削除される。`
        }
    };
    return configs[type];
}

function buildMenuHTML(config) {
    const menu = document.createElement('div');
    menu.id = 'sidebar-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-[100] animate-fade-in text-sm min-w-[160px]';
    menu.innerHTML = `
        <button id="ctx-edit-btn" class="flex w-full items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-200">
            <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            ${config.editLabel}
        </button>
        <button id="ctx-delete-btn" class="flex w-full items-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition border-t border-gray-100 dark:border-gray-700">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;
    return menu;
}

function adjustMenuPosition(menu, e) {
    const padding = 8;
    const { clientX: x, clientY: y } = e;
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    menu.style.visibility = 'hidden';
    const { width: mW, height: mH } = menu.getBoundingClientRect();

    let left = x;
    let top = y;

    if (x + mW > winW) left = x - mW;
    if (y + mH > winH) top = y - mH;

    menu.style.left = `${Math.max(padding, left)}px`;
    menu.style.top = `${Math.max(padding, top)}px`;
    menu.style.visibility = 'visible';
}

function setupMenuEvents(menu, config) {
    const cleanup = () => {
        menu.remove();
        document.removeEventListener('click', cleanup);
        document.removeEventListener('keydown', escKey);
    };
    const escKey = (ev) => ev.key === 'Escape' && cleanup();

    setTimeout(() => {
        document.addEventListener('click', cleanup);
        document.addEventListener('keydown', escKey);
    }, 0);

    menu.querySelector('#ctx-edit-btn').onclick = (ev) => {
        ev.stopPropagation();
        cleanup();
        config.onEdit();
    };

    menu.querySelector('#ctx-delete-btn').onclick = (ev) => {
        ev.stopPropagation();
        cleanup();
        showMessageModal({
            message: config.deleteMsg,
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await config.onDelete();
                } catch (err) {
                    showMessageModal({ message: "削除に失敗した: " + err.message, type: 'error' });
                }
            }
        });
    };
}