/**
 * サイドバーへのドラッグ&ドロップ制御
 */
import { updateTask } from '../../../store/store';
import { showMessageModal } from '../../components';
import { SIDEBAR_CONFIG } from './sidebar-constants';

export function setupDropZone(element: HTMLElement, type: string, value: string | null = null) {
    if (!element) return;

    let enterCount = 0;
    const classes = SIDEBAR_CONFIG.CLASSES.DRAG_OVER;

    element.addEventListener('dragenter', (e: DragEvent) => {
        e.preventDefault();
        enterCount++;
        element.classList.add(...classes);
    });

    element.addEventListener('dragover', (e: DragEvent) => {
        e.preventDefault();
        if (!element.classList.contains('ring-2')) {
            element.classList.add(...classes);
        }
    });

    element.addEventListener('dragleave', (e: DragEvent) => {
        e.preventDefault();
        enterCount--;
        if (enterCount <= 0) {
            element.classList.remove(...classes);
            enterCount = 0;
        }
    });

    element.addEventListener('drop', async (e: DragEvent) => {
        e.preventDefault();
        enterCount = 0;
        element.classList.remove(...classes);

        if (!e.dataTransfer) return;
        const taskId = e.dataTransfer.getData('application/x-taskmg-id');
        // テキスト選択ドラッグなどで text/plain が入ってくる場合があるため、
        // 独自のデータ型のみを信頼して処理する
        if (!taskId) return;

        await handleTaskDrop(taskId, type, value);
    });
}

async function handleTaskDrop(taskId: string, type: string, value: string | null) {
    const updates: Record<string, any> = {};
    const { DURATION_LIMITS } = SIDEBAR_CONFIG;

    switch (type) {
        case 'inbox':
            updates.projectId = null;
            break;
        case 'project':
            if (value) updates.projectId = value;
            break;
        case 'timeblock':
            updates.timeBlockId = (value === 'unassigned' || !value) ? null : value;
            break;
        case 'duration': {
            const dur = value ? parseInt(value, 10) : NaN;
            if (!isNaN(dur) && dur >= DURATION_LIMITS.MIN && dur <= DURATION_LIMITS.MAX) {
                updates.duration = dur;
            } else {
                showMessageModal({
                    message: `所要時間は ${DURATION_LIMITS.MIN}〜${DURATION_LIMITS.MAX} 分の範囲で設定してくれ。`,
                    type: "error"
                });
                return;
            }
            break;
        }
        default:
            console.error(`[Drop] Unknown drop type: ${type}`);
            showMessageModal({ message: "不正な操作だ。", type: "error" });
            return;
    }

    try {
        if (Object.keys(updates).length > 0) {
            await updateTask(taskId, updates);
        }
    } catch (error) {
        console.error(`[Drop Error] Type: ${type}, Task: ${taskId}`, error);
        showMessageModal({
            message: "タスクの更新に失敗したぞ。通信環境を確認してくれ。",
            type: 'error'
        });
    }
}
