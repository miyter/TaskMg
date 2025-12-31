/**
 * @miyter:20251221
 * 軽量Markdownパーサー
 * TypeScript化: 2025-12-29
 */

/** HTMLエスケープ用のマップ */
const HTML_ESCAPE_MAP: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
};

/**
 * HTMLエスケープ（簡易版）
 */
function escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (m) => HTML_ESCAPE_MAP[m] || m);
}

/**
 * MarkdownをHTMLに変換 (箇条書き・リンク・改行に対応)
 */
export function simpleMarkdownToHtml(markdownText: string | null | undefined): string {
    if (!markdownText) return '';

    const lines = markdownText.split('\n');
    let htmlResult: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    lines.forEach(line => {
        const trimmed = line.trimStart();
        // リスト検出
        const isUnordered = trimmed.startsWith('* ') || trimmed.startsWith('- ');
        const isOrdered = /^\d+\.\s/.test(trimmed);
        const isListItem = isUnordered || isOrdered;

        // リスト切り替え・終了処理
        if (isListItem) {
            const newListType = isOrdered ? 'ol' : 'ul';

            // 異なる種類のリストが始まった、あるいはリストが始まっていない場合
            if (listType !== newListType) {
                if (listType) htmlResult.push(`</${listType}>`); // 前のリストを閉じる
                // 新しいリストを開始
                const className = isOrdered ? 'list-decimal' : 'list-disc';
                htmlResult.push(`<${newListType} class="${className} ml-5 space-y-1">`);
                listType = newListType;
            }
        } else {
            // リストアイテムでない行
            if (listType) {
                htmlResult.push(`</${listType}>`);
                listType = null;
            }
        }

        if (isListItem) {
            // マーカー除去
            let contentText = '';
            if (isUnordered) {
                contentText = trimmed.substring(2);
            } else {
                // "1. " などを除去
                contentText = trimmed.replace(/^\d+\.\s/, '');
            }
            const content = processInline(contentText);
            htmlResult.push(`<li>${content}</li>`);
        } else if (line.trim()) {
            htmlResult.push(`<p class="mb-2">${processInline(line)}</p>`);
        } else {
            // 空行はリスト内でなければ無視、リスト内なら終了させるロジックは上記elseに入らないのでここで処理が必要か？
            // 上記 else に入るので listType があれば閉じられる。
            // 空行のみの処理
            if (listType) {
                htmlResult.push(`</${listType}>`);
                listType = null;
            }
        }
    });

    if (listType) htmlResult.push(`</${listType}>`);

    return htmlResult.join('\n');
}

/**
 * インライン要素（リンク）の処理
 */
function processInline(text: string): string {
    // まずリンク以外のHTMLタグを無効化
    let safeText = escapeHtml(text);

    // リンク変換: [text](url)
    return safeText.replace(/\[(.*?)\]\((.*?)\)/g, (_, label, url) => {
        const safeUrl = url.replace(/"/g, '&quot;');
        return `<a href="${safeUrl}" target="_blank" rel="noopener" class="text-blue-400 hover:text-blue-300 underline font-medium">${label}</a>`;
    });
}
