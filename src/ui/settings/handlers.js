// @ts-nocheck
// 設定モーダルのイベントハンドラー

import { auth } from '../../core/firebase.js';
import { updateUserPassword } from '../auth.js';
import { signOut } from 'firebase/auth';
import { createBackupData } from '../../store/store.js';
import { showMessageModal } from '../components.js';

/**
 * モーダル内の各種イベントリスナーを設定する
 */
export function setupSettingsEvents(modalOverlay, closeModal) {
    // 閉じるボタン
    document.getElementById('close-settings-modal')?.addEventListener('click', closeModal);
    document.getElementById('close-settings-footer')?.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    setupThemeHandlers();
    setupDensityHandlers();
    setupExportHandler();
    setupPasswordHandler();
    setupLogoutHandler(closeModal);
}

// 0. テーマ切り替え
function setupThemeHandlers() {
    const currentTheme = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    const themeRadios = document.querySelectorAll('input[name="app-theme"]');
    themeRadios.forEach(radio => {
        if (radio.value === currentTheme) radio.checked = true;
        
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            if (val === 'dark') {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    });
}

// 1. サイドバー表示設定の変更
function setupDensityHandlers() {
    const densityRadios = document.querySelectorAll('input[name="sidebar-density"]');
    densityRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            const isCompact = val === 'compact';
            
            // 設定を保存
            localStorage.setItem('sidebar_compact', isCompact);
            
            // イベント発火して即座に反映
            window.dispatchEvent(new CustomEvent('sidebar-settings-updated', { 
                detail: { compact: isCompact } 
            }));
        });
    });
}

// 2. データエクスポート
function setupExportHandler() {
    const exportBtn = document.getElementById('export-data-btn-new');
    if (!exportBtn) return;

    exportBtn.addEventListener('click', async () => {
        const originalHtml = exportBtn.innerHTML;
        exportBtn.disabled = true;
        // ★修正: SVGパスのエラーを解消するため、安全なHTML構造に置換
        exportBtn.innerHTML = `
            <div class="flex items-center justify-center w-full gap-2">
                <svg class="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" class="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"/>
                </svg>
                作成中...
            </div>
        `;
        
        try {
            const data = await createBackupData();
            downloadJSON(data, `task_manager_backup_${getTimestamp()}.json`);
            showMessageModal("バックアップデータをダウンロードしました");
        } catch (e) {
            console.error("Export Error:", e);
            showMessageModal("データのエクスポートに失敗しました", 'error');
        } finally {
            exportBtn.disabled = false;
            exportBtn.innerHTML = originalHtml;
        }
    });
}

// 3. パスワード変更
function setupPasswordHandler() {
    const passBtn = document.getElementById('update-password-btn-new');
    const passInput = document.getElementById('new-password-input-new');
    if (!passBtn || !passInput) return;

    passBtn.addEventListener('click', async () => {
        const newPass = passInput.value;
        if (!newPass || newPass.length < 6) {
            showMessageModal("パスワードは6文字以上で入力してください", 'error');
            return;
        }
        try {
            await updateUserPassword(newPass);
            showMessageModal("パスワードを変更しました");
            passInput.value = '';
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                showMessageModal("セキュリティのため、再ログインが必要です。一度ログアウトしてから再度お試しください。", 'error');
            } else {
                showMessageModal("変更に失敗しました: " + error.message, 'error');
            }
        }
    });
}

// ログアウト処理
function setupLogoutHandler(closeModal) {
    const logoutBtn = document.getElementById('logout-btn-settings');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            closeModal();
        } catch (error) {
            console.error(error);
            showMessageModal("ログアウトに失敗しました", 'error');
        }
    });
}

// 内部ヘルパー
function downloadJSON(data, filename) {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}