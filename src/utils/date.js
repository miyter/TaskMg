// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 集計ヘルパーの統合、toDateの堅牢化、繰り返し計算ロジック保持
 */

/**
 * 入力値をDateオブジェクトに安全に変換する (Firestore Timestamp対応)
 */
export function toDate(val) {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * 2つの日付が同じ日かどうかを判定する
 */
export const isSameDay = (d1, d2) => {
    const a = toDate(d1);
    const b = toDate(d2);
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
};

// --- 集計用ヘルパー ---

export function getStartOfDay(date = new Date()) {
    const d = toDate(date) || new Date();
    const res = new Date(d);
    res.setHours(0, 0, 0, 0);
    return res;
}

export function getEndOfDay(date = new Date()) {
    const d = toDate(date) || new Date();
    const res = new Date(d);
    res.setHours(23, 59, 59, 999);
    return res;
}

export function getStartOfWeek(date = new Date()) {
    const d = toDate(date) || new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜始まり
    const start = new Date(d.setDate(diff));
    return getStartOfDay(start);
}

export function getStartOfMonth(date = new Date()) {
    const d = toDate(date) || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

// --- UI・フォーマット関連 ---

/**
 * 日付をコンパクトにフォーマット (今日/明日/昨日 または mm/dd)
 */
export function formatDateCompact(date) {
    const target = toDate(date);
    if (!target) return '';

    const now = new Date();
    const today = getStartOfDay(now);

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

    const today = getStartOfDay(new Date());
    const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-500 font-bold';
    if (diffDays === 0) return 'text-green-600 dark:text-green-400 font-medium';
    if (diffDays === 1) return 'text-orange-500 dark:text-orange-400 font-medium';
    return 'text-gray-500 dark:text-gray-400';
}

// --- 繰り返し計算ロジック ---

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
                return nextDate;
            }
    }
    return null;
        case 'weekdays': // 平日 (月〜金)
    do {
        nextDate.setDate(nextDate.getDate() + 1);
    } while (nextDate.getDay() === 0 || nextDate.getDay() === 6);
    return nextDate;
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
    const today = getStartOfDay(new Date());

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

    if (recurrence.type === 'weekdays') {
        // 土日なら月曜まで進める
        while (today.getDay() === 0 || today.getDay() === 6) {
            today.setDate(today.getDate() + 1);
        }
        return today;
    }

    return today;
}