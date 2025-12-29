// @miyter:20251229
// タスクの右クリックメニュー制御

import { deleteTask, updateTask } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { getStartOfDay } from '../../utils/date.js';
import { selectionState, toggleSelectionMode } from '../state/ui-state.js';

/**
 * 汎用的なコンテキストメニュー表示
 * @param {Object|null} task - 対象タスク (nullの場合はリスト全体のメニュー)
 * @param {number} x - 表示位置X
 * @param {number} y - 表示位置Y
 */

export function showTaskContextMenu(task, x, y) {
    document.getElementById('task-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'task-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-[100] animate-fade-in text-sm min-w-[200px] font-sans user-select-none text-gray-700 dark:text-gray-200';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const closeAndExec = (cb) => {
        menu.remove();
        if (cb) cb();
    };

    const isSelectionMode = selectionState.isSelectionMode;
    // タスクIDが選択されているかチェック。taskがnullなら選択されていない扱い
    const isTargetSelected = task && selectionState.selectedIds.has(task.id);
    // 選択中の件数
    const selectedCount = selectionState.selectedIds.size;

    // 一括操作モードかどうか
    const isBulk = isSelectionMode && isTargetSelected && selectedCount > 0;

    // 操作対象が存在するか (単一タスク または 複数選択)
    const hasTarget = !!task || isBulk;

    // 共通スタイル
    const itemClass = "w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between group relative";
    const disabledClass = "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent";

    const chevronSvg = `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;

    // メニューHTML構築
    let html = '';

    // 1. 日付変更 (サブメニュー)
    html += `
        <div class="${itemClass} ${!hasTarget ? disabledClass : ''}">
            <span>日付変更</span>
            ${chevronSvg}
            ${hasTarget ? `
            <div class="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover:block min-w-[120px]">
                <button id="ctx-date-today" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">今日</button>
                <button id="ctx-date-tomorrow" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">明日</button>
                <button id="ctx-date-next-week" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">来週</button>
            </div>
            ` : ''}
        </div>
    `;

    // 2. 削除
    html += `
        <button id="ctx-delete" class="${itemClass} ${!hasTarget ? disabledClass : ''} text-red-600 dark:text-red-400">
            <span>削除</span>
        </button>
    `;

    // セパレータ
    html += `<div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>`;

    // 3. タスク追加
    html += `
        <button id="ctx-add-task" class="${itemClass}">
            <span>タスク追加</span>
        </button>
    `;

    // 4. 並び替え (サブメニュー)
    html += `
        <div class="${itemClass}">
            <span>並び替え</span>
            ${chevronSvg}
            <div class="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover:block min-w-[120px]">
                <button id="ctx-sort-name" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">名前順</button>
                <button id="ctx-sort-date" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">日付順</button>
                <button id="ctx-sort-created" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">作成日順</button>
            </div>
        </div>
    `;

    // 5. 複数選択
    html += `
        <button id="ctx-multi-select" class="${itemClass}">
            <span class="flex items-center">
                複数選択
                ${isSelectionMode ? '<svg class="w-4 h-4 ml-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
            </span>
        </button>
    `;

    menu.innerHTML = html;
    document.body.appendChild(menu);

    // --- ロジック実装 ---

    // 対象タスクリストの特定 (一括 or 単一)
    const getTargetIds = () => {
        if (isBulk) return Array.from(selectionState.selectedIds);
        if (task) return [task.id];
        return [];
    };

    const handleUpdate = async (updates) => {
        const ids = getTargetIds();
        if (ids.length === 0) return;

        closeAndExec(async () => {
            const promises = ids.map(id => updateTask(id, updates));
            await Promise.all(promises);
        });
    };

    // 1. 日付変更ハンドラ
    if (hasTarget) {
        menu.querySelector('#ctx-date-today')?.addEventListener('click', () => {
            handleUpdate({ dueDate: getStartOfDay(new Date()) });
        });
        menu.querySelector('#ctx-date-tomorrow')?.addEventListener('click', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + 1);
            handleUpdate({ dueDate: d });
        });
        menu.querySelector('#ctx-date-next-week')?.addEventListener('click', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + (8 - d.getDay()));
            handleUpdate({ dueDate: d });
        });

        // 2. 削除ハンドラ
        menu.querySelector('#ctx-delete')?.addEventListener('click', () => {
            const ids = getTargetIds();
            const msg = ids.length > 1 ? `${ids.length}件のタスクを削除しますか？` : '削除しますか？';

            closeAndExec(() => {
                showMessageModal(msg, async () => {
                    const promises = ids.map(id => deleteTask(id));
                    await Promise.all(promises);
                    if (isBulk) toggleSelectionMode(false);
                });
            });
        });
    }

    // 3. タスク追加
    menu.querySelector('#ctx-add-task')?.addEventListener('click', () => {
        closeAndExec(() => {
            const input = document.getElementById('task-input-fld');
            if (input) input.focus();
        });
    });

    // 4. 並び替え
    menu.querySelector('#ctx-sort-name')?.addEventListener('click', () => closeAndExec(() => triggerSortChange('title_asc')));
    menu.querySelector('#ctx-sort-date')?.addEventListener('click', () => closeAndExec(() => triggerSortChange('dueDate_asc')));
    menu.querySelector('#ctx-sort-created')?.addEventListener('click', () => closeAndExec(() => triggerSortChange('createdAt_desc')));

    // 5. 複数選択
    menu.querySelector('#ctx-multi-select')?.addEventListener('click', () => {
        closeAndExec(() => {
            toggleSelectionMode(!isSelectionMode);
        });
    });

    // 閉じる処理
    const dismissMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    // 即時クリックイベントが発火するのを防ぐ
    setTimeout(() => document.addEventListener('click', dismissMenu), 0);
}

function triggerSortChange(value) {
    // 既存のソートドロップダウンのオプションをクリックすることで、
    // ラベルの更新とデータ更新の両方をトリガーする
    const options = document.querySelectorAll('.sort-option');
    const target = Array.from(options).find(opt => opt.dataset.value === value);

    if (target) {
        target.click();
    } else {
        // オプションが見つからない場合のフォールバック (直接更新)
        const sortTrigger = document.getElementById('sort-trigger');
        if (sortTrigger) {
            sortTrigger.dataset.value = value;
            import('../core/DataSyncManager.js').then(m => m.updateUI());
        }
    }
}