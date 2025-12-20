// @ts-nocheck
// @miyter:20251221
// 日付操作・フォーマット・繰り返し計算の共通ユーティリティ

/**
 * 入力値をDateオブジェクトに安全に変換する (Firestore Timestamp対応)
 */
const toDate = (date) => {
    if (!date) return null;
    return date.toDate ? date.toDate() : new Date(date);
};

/**
 * 2つの日付が同じ日かどうかを判定する
 */
const isSameDay = (d1, d2) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

/**
 * 日付をコンパクトにフォーマット (今日/明日/昨日 または mm/dd)
 */
export function formatDateCompact(date) {
    const target = toDate(date);
    if (!target || isNaN(target.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // 相対表記の判定
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';

    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');

    return year !== now.getFullYear() ? `${year}/${month}/${day}` : `${month}/${day}`;
}

/**
 * 期限日に基づくTailwindカラークラスを取得
 */
export function getTaskDateColor(date) {
    const target = toDate(date);
    if (!target) return 'text-gray-500';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-500 font-bold';
    if (diffDays === 0) return 'text-green-600 dark:text-green-400 font-medium';
    if (diffDays === 1) return 'text-orange-500 dark:text-orange-400 font-medium';
    return 'text-gray-500 dark:text-gray-400';
}

/**
 * 次回の繰り返し期限日を計算
 */
export function getNextRecurrenceDate(currentDueDate, recurrence) {
    if (!currentDueDate || !recurrence?.type) return null;
    const nextDate = new Date(toDate(currentDueDate));

    switch (recurrence.type) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate;
        case 'weekly':
            if (!recurrence.days?.length) return null;
            const currentDay = nextDate.getDay();
            for (let i = 1; i <= 7; i++) {
                if (recurrence.days.includes((currentDay + i) % 7)) {
                    nextDate.setDate(nextDate.getDate() + i);
                    return nextDate;
                }
            }
            return null;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            return nextDate;
        default:
            return null;
    }
}

/**
 * 繰り返し設定から初期の期限日を決定
 */
export function getInitialDueDateFromRecurrence(recurrence) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (!recurrence?.type || recurrence.type === 'daily' || recurrence.type === 'monthly') {
        return today;
    }

    if (recurrence.type === 'weekly' && recurrence.days?.length > 0) {
        const currentDay = today.getDay();
        for (let i = 0; i <= 6; i++) {
            if (recurrence.days.includes((currentDay + i) % 7)) {
                today.setDate(today.getDate() + i);
                return today;
            }
        }
    }
    return today;
}