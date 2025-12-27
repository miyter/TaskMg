/**
 * 更新日: 2025-12-27
 * 内容: サイドバー密度設定のキーを SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT に統一
 * これによりリロード後もコンパクト表示の設定が維持されるよう修正
 */
import { auth } from '../../core/firebase.js';
import { updateUserPassword } from '../auth.js';
import { signOut } from 'firebase/auth';
import { createBackupData } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { applyBackground } from '../theme.js';
import { SIDEBAR_CONFIG } from '../sidebar-constants.js';

export function setupSettingsEvents(modalOverlay, closeModal) {
    // 閉じる処理の統合
    const closers = ['close-settings-modal', 'close-settings-footer'];
    closers.forEach(id => document.getElementById(id)?.addEventListener('click', closeModal));
    
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // テーマ設定
    setupRadioGroupHandler('app-theme', 'theme', (val) => {
        document.documentElement.classList.toggle('dark', val === 'dark');
        applyBackground();
    });

    // 文字サイズ設定 (Tailwind configの app-sm/md/lg に対応)
    setupRadioGroupHandler('font-size', 'fontSize', (val) => {
        const sizeClasses = ['font-app-sm', 'font-app-md', 'font-app-lg'];
        document.body.classList.remove(...sizeClasses);
        document.body.classList.add(`font-app-${val}`);
    });

    // 背景パターン
    setupRadioGroupHandler('bg-pattern', 'background', () => applyBackground());

    // サイドバー密度 - SIDEBAR_CONFIG の定数を使用するように修正
    setupRadioGroupHandler('sidebar-density', SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, (val) => {
        const isCompact = val === 'compact';
        window.dispatchEvent(new CustomEvent('sidebar-settings-updated', { detail: { compact: isCompact } }));
    });

    setupExportHandler();
    setupPasswordHandler();
    setupLogoutHandler(closeModal);
}

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

    // モーダル表示時に保存値を強制適用
    if (savedValue) {
        // ラジオボタンのチェック状態も復元
        radios.forEach(radio => {
            radio.checked = (radio.value === savedValue);
        });
        onUpdate(savedValue);
    } else {
        const checked = Array.from(radios).find(r => r.checked);
        if (checked) onUpdate(checked.value);
    }
}

function setupExportHandler() {
    const btn = document.getElementById('export-data-btn-new');
    if (!btn) return;

    btn.onclick = async () => {
        const label = btn.querySelector('div.font-medium');
        const originalText = label.textContent;
        
        btn.disabled = true;
        btn.classList.add('opacity-70', 'cursor-wait');
        label.textContent = "バックアップ作成中...";
        
        try {
            const data = await createBackupData();
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${timestamp}.json`;
            a.click();
            URL.revokeObjectURL(url);

            showMessageModal({ message: "バックアップをダウンロードしたぞ", type: 'success' });
        } catch (e) {
            console.error(e);
            showMessageModal({ message: "エクスポートに失敗した", type: 'error' });
        } finally {
            btn.disabled = false;
            btn.classList.remove('opacity-70', 'cursor-wait');
            label.textContent = originalText;
        }
    };
}

function setupPasswordHandler() {
    const btn = document.getElementById('update-password-btn-new');
    const input = document.getElementById('new-password-input-new');
    if (!btn || !input) return;

    btn.onclick = async () => {
        const pass = input.value.trim();
        if (pass.length < 6) return showMessageModal({ message: "6文字以上入力してくれ", type: 'error' });
        
        try {
            await updateUserPassword(pass);
            input.value = '';
        } catch (err) {
            // エラー表示は auth.js 側で行われる
        }
    };
}

function setupLogoutHandler(closeModal) {
    document.getElementById('logout-btn-settings')?.addEventListener('click', async () => {
        try {
            await signOut(auth);
            closeModal();
        } catch (err) {
            showMessageModal({ message: "エラーが発生した", type: 'error' });
        }
    });
}