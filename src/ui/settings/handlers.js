// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 設定反映の確実性向上、UX改善、保守性対応（Grok指摘対応）
 */

import { auth } from '../../core/firebase.js';
import { updateUserPassword } from '../auth.js';
import { signOut } from 'firebase/auth';
import { createBackupData } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { applyBackground } from '../theme.js';

/**
 * モーダル内のイベントリスナーを一括設定
 */
export function setupSettingsEvents(modalOverlay, closeModal) {
    // 閉じるボタン系
    const closers = ['close-settings-modal', 'close-settings-footer'];
    closers.forEach(id => document.getElementById(id)?.addEventListener('click', closeModal));
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // 表示設定（ラジオボタングループ）
    // 初期化時に現在の値を適用することで、localStorageとUIの同期を保証する
    setupRadioGroupHandler('app-theme', 'theme', (val) => {
        document.documentElement.classList.toggle('dark', val === 'dark');
        applyBackground();
    });

    setupRadioGroupHandler('font-size', 'fontSize', (val) => {
        document.body.classList.remove('font-large', 'font-medium', 'font-small');
        document.body.classList.add(`font-${val}`);
    });

    setupRadioGroupHandler('bg-pattern', 'background', () => applyBackground());

    setupRadioGroupHandler('sidebar-density', 'sidebar_compact', (val) => {
        const isCompact = val === 'compact';
        window.dispatchEvent(new CustomEvent('sidebar-settings-updated', { detail: { compact: isCompact } }));
    });

    // 機能系
    setupExportHandler();
    setupPasswordHandler();
    setupLogoutHandler(closeModal);
}

/**
 * ラジオボタン・グループの共通ハンドラー生成
 * 初期化時に現在の値でonUpdateを実行する
 */
function setupRadioGroupHandler(name, storageKey, onUpdate) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const savedValue = localStorage.getItem(storageKey);

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            localStorage.setItem(storageKey, val);
            onUpdate(val);
        });
    });

    // モーダルが開かれた時点で、保存されている設定（またはデフォルト）を確実に適用する
    if (savedValue) {
        onUpdate(savedValue);
    } else {
        const defaultRadio = document.querySelector(`input[name="${name}"]:checked`);
        if (defaultRadio) {
            onUpdate(defaultRadio.value);
        }
    }
}

/**
 * データエクスポート
 */
function setupExportHandler() {
    const btn = document.getElementById('export-data-btn-new');
    if (!btn) return;

    btn.onclick = async () => {
        const originalText = btn.querySelector('div.font-medium').textContent;
        const subText = btn.querySelector('div.text-xs');
        
        // UI更新: ローディング状態
        btn.disabled = true;
        btn.classList.add('opacity-70', 'cursor-wait');
        btn.querySelector('div.font-medium').textContent = "バックアップ作成中...";
        
        try {
            const data = await createBackupData();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            downloadJSON(data, `backup_${timestamp}.json`);
            showMessageModal("バックアップをダウンロードしました");
        } catch (e) {
            console.error(e);
            showMessageModal("エクスポートに失敗しました", 'error');
        } finally {
            // UI復元
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-wait');
            btn.querySelector('div.font-medium').textContent = originalText;
        }
    };
}

/**
 * パスワード変更
 */
function setupPasswordHandler() {
    const btn = document.getElementById('update-password-btn-new');
    const input = document.getElementById('new-password-input-new');
    if (!btn || !input) return;

    btn.onclick = async () => {
        const pass = input.value.trim();
        if (pass.length < 6) return showMessageModal("6文字以上必要です", 'error');
        
        try {
            await updateUserPassword(pass);
            showMessageModal("パスワードを変更しました");
            input.value = '';
        } catch (err) {
            let msg = "失敗しました: " + err.message;
            if (err.code === 'auth/requires-recent-login') {
                msg = "セキュリティのため、再ログインが必要です。ログアウトして再度お試しください。";
            }
            showMessageModal(msg, 'error');
        }
    };
}

/**
 * ログアウト
 */
function setupLogoutHandler(closeModal) {
    document.getElementById('logout-btn-settings')?.addEventListener('click', async () => {
        try {
            await signOut(auth);
            closeModal();
        } catch (err) {
            showMessageModal("エラーが発生しました", 'error');
        }
    });
}

/**
 * JSONファイルダウンロード（モジュールローカル関数）
 */
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}