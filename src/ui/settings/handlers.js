/**
 * 更新日: 2025-12-27
 * 内容: サイドバー密度設定のキーを SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT に統一
 * これによりリロード後もコンパクト表示の設定が維持されるよう修正
 */
import { auth } from '../../core/firebase.js';
import { updateUserPassword } from '../auth.js';
import { signOut } from 'firebase/auth';
import { createBackupData, importBackupData } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { applyBackground } from '../layout/theme.js';
import { SIDEBAR_CONFIG } from '../features/sidebar/sidebar-constants.js';
import { setFont } from '../layout/fonts.js';

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

    // 文字サイズ設定 (Tailwind configの app-sm/md/lg/xl... に対応)
    setupRadioGroupHandler('font-size', 'fontSize', (val) => {
        const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];
        document.body.classList.remove(...sizeClasses);
        document.body.classList.add(`font-app-${val}`);
    });

    // 背景パターン
    setupRadioGroupHandler('bg-pattern', 'background', () => applyBackground());

    // サイドバー密度 (4 levels)
    setupRadioGroupHandler('sidebar-density', SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY, (val) => {
        // Legacy support: also update compact key for fallback
        if (val === 'compact') localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'true');
        else localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'false');

        window.dispatchEvent(new CustomEvent('sidebar-settings-updated', { detail: { density: val } }));
    });

    setupFontHandlers();
    setupExportHandler();
    setupImportHandler();
    setupPasswordHandler();
    setupLogoutHandler(closeModal);
}

// ... helper functions ...

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
        // 既存のクラス削除のため一度実行しても良いが、ちらつき防止のためここではUI反映のみ
    } else {
        const checked = Array.from(radios).find(r => r.checked);
        if (checked) localStorage.setItem(storageKey, checked.value); // 初期値を保存
    }
}

function setupFontHandlers() {
    const enSelect = document.querySelector('select[name="font-en-select"]');
    const jpSelect = document.querySelector('select[name="font-jp-select"]');

    if (enSelect) {
        enSelect.addEventListener('change', (e) => {
            setFont('EN', e.target.value);
        });
    }

    if (jpSelect) {
        jpSelect.addEventListener('change', (e) => {
            setFont('JP', e.target.value);
        });
    }
}

function setupExportHandler() {
    const btn = document.getElementById('export-data-btn-new');
    if (!btn) return;

    btn.onclick = async () => {
        const label = btn.querySelector('span.font-bold'); // Updated selector
        const originalText = label ? label.textContent : 'バックアップを作成';

        btn.disabled = true;
        btn.classList.add('opacity-70', 'cursor-wait');
        if (label) label.textContent = "バックアップ作成中...";

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
            if (label) label.textContent = originalText;
        }
    };
}

function setupImportHandler() {
    const btn = document.getElementById('import-data-btn-new');
    const input = document.getElementById('import-file-input');
    if (!btn || !input) return;

    btn.onclick = () => {
        input.value = ''; // Reset
        input.click();
    };

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const json = JSON.parse(evt.target.result);

                // バージョンチェック等は必要に応じて
                if (!json.tasks || !json.projects) {
                    throw new Error("Invalid backup format");
                }

                btn.disabled = true;
                btn.classList.add('opacity-70', 'cursor-wait');

                const result = await importBackupData(json);

                showMessageModal({
                    message: `インポート完了！\nタスク: ${result.tasksCount}件\nプロジェクト: ${result.projectsCount}件\nラベル: ${result.labelsCount}件`,
                    type: 'success'
                });

                // リロードして反映
                setTimeout(() => window.location.reload(), 1500);

            } catch (err) {
                console.error(err);
                showMessageModal({ message: "インポートに失敗しました。\nファイルが破損している可能性があります。", type: 'error' });
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-70', 'cursor-wait');
            }
        };
        reader.readAsText(file);
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
            showMessageModal({ message: "パスワードを変更しました", type: 'success' });
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