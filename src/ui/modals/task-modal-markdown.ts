/**
 * メモ欄のMarkdownプレビュー制御
 * TypeScript化: 2025-12-29
 */
import { simpleMarkdownToHtml } from '../../utils/markdown';

const UI_TEXT = {
    EDIT: '編集',
    PREVIEW: 'プレビュー'
};

/**
 * テキストエリアのカーソル位置にテキストを挿入・ラップする
 */
function insertText(textarea: HTMLTextAreaElement, prefix: string, suffix: string = '') {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selection = text.substring(start, end);

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
        if (start !== end) {
            const lines = selection.split('\n');
            const processedSelection = lines.map(line => prefix + line).join('\n');
            newText = before + processedSelection + after;
            newCursorPos = start + processedSelection.length;
        } else {
            newText = before + prefix + after;
            newCursorPos = start + prefix.length;
        }
    }

    textarea.value = newText;
    textarea.focus();
    textarea.selectionEnd = newCursorPos;

    // カーソル位置調整
    if (suffix && start === end) {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = start + prefix.length;
    } else if (suffix) {
        textarea.selectionStart = start;
        textarea.selectionEnd = end + prefix.length + suffix.length;
    }

    // inputイベント発火（プレビュー更新のため）
    textarea.dispatchEvent(new Event('input'));
}

/**
 * リストの状態を切り替える（マークダウン）
 */
function toggleList(textarea: HTMLTextAreaElement, marker: string) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = text.length;

    const selectionContent = text.substring(lineStart, lineEnd);
    const lines = selectionContent.split('\n');

    // リストマーカー検出用正規表現
    const listRegex = /^(\s*)([-*]|\d+\.)(\s+)/;

    const newLines = lines.map(line => {
        const match = line.match(listRegex);
        if (match) {
            const currentMarker = match[2];
            const isTargetOrdered = /^\d+\.\s*$/.test(marker);
            const isCurrentOrdered = /^\d+\.$/.test(currentMarker);
            const isCurrentUnordered = /^[-*]$/.test(currentMarker);

            if ((isTargetOrdered && isCurrentOrdered) || (!isTargetOrdered && isCurrentUnordered)) {
                return line.replace(listRegex, '$1'); // 解除
            } else {
                return line.replace(listRegex, `$1${marker}`); // 置換
            }
        } else {
            return marker + line; // 追加
        }
    });

    const newContent = newLines.join('\n');

    // setRangeText非対応環境考慮は今回は不要（モダンブラウザ前提）
    textarea.setRangeText(newContent, lineStart, lineEnd, 'select');

    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
}

/**
 * Markdown入力とプレビューの切り替えをセットアップ
 */
export function setupMarkdownControls() {
    const textarea = document.getElementById('modal-task-desc') as HTMLTextAreaElement;
    const previewDiv = document.getElementById('modal-task-desc-preview') as HTMLElement;
    const toggleButton = document.getElementById('toggle-memo-view') as HTMLElement;

    // ツールバーボタン
    const boldBtn = document.getElementById('md-bold-btn') as HTMLButtonElement;
    const listBtn = document.getElementById('md-list-btn') as HTMLButtonElement;
    const orderedBtn = document.getElementById('md-ordered-btn') as HTMLButtonElement;

    if (!textarea || !previewDiv) return;

    // トグルボタンは隠す（自動切り替えにするため）
    if (toggleButton) toggleButton.classList.add('hidden');

    const showEditor = () => {
        textarea.classList.remove('hidden');
        previewDiv.classList.add('hidden');
        textarea.focus();
    };

    const showPreview = () => {
        const html = simpleMarkdownToHtml(textarea.value);
        previewDiv.innerHTML = html || '<span class="text-gray-400 cursor-text">メモを入力...</span>';
        textarea.classList.add('hidden');
        previewDiv.classList.remove('hidden');
    };

    // 初期状態設定
    if (textarea.value.trim()) {
        showPreview();
    } else {
        showEditor();
    }

    // イベントリスナー
    previewDiv.addEventListener('click', showEditor);

    textarea.addEventListener('blur', () => {
        showPreview();
    });

    textarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            insertText(textarea, '**', '**');
        }
    });

    // ツールバーのアクション
    const setupToolbarBtn = (btn: HTMLButtonElement, action: () => void) => {
        if (!btn) return;
        btn.addEventListener('mousedown', (e) => e.preventDefault()); // フォーカス維持
        btn.addEventListener('click', action);
    };

    setupToolbarBtn(boldBtn, () => insertText(textarea, '**', '**'));
    setupToolbarBtn(listBtn, () => toggleList(textarea, '- '));
    setupToolbarBtn(orderedBtn, () => toggleList(textarea, '1. '));
}
