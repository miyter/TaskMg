// @ts-nocheck

/**
 * Dateオブジェクトを指定のフォーマット（YYYY-MM-DD）に変換し、input[type="date"]のvalueとして利用可能にする。
 * @param {Date} date - 変換する日付オブジェクト
 * @returns {string} "YYYY-MM-DD"形式の文字列
 */
export function formatDateForInput(date) {
    if (!date) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}