// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: createSidebarItemの拡張（アイコン注入対応）、コンテキストメニューの整理
 */

import { deleteProject } from '../store/projects.js';
import { deleteFilter } from '../store/filters.js';
import { deleteWorkspace, getWorkspaces, setCurrentWorkspaceId } from '../store/workspace.js';
import { showFilterModal } from './filter-modal.js';
import { showMessageModal } from './components.js';
import { showProjectModal } from './modal/project-modal.js';
import { showWorkspaceModal } from './modal/workspace-modal.js';
import { setCurrentFilter } from './ui-view-manager.js';

/**
 * リストアイテム要素を作成
 * @param {string} name 表示名
 * @param {string} type アイテムタイプ (project, label, timeblock, duration, filter)
 * @param {string} id ID
 * @param {string|null} meta カラーコード または アイコンHTML文字列
 * @param {number} count 件数
 */
export function createSidebarItem(name, type, id, meta, count) {
    const item = document.createElement('li');
    // 設定値の統一
    const isCompact = localStorage.getItem('sidebar_compact') === 'true';
    
    item.dataset.type = type;
    item.dataset.id = id;
    item.className = `group flex items-center justify-between px-3 ${isCompact ? 'py-0.5' : 'py-1.5'} font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors sidebar-item-row select-none`;

    let iconHtml = '';

    // アイコン生成ロジックの分岐
    if (type === 'project') {
        iconHtml = `<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;
    } else if (type === 'label' || type === 'timeblock') {
        // meta は colorCode として扱う
        const color = meta || '#a0aec0';
        iconHtml = `<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="background-color: ${color}"></span>`;
    } else if (type === 'duration' || type === 'filter') {
        // meta は iconHTML として扱う（渡されていれば使用、なければデフォルト）
        if (meta && typeof meta === 'string' && meta.includes('<')) {
            iconHtml = meta;
        } else {
            // フォールバック
            iconHtml = `<span class="mr-3 text-sm">🔹</span>`;
        }
    }

    const safeCount = typeof count === 'number' ? count : 0;
    const countHtml = safeCount > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${safeCount}</span>` : '';

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
 * 右クリックメニューを表示（メイン処理）
 */
export function showItemContextMenu(e, type, itemData) {
    const config = getMenuConfig(type, itemData);
    if (!config) return;

    // 既存メニュー削除
    document.getElementById('sidebar-context-menu')?.remove();

    // 1. HTML生成
    const menu = buildMenuHTML(config);
    document.body.appendChild(menu);

    // 2. 位置調整
    adjustMenuPosition(menu, e);

    // 3. イベントバインド
    setupMenuEvents(menu, config);
}

/**
 * メニュー設定の取得
 */
function getMenuConfig(type, itemData) {
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
            onDelete: async () => {
                const workspaces = getWorkspaces();
                if (workspaces.length <= 1) {
                    throw new Error("最後のワークスペースは削除できません。");
                }
                
                await deleteWorkspace(itemData.id);
                
                // 削除後の遷移処理
                const remaining = getWorkspaces().filter(ws => ws.id !== itemData.id);
                if (remaining.length > 0) {
                    setCurrentWorkspaceId(remaining[0].id);
                }
            },
            deleteMsg: `ワークスペース「${itemData.name}」を本当に削除しますか？\n\nこの操作は取り消せません。関連する全データ（プロジェクト・タスクなど）が削除されます。`
        }
    };
    return configs[type];
}

/**
 * メニューHTMLの生成
 */
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

/**
 * メニュー位置の調整
 */
function adjustMenuPosition(menu, e) {
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    const rect = menu.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    if (rect.right > winWidth) {
        menu.style.left = `${winWidth - rect.width - 8}px`;
    }
    if (rect.bottom > winHeight) {
        menu.style.top = `${winHeight - rect.height - 8}px`;
    }
}

/**
 * イベントハンドラの設定
 */
function setupMenuEvents(menu, config) {
    const close = () => { 
        menu.remove(); 
        document.removeEventListener('click', closeListener);
        document.removeEventListener('keydown', escListener);
    };

    // クリックで閉じる
    const closeListener = (ev) => { 
        if (!menu.contains(ev.target)) close(); 
    };

    // Escキーで閉じる
    const escListener = (ev) => {
        if (ev.key === 'Escape') close();
    };

    // イベント登録（即座に閉じないよう遅延）
    setTimeout(() => {
        document.addEventListener('click', closeListener);
        document.addEventListener('keydown', escListener);
    }, 0);

    menu.querySelector('#ctx-edit-btn').onclick = () => { 
        close(); 
        config.onEdit(); 
    };

    menu.querySelector('#ctx-delete-btn').onclick = () => {
        close();
        showMessageModal({
            message: config.deleteMsg,
            type: 'confirm',
            onConfirm: async () => {
                try { 
                    await config.onDelete();
                    if (config.onSuccess) showMessageModal(config.onSuccess, "success");
                } catch (err) { 
                    // エラーはここで一元管理
                    showMessageModal({ message: "処理に失敗しました: " + err.message, type: 'error' });
                }
            }
        });
    };
}