/**
 * タスクモーダル統合管理
 * TypeScript化: 2025-12-29
 */
import { Task } from '../../store/schema'; // Task型インポート
import { buildModalHTML } from './modal-dom-generator';
import { setupTaskModalEvents } from './task-modal-ctrl';

export { showLabelModal } from './label-modal';
export { showProjectModal } from './project-modal';
export { showWorkspaceModal } from './workspace-modal';

const handleEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        closeTaskModal();
    }
};

/**
 * 初期化（現在は動的登録のため空）
 */
export function initTaskModal() { }

/**
 * タスク編集モーダルを開く
 */
export function openTaskEditModal(task: Task) {
    let container = document.getElementById('modal-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'modal-container';
        document.body.appendChild(container);
    }

    container.innerHTML = buildModalHTML(task);

    // イベント委譲
    setupTaskModalEvents(container, task, closeTaskModal);

    // Escapeキーイベントを動的に登録
    document.addEventListener('keydown', handleEscapeKey);
}

/**
 * モーダルを閉じる
 */
export function closeTaskModal() {
    const container = document.getElementById('modal-container');
    if (container) {
        container.innerHTML = '';
        document.removeEventListener('keydown', handleEscapeKey);
    }
}

interface TaskModalOptions {
    projectId?: string;
    labelIds?: string[];
    dueDate?: any; // Timestamp or Date
    timeBlockId?: string;
}

/**
 * タスクモーダルを開く（汎用エイリアス）
 * @param {Task|null} task - 編集するタスク（nullの場合は新規作成）
 * @param {TaskModalOptions} options - オプション
 */
export function showTaskModal(task: Task | null = null, options: TaskModalOptions = {}) {
    // 新規作成の場合、optionsからタスクオブジェクトを構築
    const taskData: any = task || {
        id: 'temp-new-task', // 仮ID
        title: '',
        description: '',
        projectId: options.projectId || null,
        labelIds: options.labelIds || [],
        dueDate: options.dueDate || null,
        timeBlockId: options.timeBlockId || null,
        status: 'active',
        recurrence: { type: 'none' },
        createdAt: null,
        updatedAt: null
    };

    openTaskEditModal(taskData as Task);
}
