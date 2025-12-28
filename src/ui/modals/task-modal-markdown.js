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
 * リストの状態を切り替える（マークダウン）
 * 既存のリストマーカーがあれば置換/削除し、なければ追加する
 */
function toggleList(textarea, marker) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // 選択範囲が含まれる行の開始と終了を取得
    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = text.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = text.length;

    const selectionContent = text.substring(lineStart, lineEnd);
    const lines = selectionContent.split('\n');

    // リストマーカー検出用正規表現
    // 行頭の空白($1) + マーカー($2) + 空白($3)
    const listRegex = /^(\s*)([-*]|\d+\.)(\s+)/;

    const newLines = lines.map(line => {
        const match = line.match(listRegex);
        if (match) {
            const currentMarker = match[2];

            // ターゲットが順序付きか判定
            const isTargetOrdered = /^\d+\.\s*$/.test(marker);
            // 現在が順序付きか判定
            const isCurrentOrdered = /^\d+\.$/.test(currentMarker);
            const isCurrentUnordered = /^[-*]$/.test(currentMarker);

            // 同じ種類のマーカーなら削除（トグルオフ）
            if ((isTargetOrdered && isCurrentOrdered) || (!isTargetOrdered && isCurrentUnordered)) {
                return line.replace(listRegex, '$1'); // マーカーと直後のスペースを削除
            } else {
                // 違う種類なら置換
                // $1(インデント) + 新マーカー + 残りのテキスト
                // マーカーには既にスペースが含まれていると仮定するか、ここで調整するか
                // replaceのロジック: 元のマーカー+スペース を 新マーカー に置き換える
                return line.replace(listRegex, `$1${marker}`);
            }
        } else {
            // マーカーがない場合は追加
            return marker + line;
        }
    });

    const newContent = newLines.join('\n');

    // テキスト更新
    // setRangeTextはUndoスタックに有利な場合があるが、ここではシンプルに実装
    textarea.setRangeText(newContent, lineStart, lineEnd, 'select');

    // イベント発火
    textarea.dispatchEvent(new Event('input'));
    textarea.focus();
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
        listBtn.addEventListener('click', () => toggleList(textarea, '- ')); // 切り替えロジックを使用
    }
    if (orderedBtn) {
        orderedBtn.addEventListener('click', () => toggleList(textarea, '1. ')); // 切り替えロジックを使用
    }

    // 初期状態（編集モード）に合わせてUIを強制
    textarea.classList.remove('hidden');
    previewDiv.classList.add('hidden');
    toggleButton.textContent = UI_TEXT.PREVIEW;
}