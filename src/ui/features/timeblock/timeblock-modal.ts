/**
 * 時間帯設定モーダルのコントローラー（エントリーポイント）
 * モジュール分割:
 * - timeblock-modal-dom.ts: HTML構造
 * - timeblock-modal-view.ts: UIレンダリング
 * - timeblock-modal-events.ts: イベントハンドリング
 * - timeblock-modal-logic.ts: 保存・削除ロジック
 */
import { TimeBlock } from '../../../store/schema';
import { initColorPicker } from './timeblock-modal-color-picker';
import { buildModalSkeletonHTML } from './timeblock-modal-dom';
import { setupEvents } from './timeblock-modal-events';
import { renderList } from './timeblock-modal-view';

export function showTimeBlockModal(targetBlock: TimeBlock | null = null) {
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
