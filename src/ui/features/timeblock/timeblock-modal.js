/**
 * 時間帯設定モーダルのコントローラー（エントリーポイント）
 * モジュール分割:
 * - timeblock-modal-dom.js: HTML構造
 * - timeblock-modal-view.js: UIレンダリング
 * - timeblock-modal-events.js: イベントハンドリング
 * - timeblock-modal-logic.js: 保存・削除ロジック
 */
import { buildModalSkeletonHTML } from './timeblock-modal-dom.js';
import { renderList } from './timeblock-modal-view.js';
import { setupEvents } from './timeblock-modal-events.js';
import { initColorPicker } from './timeblock-modal-color-picker.js';

export function showTimeBlockModal(targetBlock = null) {
    const modalId = 'timeblock-modal';
    document.getElementById(modalId)?.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fade-in';
    modal.innerHTML = buildModalSkeletonHTML();

    document.body.appendChild(modal);
    renderList(targetBlock);

    // Feature initialization
    initColorPicker(modal);
    setupEvents(modal);
}