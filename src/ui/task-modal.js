/**
 * タスクモーダル統合管理
 */
import { buildModalHTML } from './modal/modal-dom-generator.js';
import { setupTaskModalEvents } from './modal/task-modal-ctrl.js';

export { showLabelModal } from './modal/label-modal.js';
export { showProjectModal } from './modal/project-modal.js';
export { showWorkspaceModal } from './modal/workspace-modal.js';

const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
        closeTaskModal();
    }
};

/**
 * 初期化（現在は動的登録のため空）
 */
export function initTaskModal() {}

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