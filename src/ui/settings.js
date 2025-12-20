// @ts-nocheck
// @miyter:20251221
// 設定モーダルの表示制御

import { auth } from '../core/firebase.js';
import { getSettingsModalHTML } from './settings/view.js';
import { setupSettingsEvents } from './settings/handlers.js';

/**
 * 設定画面の初期化（サイドバーのボタン監視等）
 */
export function initSettings() {
    // nav-settings へのクリックイベントを一元管理（重複防止のため document 委譲）
    document.addEventListener('click', (e) => {
        if (e.target.closest('#nav-settings')) {
            e.preventDefault();
            showSettingsModal();
        }
    });
}

/**
 * 設定モーダルの表示実行
 */
export function showSettingsModal() {
    const modalId = 'settings-modal-dynamic';
    document.getElementById(modalId)?.remove();

    const isCompact = localStorage.getItem('sidebar_compact') === 'true';
    const user = auth.currentUser;
    const email = user?.email || '匿名ユーザー';
    const initial = email[0].toUpperCase();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in';
    
    // HTML構造の生成（view.js へ委譲）
    overlay.innerHTML = getSettingsModalHTML(initial, email, isCompact);
    document.body.appendChild(overlay);

    // イベントの紐付け（handlers.js へ委譲）
    setupSettingsEvents(overlay, () => overlay.remove());
}