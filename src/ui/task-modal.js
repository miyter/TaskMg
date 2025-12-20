// @ts-nocheck
// @miyter:20251221
// タスク編集モーダルのエントリーポイント

import { buildModalHTML } from './modal/modal-dom-generator.js';
import { setupTaskModalEvents } from './modal/task-modal-ctrl.js';

export { showLabelModal } from './modal/simple-modals.js';

/**
 * モーダル機能の初期化（グローバルなショートカット等）
 */
export function initTaskModal() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeTaskModal();
        }
    });
}

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
    
    // DOM生成
    container.innerHTML = buildModalHTML(task);

    // イベント設定（コントローラーに委譲）
    setupTaskModalEvents(container, task, closeTaskModal);
}

/**
 * モーダルを閉じる
 */
export function closeTaskModal() {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
}