// @ts-nocheck
// 設定モーダル (表示設定、データ管理、アカウント) - エントリーポイント

import { auth } from '../core/firebase.js';
import { getSettingsModalHTML } from './settings/view.js';
import { setupSettingsEvents } from './settings/handlers.js';

// エントリーポイント
export function initSettings() {
    // 修正: サイドバー再描画等でボタンが動的に生成されても反応するように、
    // documentレベルでイベントを監視する (イベント委譲)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#settings-btn');
        if (btn) {
            e.preventDefault();
            showSettingsModal();
        }
    });
}

/**
 * 設定モーダルを表示する
 */
export function showSettingsModal() {
    const modalId = 'settings-modal-dynamic';
    document.getElementById(modalId)?.remove();

    // 現在の設定を取得
    const isCompact = localStorage.getItem('sidebar_compact') === 'true';
    const userEmail = auth.currentUser?.email || '匿名ユーザー';
    const userInitial = userEmail[0].toUpperCase();

    // モーダル要素作成
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';
    
    // HTML生成 (Viewへ委譲)
    modalOverlay.innerHTML = getSettingsModalHTML(userInitial, userEmail, isCompact);
    
    document.body.appendChild(modalOverlay);

    // イベント設定 (Handlerへ委譲)
    setupSettingsEvents(modalOverlay, () => modalOverlay.remove());
}