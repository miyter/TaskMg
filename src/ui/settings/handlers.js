// @ts-nocheck
// @miyter:20251221
// 設定モーダルのイベントハンドラー

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
 */
function setupRadioGroupHandler(name, storageKey, onUpdate) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            // 数値や真偽値の保存が必要な場合はここで変換
            localStorage.setItem(storageKey, val);
            onUpdate(val);
        });
    });
}

/**
 * データエクスポート
 */
function setupExportHandler() {
    const btn = document.getElementById('export-data-btn-new');
    if (!btn) return;

    btn.onclick = async () => {
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<span class="flex items-center gap-2">作成中...</span>`;
        
        try {
            const data = await createBackupData();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            downloadJSON(data, `backup_${timestamp}.json`);
            showMessageModal("バックアップをダウンロードしました");
        } catch (e) {
            showMessageModal("エクスポートに失敗しました", 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = original;
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
            const msg = err.code === 'auth/requires-recent-login' 
                ? "再ログインが必要です" 
                : "失敗しました: " + err.message;
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

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}