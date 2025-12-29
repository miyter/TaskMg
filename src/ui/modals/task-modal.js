/**
 * タスクモーダル統合管理
 */
import { buildModalHTML } from './modal-dom-generator.js';
import { setupTaskModalEvents } from './task-modal-ctrl.js';

export { showLabelModal } from './label-modal.js';
export { showProjectModal } from './project-modal.js';
export { showWorkspaceModal } from './workspace-modal.js';

const handleEscapeKey = (e) => {
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
export function openTaskEditModal(task) {
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

/**
 * タスクモーダルを開く（汎用エイリアス）
 * @param {Object|null} task - 編集するタスク（nullの場合は新規作成）
 * @param {Object} options - オプション（projectId, labelIdsなど）
 */
export function showTaskModal(task = null, options = {}) {
    // 新規作成の場合、optionsからタスクオブジェクトを構築
    const taskData = task || {
        title: '',
        description: '',
        projectId: options.projectId || null,
        labelIds: options.labelIds || [],
        dueDate: options.dueDate || null,
        timeBlockId: options.timeBlockId || null,
        status: 'active'
    };

    openTaskEditModal(taskData);
}