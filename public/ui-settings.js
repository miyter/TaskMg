// --- 設定UI制御モジュール (新規作成) ---
// 役割: 設定モーダルの開閉、パスワード変更、データエクスポート制御

import { updateUserPassword } from './auth.js';
import { createBackupData } from './store.js';

const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const newPasswordInput = document.getElementById('new-password-input');
const updatePasswordBtn = document.getElementById('update-password-btn');
const exportDataBtn = document.getElementById('export-data-btn');

let currentUserId = null;

export function initSettingsUI(userId) {
    currentUserId = userId;

    // モーダル開閉
    if (settingsBtn) {
        settingsBtn.onclick = () => {
            settingsModal.classList.remove('hidden');
        };
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.onclick = () => {
            settingsModal.classList.add('hidden');
            newPasswordInput.value = ''; // リセット
        };
    }

    // パスワード変更
    if (updatePasswordBtn) {
        updatePasswordBtn.onclick = async () => {
            const newPass = newPasswordInput.value;
            if (!newPass || newPass.length < 6) {
                alert("パスワードは6文字以上で入力してください。");
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

    // データエクスポート
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

// JSONファイルとしてダウンロードさせるヘルパー
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