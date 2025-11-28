// --- 設定UI (パスワード変更、データエクスポート) ---
import { updateUserPassword } from '../core/auth.js';
import { createBackupData } from '../store/store.js';

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const newPasswordInput = document.getElementById('new-password-input');
const updatePasswordBtn = document.getElementById('update-password-btn');
const exportDataBtn = document.getElementById('export-data-btn');

let currentUserId = null;

export function initSettings(userId) { // 関数名を initSettings に修正
    currentUserId = userId;

    if (settingsBtn) {
        settingsBtn.onclick = () => {
            if (settingsModal) settingsModal.classList.remove('hidden');
        };
    }
    if (closeSettingsBtn) {
        closeSettingsBtn.onclick = () => {
            if (settingsModal) settingsModal.classList.add('hidden');
            if (newPasswordInput) newPasswordInput.value = ''; 
        };
    }
    
    // モーダル外クリックで閉じる機能
    if (settingsModal) {
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) closeSettingsBtn.onclick();
        };
    }

    if (updatePasswordBtn) {
        updatePasswordBtn.onclick = async () => {
            const newPass = newPasswordInput.value;
            if (!newPass || newPass.length < 6) {
                alert("パスワードは6文字以上で入力してください。"); // ★ alertはカスタムモーダルに置き換え推奨
                return;
            }
            try {
                await updateUserPassword(newPass);
                alert("パスワードを変更しました。");
                newPasswordInput.value = '';
            } catch (error) {
                console.error(error);
                if (error.code === 'auth/requires-recent-login') {
                    alert("セキュリティのため、再ログインが必要です。一度ログアウトしてから再度お試しください。");
                } else {
                    alert("変更に失敗しました: " + error.message);
                }
            }
        };
    }
    if (exportDataBtn) {
        exportDataBtn.onclick = async () => {
            if (!currentUserId) return;
            const originalText = exportDataBtn.innerHTML;
            exportDataBtn.disabled = true;
            exportDataBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 作成中...';
            try {
                const data = await createBackupData(currentUserId);
                downloadJSON(data, `task_manager_backup_${getTimestamp()}.json`);
                alert("バックアップデータをダウンロードしました！");
            } catch (e) {
                console.error("Export Error:", e);
                alert("データのエクスポートに失敗しました。");
            } finally {
                exportDataBtn.disabled = false;
                exportDataBtn.innerHTML = originalText;
            }
        };
    }
}

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