// @ts-nocheck
// @miyter:20251221
// 軽量Markdownパーサー

/**
 * HTMLエスケープ（簡易版）
 */
function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[m]);
}

/**
 * MarkdownをHTMLに変換 (箇条書き・リンク・改行に対応)
 */
export function simpleMarkdownToHtml(markdownText) {
    if (!markdownText) return '';

    const lines = markdownText.split('\n');
    let htmlResult = [];
    let inList = false;

    lines.forEach(line => {
        const trimmed = line.trimStart();
        const isListItem = trimmed.startsWith('* ') || trimmed.startsWith('- ');

        // リストの開始・終了処理
        if (isListItem && !inList) {
            htmlResult.push('<ul class="list-disc ml-5 space-y-1">');
            inList = true;
        } else if (!isListItem && inList) {
            htmlResult.push('</ul>');
            inList = false;
        }

        if (isListItem) {
            const content = processInline(trimmed.substring(2));
            htmlResult.push(`<li>${content}</li>`);
        } else if (line.trim()) {
            htmlResult.push(`<p class="mb-2">${processInline(line)}</p>`);
        } else {
            // 空行は無視またはスペーサーに
            if (inList) {
                htmlResult.push('</ul>');
                inList = false;
            }
        }
    });

    if (inList) htmlResult.push('</ul>');

    return htmlResult.join('\n');
}

/**
 * インライン要素（リンク）の処理
 */
function processInline(text) {
    // まずリンク以外のHTMLタグを無効化
    let safeText = escapeHtml(text);

    // リンク変換: [text](url)
    return safeText.replace(/\[(.*?)\]\((.*?)\)/g, (_, label, url) => {
        const safeUrl = url.replace(/"/g, '&quot;');
        return `<a href="${safeUrl}" target="_blank" rel="noopener" class="text-blue-400 hover:text-blue-300 underline font-medium">${label}</a>`;
    });
}