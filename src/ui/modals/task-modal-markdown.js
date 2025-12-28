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
 * テキストエリアのカーソル位置にテキストを挿入・ラップする
 */
function insertText(textarea, prefix, suffix = '') {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

    // 行頭挿入の挙動（プレフィックスが行頭用の場合）
    // リストなどは選択範囲の各行頭に入れるか、単に行頭に入れるか判断が必要だが
    // 簡易的に選択範囲の前に入れる、あるいは空行ならその行に入れる

    let before = text.substring(0, start);
    let after = text.substring(end);
    let newText = '';
    let newCursorPos = 0;

    if (suffix) {
        // ラップする場合（太字など）
        newText = before + prefix + selection + suffix + after;
        newCursorPos = end + prefix.length + suffix.length;
        if (start === end) newCursorPos -= suffix.length; // 選択なしなら間にカーソル
    } else {
        // 行頭挿入（リストなど）
        // 選択範囲がある場合、各行の先頭にプレフィックスを追加する簡易実装
        if (start !== end) {
            const lines = selection.split('\n');
            const processedSelection = lines.map(line => prefix + line).join('\n');
            newText = before + processedSelection + after;
            newCursorPos = start + processedSelection.length;
        } else {
            // 現在の行の行頭を見る必要があるが、簡易的に現在位置に挿入
            // よりリッチにするなら行頭検知が必要
            newText = before + prefix + after;
            newCursorPos = start + prefix.length;
        }
    }

    textarea.value = newText;
    textarea.focus();
    textarea.selectionEnd = newCursorPos;
    // 選択なしのラップならカーソルを中へ
    if (suffix && start === end) {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length;
    } else if (suffix) {
        // 選択ありラップならラップ後を選択状態に
        textarea.selectionStart = start;
        textarea.selectionEnd = end + prefix.length + suffix.length;
    }

    // inputイベント発火（プレビュー更新のため）
    textarea.dispatchEvent(new Event('input'));
}

/**
 * Markdown入力とプレビューの切り替えをセットアップ
 */
export function setupMarkdownControls() {
    const textarea = document.getElementById('modal-task-desc');
    const previewDiv = document.getElementById('modal-task-desc-preview');
    const toggleButton = document.getElementById('toggle-memo-view');

    // ツールバーボタン
    const boldBtn = document.getElementById('md-bold-btn');
    const listBtn = document.getElementById('md-list-btn');
    const orderedBtn = document.getElementById('md-ordered-btn');

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

    // キーボードショートカット (Ctrl+B)
    textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            insertText(textarea, '**', '**');
        }
    });

    // ツールバーのアクション
    if (boldBtn) {
        boldBtn.addEventListener('click', () => insertText(textarea, '**', '**'));
    }
    if (listBtn) {
        listBtn.addEventListener('click', () => insertText(textarea, '- ')); // 行頭挿入の簡易版
    }
    if (orderedBtn) {
        orderedBtn.addEventListener('click', () => insertText(textarea, '1. ')); // 行頭挿入の簡易版
    }

    // 初期状態（編集モード）に合わせてUIを強制
    textarea.classList.remove('hidden');
    previewDiv.classList.add('hidden');
    toggleButton.textContent = UI_TEXT.PREVIEW;
}