/**
 * 更新日: 2025-12-21
 * 内容: 定数連携、バリデーション強化、エラー通知の標準化
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { updateTask } from '../store/store.js';
import { showMessageModal } from './components.js';

/**
 * 指定された要素にドロップゾーンを設定
 */
export function setupDropZone(element, type, value = null) {
    if (!element) return;

    let enterCount = 0;
    const classes = SIDEBAR_CONFIG.CLASSES.DRAG_OVER;

    element.addEventListener('dragenter', (e) => {
        e.preventDefault();
        enterCount++;
        element.classList.add(...classes);
    });

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!element.classList.contains('ring-2')) {
            element.classList.add(...classes);
        }
    });

    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        enterCount--;
        if (enterCount <= 0) {
            element.classList.remove(...classes);
            enterCount = 0;
        }
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        enterCount = 0;
        element.classList.remove(...classes);
        
        const taskId = e.dataTransfer.getData('text/plain');
        if (!taskId) return;

        await handleTaskDrop(taskId, type, value);
    });
}

async function handleTaskDrop(taskId, type, value) {
    const updates = {};
    const { DURATION_LIMITS } = SIDEBAR_CONFIG;

    switch (type) {
        case 'inbox':
            updates.projectId = null;
            break;
        case 'project':
            if (value) updates.projectId = value;
            break;
        case 'timeblock':
            updates.timeBlockId = (value === 'unassigned' || value === null) ? null : value;
            break;
        case 'duration': {
            const dur = parseInt(value, 10);
            if (!isNaN(dur) && dur >= DURATION_LIMITS.MIN && dur <= DURATION_LIMITS.MAX) {
                updates.duration = dur;
            } else {
                showMessageModal({ message: `所要時間は ${DURATION_LIMITS.MIN}〜${DURATION_LIMITS.MAX} 分の範囲で設定してください。`, type: "error" });
                return;
            }
            break;
        }
        default:
            console.error(`[Drop] Unknown drop type: ${type}`);
            showMessageModal({ message: "不正な操作です。", type: "error" });
            return;
    }

    try {
        if (Object.keys(updates).length > 0) {
            await updateTask(taskId, updates);
        }
    } catch (error) {
        console.error(`[Drop Error] Type: ${type}, Task: ${taskId}`, error);
        showMessageModal({ message: "タスクの更新に失敗しました。通信環境を確認してください。", type: 'error' });
    }
}