/**
 * タスク単体（1行分）の描画とイベント
 * TypeScript化: 2025-12-29
 */

import { Project, Task, TimeBlock } from '../../store/schema';
import { updateTaskStatus } from '../../store/store';
import { getTimeBlocks } from '../../store/timeblocks';
import { openModalDirect } from '../../store/ui/modal-store';
import { formatDateCompact, getTaskDateColor } from '../../utils/date';
import { simpleMarkdownToHtml } from '../../utils/markdown';
import { SelectionState, toggleTaskSelection } from '../state/ui-state';
import { showTaskContextMenu } from './task-context-menu';


interface TaskItemContext {
    timeBlockId?: string | null;
    duration?: number | null;
    [key: string]: any;
}

export function createTaskItem(task: Task, allProjects: Project[], selectionState: SelectionState = { isSelectionMode: false, selectedIds: new Set() }, context: TaskItemContext = {}) {
    const { isSelectionMode, selectedIds } = selectionState;
    const isSelected = task.id ? selectedIds.has(task.id) : false;

    const li = document.createElement('li');
    if (task.id) li.setAttribute('data-id', task.id);

    // 選択モード以外はドラッグ可能 (所要時間フィルタ時は順序不定のため不可)
    // context.duration != null を判定
    const isDurationView = context.duration !== null && context.duration !== undefined;
    li.setAttribute('draggable', (isSelectionMode || isDurationView) ? 'false' : 'true');

    const isCompleted = task.status === 'completed';
    const dateText = formatDateCompact(task.dueDate ?? null);
    const dateColorClass = getTaskDateColor(task.dueDate ?? null);
    const isRecurring = !!(task.recurrence && task.recurrence.type !== 'none');
    const isOneTime = !!task.dueDate && !isRecurring;

    // @ts-ignore: getTimeBlocks() returns possibly untyped
    const timeBlocks = getTimeBlocks() as TimeBlock[];
    const timeBlock = task.timeBlockId ? timeBlocks.find(tb => tb.id === task.timeBlockId) : null;

    // コンテキストに応じた表示制御
    // 時間帯フィルタ中は時間帯バッジを非表示
    const showTimeBlock = context.timeBlockId === null || context.timeBlockId === undefined;
    // 所要時間フィルタ中は所要時間バッジを非表示
    const showDuration = context.duration === null || context.duration === undefined;

    // スタイル調整
    let baseClass = "group flex items-start gap-2 sm:gap-3 py-1.5 px-2 rounded -mx-2 transition-all duration-200 border border-transparent";
    let stateClass = "";

    if (isSelectionMode) {
        if (isSelected) {
            stateClass = "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 cursor-pointer";
        } else {
            stateClass = "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700 cursor-pointer";
        }
    } else {
        // 通常モード
        if (isCompleted) {
            stateClass = "opacity-60 bg-gray-50 dark:bg-gray-900/50 cursor-grab active:cursor-grabbing";
        } else {
            stateClass = "hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-100 dark:hover:border-gray-700 cursor-grab active:cursor-grabbing";
        }
    }

    li.className = `${baseClass} ${stateClass} `;

    // チェックボックスの見た目
    let checkboxClass = "";
    let checkboxContent = "";

    if (isSelectionMode) {
        checkboxClass = isSelected
            ? 'bg-blue-600 border-blue-600 text-white'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent hover:border-blue-500';
        checkboxContent = '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
        if (!isSelected) {
            checkboxClass += " text-transparent";
        }
    } else {
        checkboxClass = isCompleted
            ? 'bg-blue-500 border-blue-500 text-white'
            : 'border-gray-400 dark:border-gray-500 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-transparent text-transparent hover:text-blue-500 cursor-pointer';
        checkboxContent = '<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
    }

    // ハンバーガーアイコンを削除し、全体をドラッグハンドル化
    li.innerHTML = `
    <div class="task-checkbox mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors z-10 ${checkboxClass}" >
        ${checkboxContent}
        </div>

    <div class="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-2 items-center pointer-events-none">
        <div class="col-span-1 sm:col-span-8 flex flex-wrap sm:flex-nowrap items-baseline gap-x-2 gap-y-0.5 pointer-events-auto min-w-0 pr-1">
            <div class="leading-snug truncate font-medium transition-colors ${isCompleted && !isSelectionMode ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'} flex-shrink-0 max-w-full">${task.title}</div>
            ${task.description ? `<div class="text-xs text-gray-400 font-light truncate max-w-[180px] sm:max-w-[240px]">${simpleMarkdownToHtml(task.description.split('\n')[0]).replace(/<\/?p[^>]*>/g, '')}</div>` : ''}
        </div>

        <div class="col-span-1 sm:col-span-4 flex items-center sm:justify-end gap-1.5 text-xs h-full mt-1 sm:mt-0 overflow-hidden pointer-events-auto">
            ${isRecurring ? `<div class="text-blue-500 dark:text-blue-400 flex-shrink-0" title="繰り返し">🔁</div>` : ''}
            ${isOneTime ? `<div class="text-gray-400 dark:text-gray-500 flex-shrink-0" title="期限あり">▶️</div>` : ''}

            ${showTimeBlock ? `<div class="flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 max-w-[140px]" title="${timeBlock ? `${timeBlock.start} - ${timeBlock.end}` : '時間帯未定'}">
                    <span class="w-2 h-2 rounded-full mr-1.5 flex-shrink-0" style="background-color: ${timeBlock ? timeBlock.color : '#cbd5e1'}"></span>
                    <span class="truncate font-mono text-[11px]">${timeBlock ? `${timeBlock.start} - ${timeBlock.end}` : '未定'}</span>
                </div>` : ''}

            ${showDuration ? `<div class="flex items-center text-gray-500 dark:text-gray-400 whitespace-nowrap" title="所要時間: ${task.duration || 0}分">
                    <span class="mr-0.5 text-[10px]">⏱️</span>${task.duration || 0}m
                </div>` : ''}

            ${dateText ? `<div class="flex items-center ${dateColorClass} bg-gray-50 dark:bg-gray-800/50 px-1.5 py-0.5 rounded flex-shrink-0">${dateText}</div>` : ''}
        </div>
    </div>
`;

    // ドラッグイベント
    if (!isSelectionMode && !isDurationView) {
        li.addEventListener('dragstart', (e) => {
            // チェックボックス等の上ではドラッグ開始しないように制御
            if (e.target instanceof HTMLElement && e.target.closest('.task-checkbox')) {
                e.preventDefault();
                return;
            }

            li.classList.add('opacity-50');
            if (task.id) {
                e.dataTransfer?.setData('text/plain', task.id); // フォールバック
                e.dataTransfer?.setData('application/x-taskmg-id', task.id); // 識別用
            }
            if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
        });
        li.addEventListener('dragend', () => li.classList.remove('opacity-50'));
    }

    // チェックボックスクリック時の動作
    const cb = li.querySelector('.task-checkbox');
    cb?.addEventListener('click', async (e) => {
        e.stopPropagation(); // ドラッグや行クリックの伝播を止める
        if (!task.id) return;

        if (isSelectionMode) {
            toggleTaskSelection(task.id);
        } else {
            await updateTaskStatus(task.id, isCompleted ? 'todo' : 'completed');
        }
    });

    // 行クリック時の動作
    li.addEventListener('click', (e) => {
        if (!task.id) return;
        if (e.target instanceof HTMLElement && e.target.closest('.task-checkbox')) return;

        if (isSelectionMode) {
            toggleTaskSelection(task.id);
        } else {
            openModalDirect('task-detail', task);
        }
    });

    // コンテキストメニュー
    li.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!task.id) return;

        if (isSelectionMode && !isSelected) {
            toggleTaskSelection(task.id);
        }

        showTaskContextMenu(task, e.clientX, e.clientY);
    });

    return li;
}
