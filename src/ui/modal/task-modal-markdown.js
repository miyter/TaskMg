// @ts-nocheck
// @miyter:20251221
// メモ欄のMarkdownプレビュー制御

import { simpleMarkdownToHtml } from '../../utils/markdown.js';

/**
 * Markdown入力とプレビューの切り替えをセットアップ
 */
export function setupMarkdownControls() {
    const textarea = document.getElementById('modal-task-desc');
    const previewDiv = document.getElementById('modal-task-desc-preview');
    const toggleButton = document.getElementById('toggle-memo-view');

    if (!textarea || !previewDiv || !toggleButton) return;

    let isEditing = true;

    const renderPreview = () => {
        previewDiv.innerHTML = simpleMarkdownToHtml(textarea.value);
    };

    toggleButton.addEventListener('click', () => {
        isEditing = !isEditing;
        
        if (isEditing) {
            textarea.classList.remove('hidden');
            previewDiv.classList.add('hidden');
            toggleButton.textContent = 'プレビュー';
        } else {
            renderPreview();
            textarea.classList.add('hidden');
            previewDiv.classList.remove('hidden');
            toggleButton.textContent = '編集';
        }
    });

    // 入力中の同期（必要に応じて）
    textarea.addEventListener('input', () => {
        if (!isEditing) renderPreview();
    });

    // 初期状態を強制
    renderPreview();
}