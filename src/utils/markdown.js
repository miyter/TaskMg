// @ts-nocheck
// シンプルなMarkdownをHTMLに変換する共通ユーティリティ

/**
 * シンプルなMarkdownをHTMLに変換する
 * 現状は箇条書き（*または-）とハイパーリンク（[text](url)）のみ対応
 * @param {string} markdownText - Markdown形式のテキスト
 * @returns {string} HTML文字列
 */
export function simpleMarkdownToHtml(markdownText) {
    if (!markdownText) return '';

    let html = markdownText;

    // 1. ハイパーリンク変換: [テキスト](URL) -> <a href="URL" target="_blank">テキスト</a>
    // NOTE: 'g' フラグはすべてのマッチングに必要
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
        // 安全のためにURLをエスケープする
        const safeUrl = url.replace(/"/g, '&quot;');
        return `<a href="${safeUrl}" target="_blank" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`;
    });

    // 2. 箇条書き変換: 行頭の * または - を <li> に変換
    const lines = html.split('\n');
    let inList = false;
    let newLines = [];

    lines.forEach(line => {
        const trimmedLine = line.trimStart(); // 行頭のスペースは許容
        const isListItem = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');
        
        if (isListItem) {
            if (!inList) {
                // 箇条書き開始
                newLines.push('<ul class="list-disc ml-5 space-y-1">');
                inList = true;
            }
            // * または - の後のコンテンツを取得
            const content = trimmedLine.substring(2).trim();
            // リストアイテムとして追加
            newLines.push(`<li>${content}</li>`);
        } else {
            if (inList) {
                // 箇条書き終了
                newLines.push('</ul>');
                inList = false;
            }
            // 箇条書きでない行は <p> タグで囲み、改行を <br> に変換
            if (line.trim().length > 0) {
                 newLines.push(`<p class="mb-2">${line.replace(/\n/g, '<br>')}</p>`);
            } else {
                 newLines.push('');
            }
        }
    });

    if (inList) {
        // ファイルの末尾でリストが閉じられていない場合
        newLines.push('</ul>');
    }

    // 連続する空行を削除し、結果を結合
    html = newLines.filter(l => l.trim().length > 0 || l.startsWith('<')).join('\n');
    
    return html;
}