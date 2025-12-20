// @ts-nocheck
// @miyter:20251221
// サイドバーのドラッグ＆ドロップ機能管理

import { updateTask } from '../store/store.js';

const DRAG_OVER_CLASSES = ['bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400'];

/**
 * 指定された要素にドロップゾーンを設定
 */
export function setupDropZone(element, type, value = null) {
    if (!element) return;

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add(...DRAG_OVER_CLASSES);
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove(...DRAG_OVER_CLASSES);
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove(...DRAG_OVER_CLASSES);
        
        const taskId = e.dataTransfer.getData('text/plain');
        if (!taskId) return;

        await handleTaskDrop(taskId, type, value);
    });
}

/**
 * ドロップ時のタスク更新処理
 */
async function handleTaskDrop(taskId, type, value) {
    const updates = {};

    switch (type) {
        case 'inbox':
            updates.projectId = null;
            break;
        case 'project':
            if (value) updates.projectId = value;
            break;
        case 'timeblock':
            // 'unassigned' または null の場合は未定(null)として扱う
            updates.timeBlockId = (value === 'unassigned' || value === null) ? null : value;
            break;
        case 'duration':
            if (value) updates.duration = parseInt(value, 10);
            break;
        default:
            return;
    }

    try {
        if (Object.keys(updates).length > 0) {
            await updateTask(taskId, updates);
        }
    } catch (error) {
        console.error(`[Drop Error] Type: ${type}, Task: ${taskId}`, error);
    }
}