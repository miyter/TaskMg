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

    // サイドバー密度 (Global UI Density)
    setupRadioGroupHandler('sidebar-density', SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY, (val) => {
        // Legacy support
        if (val === 'compact') localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'true');
        else localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'false');

        // Apply global density class to body
        const densities = ['compact', 'normal', 'comfortable', 'spacious'];
        const classes = densities.map(d => `app-density-${d}`);
        document.body.classList.remove(...classes);
        document.body.classList.add(`app-density-${val}`);

        window.dispatchEvent(new CustomEvent('sidebar-settings-updated', { detail: { density: val } }));
    });

    setupFontHandlers();
    setupTimezoneHandler();
    setupExportHandler();
    setupImportHandler();
    setupPasswordHandler();
    setupLogoutHandler(closeModal);
    setupAccordionHandlers();
}

function setupAccordionHandlers() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const currentContent = currentItem.querySelector('.accordion-content');
            const currentIcon = header.querySelector('.accordion-icon');
            const isClosing = currentContent.style.maxHeight !== '0px' && currentContent.style.maxHeight !== '';

            // Close all others
            document.querySelectorAll('.settings-accordion').forEach(item => {
                if (item !== currentItem) {
                    const content = item.querySelector('.accordion-content');
                    const icon = item.querySelector('.accordion-icon');
                    content.style.maxHeight = '0px';
                    content.classList.remove('opacity-100');
                    content.classList.add('opacity-0');
                    icon.classList.remove('rotate-180');
                }
            });

            // Toggle current
            if (isClosing) {
                currentContent.style.maxHeight = '0px';
                currentContent.classList.remove('opacity-100');
                currentContent.classList.add('opacity-0');
                currentIcon.classList.remove('rotate-180');
            } else {
                currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
                currentContent.classList.remove('opacity-0');
                currentContent.classList.add('opacity-100');
                currentIcon.classList.add('rotate-180');
            }
        });
    });

    // Initialize height for any pre-opened items (like Appearance)
    // This ensures the animation works correctly from the start
    document.querySelectorAll('.settings-accordion').forEach(item => {
        const content = item.querySelector('.accordion-content');
        if (!content.style.maxHeight) { // If it doesn't have inline style (meaning it's open via class logic in view.js)
            // view.js sets no inline style for open implementation? 
            // Wait, view.js logic was: style="${isOpen ? '' : 'max-height: 0px;'}"
            // So if open, style is empty.
            // We need to set exact pixel height for transition to work if we want to close it later smoothly?
            // Actually, from 'auto' to '0' transition doesn't work well in CSS.
            // So we should set it to scrollHeight initially if it's open.
            if (content.classList.contains('opacity-100')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    });
}


// ... helper functions ...

function setupRadioGroupHandler(name, storageKey, onUpdate) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const savedValue = localStorage.getItem(storageKey);

    const activeClasses = ['border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300'];
    const inactiveClasses = ['border-gray-200', 'dark:border-gray-700', 'hover:bg-gray-50', 'dark:hover:bg-gray-700/50', 'text-gray-600', 'dark:text-gray-300'];

    const updateVisuals = (selectedRadio) => {
        radios.forEach(r => {
            const label = r.parentElement;
            // ラベル自体にクラスがついていると仮定
            if (r === selectedRadio) {
                label.classList.remove(...inactiveClasses);
                label.classList.add(...activeClasses);
            } else {
                label.classList.remove(...activeClasses);
                label.classList.add(...inactiveClasses);
            }
        });
    };

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value;
            localStorage.setItem(storageKey, val);
            updateVisuals(e.target);
            onUpdate(val);
        });
    });

    // モーダル表示時に保存値を強制適用
    if (savedValue) {
        radios.forEach(radio => {
            if (radio.value === savedValue) {
                radio.checked = true;
                // 初期表示は view.js でクラス設定されているはずだが、念のため同期
                // ただし view.js とロジックが重複するため、ここではcheckedのみにするのが無難だが、
                // 動的な不整合を防ぐならここでも updateVisuals を呼ぶのが確実
                // updateVisuals(radio); 
            }
        });
    } else {
        const checked = Array.from(radios).find(r => r.checked);
        if (checked) localStorage.setItem(storageKey, checked.value);
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

function setupTimezoneHandler() {
    const tzSelect = document.querySelector('select[name="timezone-select"]');
    if (tzSelect) {
        tzSelect.addEventListener('change', (e) => {
            localStorage.setItem('timezone', e.target.value);
            // 必要に応じてグローバルイベントを発火
            window.dispatchEvent(new CustomEvent('timezone-changed', { detail: { timezone: e.target.value } }));
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