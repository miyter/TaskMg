/**
 * メモ欄のMarkdownプレビュー制御
 */
import { simpleMarkdownToHtml } from '../../utils/markdown.js';

const UI_TEXT = {
    EDIT: '編集',
    PREVIEW: 'プレビュー'
};

/**
 * デバウンス関数
 */
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Markdown入力とプレビューの切り替えをセットアップ
 */
export function setupMarkdownControls() {
    const textarea = document.getElementById('modal-task-desc');
    const previewDiv = document.getElementById('modal-task-desc-preview');
    const toggleButton = document.getElementById('toggle-memo-view');

    if (!textarea || !previewDiv || !toggleButton) return;

    let isEditing = true;

    // プレビューレンダリング（デバウンス適用）
    const renderPreview = debounce(() => {
        previewDiv.innerHTML = simpleMarkdownToHtml(textarea.value);
    }, 300);

    toggleButton.addEventListener('click', () => {
        isEditing = !isEditing;
        
        if (isEditing) {
            textarea.classList.remove('hidden');
            previewDiv.classList.add('hidden');
            toggleButton.textContent = UI_TEXT.PREVIEW;
        } else {
            // プレビューに切り替える時だけ即時実行
            previewDiv.innerHTML = simpleMarkdownToHtml(textarea.value);
            textarea.classList.add('hidden');
            previewDiv.classList.remove('hidden');
            toggleButton.textContent = UI_TEXT.EDIT;
        }
    });

    textarea.addEventListener('input', () => {
        if (!isEditing) renderPreview();
    });

    // 初期状態（編集モード）に合わせてUIを強制
    textarea.classList.remove('hidden');
    previewDiv.classList.add('hidden');
    toggleButton.textContent = UI_TEXT.PREVIEW;
}