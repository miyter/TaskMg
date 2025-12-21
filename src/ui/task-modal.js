// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: Escapeキーイベントのライフサイクル管理を動的に変更（競合回避）
 */

import { buildModalHTML } from './modal/modal-dom-generator.js';
import { setupTaskModalEvents } from './modal/task-modal-ctrl.js';

// 各種モーダルのエントリーポイントを再エクスポート
export { showLabelModal } from './modal/label-modal.js';
export { showProjectModal } from './modal/project-modal.js';
export { showWorkspaceModal } from './modal/workspace-modal.js';

// Escapeキーハンドラーの参照を保持
const handleEscapeKey = (e) => {
    if (e.key === 'Escape') {
        closeTaskModal();
    }
};

/**
 * モーダル機能の初期化
 * 以前はここでグローバルイベントを登録していたが、動的登録に変更したため空処理
 */
export function initTaskModal() {
    // No-op
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

    // Escapeキーイベントを登録
    document.addEventListener('keydown', handleEscapeKey);
}

/**
 * モーダルを閉じる
 */
export function closeTaskModal() {
    const container = document.getElementById('modal-container');
    if (container) {
        container.innerHTML = '';
        // Escapeキーイベントを解除
        document.removeEventListener('keydown', handleEscapeKey);
    }
}