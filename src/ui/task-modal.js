// @ts-nocheck
// @miyter:20251129
// タスク編集モーダルのメイン管理ファイル

import { buildModalHTML } from './modal/modal-dom-generator.js';
import { setupTaskModalEvents } from './modal/task-modal-ctrl.js';

// 他のモジュールから利用されているモーダル関数を再エクスポート
// ★修正: showProjectModalは削除し、showLabelModalのみエクスポート
export { showLabelModal } from './modal/simple-modals.js';

/**
 * モーダル機能の初期化
 */
export function initTaskModal() {
    document.addEventListener('keydown', (e) => {
        const modalContainer = document.getElementById('modal-container');
        if (e.key === 'Escape' && modalContainer && modalContainer.children.length > 0) {
            closeTaskModal();
        }
    });
}

/**
 * タスク編集モーダルを開く
 * @param {Object} task - 編集対象のタスクオブジェクト
 */
export function openTaskEditModal(task) {
    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'modal-container';
        document.body.appendChild(modalContainer);
    }
    
    // HTML生成
    modalContainer.innerHTML = buildModalHTML(task);

    // イベント設定 (ロジックは task-modal-ctrl.js に委譲)
    // 閉じる際のコールバックとして closeTaskModal を渡す
    setupTaskModalEvents(modalContainer, task, closeTaskModal);
}

/**
 * モーダルを閉じる
 */
export function closeTaskModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.innerHTML = '';
    }
}