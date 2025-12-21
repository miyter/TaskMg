// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: エラー通知の追加、ログ強化、バリデーション改善
 */

import { updateTask } from '../store/store.js';
import { showMessageModal } from './components.js';

const DRAG_OVER_CLASSES = ['bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400'];

/**
 * 指定された要素にドロップゾーンを設定
 */
export function setupDropZone(element, type, value = null) {
    if (!element) return;

    // 子要素を跨いだ時のちらつき防止用カウンター
    let enterCount = 0;

    element.addEventListener('dragenter', (e) => {
        e.preventDefault();
        enterCount++;
        element.classList.add(...DRAG_OVER_CLASSES);
    });

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        // dragoverでもクラスを維持（念のため）
        if (!element.classList.contains('ring-2')) {
            element.classList.add(...DRAG_OVER_CLASSES);
        }
    });

    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        enterCount--;
        if (enterCount <= 0) {
            element.classList.remove(...DRAG_OVER_CLASSES);
            enterCount = 0; // カウンターリセット
        }
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        enterCount = 0;
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
            // 数値変換とバリデーション
            const dur = parseInt(value, 10);
            if (!isNaN(dur) && dur > 0) {
                updates.duration = dur;
            } else {
                console.warn("[Drop] Invalid duration value:", value);
                // エラー通知を追加
                showMessageModal({ message: "無効な所要時間です。", type: "error" });
                return;
            }
            break;
        default:
            console.warn(`[Drop] Unknown drop type: ${type}`);
            return;
    }

    try {
        if (Object.keys(updates).length > 0) {
            await updateTask(taskId, updates);
        }
    } catch (error) {
        console.error(`[Drop Error] Type: ${type}, Task: ${taskId}`, error);
        showMessageModal({ message: "タスクの更新に失敗しました", type: 'error' });
    }
}