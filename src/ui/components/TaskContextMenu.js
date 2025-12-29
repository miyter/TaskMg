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
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-[100] animate-fade-in text-sm min-w-[180px] font-sans user-select-none text-gray-700 dark:text-gray-200';
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

    let html = '';

    // 「複数選択モード」かつ「選択済みタスクの上でのクリック」の場合、一括操作メニューを表示
    // または、選択モード中に何もアイテムがないところをクリックした場合でも、一括操作がアクティブなら表示する？
    // いや、タスクリスト背景クリックで一括メニューはおかしい。背景クリックは「追加」や「並び替え」にすべき。
    // 「タスク上のクリック」で、そのタスクが選択状態なら一括操作。
    if (isSelectionMode && isTargetSelected && selectedCount > 0) {
        html += `
            <div class="px-3 py-1 text-xs text-gray-500 font-bold border-b border-gray-100 dark:border-gray-700 mb-1">
                ${selectedCount}件を選択中
            </div>
            <button id="ctx-bulk-today" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                今日にする
            </button>
            <button id="ctx-bulk-tomorrow" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                明日にする
            </button>
            <button id="ctx-bulk-next-week" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                来週にする
            </button>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
            <button id="ctx-bulk-delete" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
                一括削除
            </button>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        `;
    } else if (task) {
        // 単一タスク上のクリック（未選択、あるいは通常モード）
        // 通常のタスク操作メニュー
        html += `
            <div class="border-b border-gray-100 dark:border-gray-700 pb-1 mb-1">
                 <button id="ctx-today" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <svg class="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    今日
                </button>
                <button id="ctx-tomorrow" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <svg class="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    明日
                </button>
                <button id="ctx-next-week" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <svg class="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
                    来週
                </button>
            </div>
            <button id="ctx-delete-task-btn" class="flex w-full items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                削除
            </button>
            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
        `;
    }

    // 共通メニュー (どんなときも表示：タスク追加、並び替え、選択モード切替)
    html += `
        <button id="ctx-add-task" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            タスクを追加
        </button>
        <div class="relative group">
            <button class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition justify-between w-full">
                <span class="flex items-center"><svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>並び替え</span>
                <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            <!-- サブメニュー -->
            <div class="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover:block min-w-[120px]">
                 <button id="ctx-sort-name" class="flex w-full items-center px-3 py-2 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">名前順</button>
                 <button id="ctx-sort-date" class="flex w-full items-center px-3 py-2 text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">日付順</button>
            </div>
        </div>
        <button id="ctx-select-mode" class="flex w-full items-center px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            ${isSelectionMode ? '複数選択を終了' : '複数選択を開始'}
        </button>
    `;

    menu.innerHTML = html;
    document.body.appendChild(menu);

    // --- イベントハンドラ ---

    const setupBtn = (id, handler) => {
        const el = menu.querySelector('#' + id);
        if (el) el.addEventListener('click', handler);
    };

    // 単一タスク用
    if (task && !isTargetSelected) {
        setupBtn('ctx-today', () => closeAndExec(() => updateTask(task.id, { dueDate: getStartOfDay(new Date()) })));
        setupBtn('ctx-tomorrow', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + 1);
            closeAndExec(() => updateTask(task.id, { dueDate: d }));
        });
        setupBtn('ctx-next-week', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + (8 - d.getDay()));
            closeAndExec(() => updateTask(task.id, { dueDate: d }));
        });
        setupBtn('ctx-delete-task-btn', () => {
            closeAndExec(() => showMessageModal('削除しますか？', async () => await deleteTask(task.id)));
        });
    }

    // 一括操作用
    if (isSelectionMode && isTargetSelected && selectedCount > 0) {
        const executeBulk = (updates) => {
            closeAndExec(async () => {
                const promises = Array.from(selectionState.selectedIds).map(id => updateTask(id, updates));
                await Promise.all(promises);
            });
        };

        setupBtn('ctx-bulk-today', () => executeBulk({ dueDate: getStartOfDay(new Date()) }));
        setupBtn('ctx-bulk-tomorrow', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + 1);
            executeBulk({ dueDate: d });
        });
        setupBtn('ctx-bulk-next-week', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + (8 - d.getDay()));
            executeBulk({ dueDate: d });
        });
        setupBtn('ctx-bulk-delete', () => {
            closeAndExec(() => {
                showMessageModal(`${selectedCount}件のタスクを削除しますか？`, async () => {
                    const promises = Array.from(selectionState.selectedIds).map(id => deleteTask(id));
                    await Promise.all(promises);
                    toggleSelectionMode(false);
                });
            });
        });
    }

    // 共通
    setupBtn('ctx-add-task', () => {
        closeAndExec(() => {
            const input = document.getElementById('task-input-fld');
            if (input) input.focus();
        });
    });

    setupBtn('ctx-sort-name', () => closeAndExec(() => triggerSortChange('title_asc')));
    setupBtn('ctx-sort-date', () => closeAndExec(() => triggerSortChange('dueDate_asc')));

    setupBtn('ctx-select-mode', () => {
        closeAndExec(() => {
            toggleSelectionMode(!isSelectionMode);
        });
    });

    const dismissMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };

    setTimeout(() => document.addEventListener('click', dismissMenu), 0);
}

function triggerSortChange(value) {
    // 既存のTaskViewのDOM構造に依存したハック
    // task-view.js 内の sortSelect または sortTrigger を探す
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = value;
        sortSelect.dispatchEvent(new Event('change'));
    } else {
        // sort-trigger (ドロップダウン) パターン
        const sortTrigger = document.getElementById('sort-trigger');
        if (sortTrigger) {
            // TaskViewがイベント監視しているか不明だが、カスタムイベントを送る
            // しかしTaskViewはdatasetを見ているだけかもしれない。
            // 確実にリロードさせるためにカスタムイベントを発火するほうが安全。
            document.dispatchEvent(new CustomEvent('request-sort-change', { detail: { sort: value } }));
        }
    }
}