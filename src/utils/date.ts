/**
 * 日付ユーティリティ
 * 
 * NOTE: タイムゾーン対応が必要な場合は date-tz.ts を使用してください。
 * このファイルの関数はブラウザのローカルタイムゾーンで動作しますが、
 * 明示的なタイムゾーン変換が必要な場合は date-tz.ts の関数を推奨します。
 * 
 * @see ./date-tz.ts - date-fns-tz を使用したタイムゾーン対応版
 */
import { Timestamp } from "firebase/firestore";

export interface RecurrenceConfig {
    type: 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | null;
    days?: number[];
}

/**
 * 入力値をDateオブジェクトに安全に変換する (Firestore Timestamp対応)
 */
export function toDate(val: Date | Timestamp | string | number | null | undefined): Date | null {
    if (!val) return null;
    if (val instanceof Date) return val;
    // @ts-ignore: Timestamp型のチェックを動的に行う
    if (val.toDate && typeof val.toDate === 'function') return (val as Timestamp).toDate();
    const d = new Date(val as string | number);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * 2つの日付が同じ日かどうかを判定する
 */
export const isSameDay = (d1: Date | Timestamp | string | number | null, d2: Date | Timestamp | string | number | null): boolean => {
    const a = toDate(d1);
    const b = toDate(d2);
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();
};

export const isToday = (date: Date | Timestamp | string | number | null): boolean => {
    const target = toDate(date);
    if (!target) return false;
    const now = new Date();
    return target.getFullYear() === now.getFullYear() &&
        target.getMonth() === now.getMonth() &&
        target.getDate() === now.getDate();
};

export const isUpcoming = (date: Date | Timestamp | string | number | null, days: number = 7): boolean => {
    const target = toDate(date);
    if (!target) return false;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const start = new Date(now);
    start.setDate(now.getDate() + 1); // Tomorrow

    const end = new Date(now);
    end.setDate(now.getDate() + days + 1); // +8 days roughly to cover the range

    // Ensure we are comparing dates correctly
    // The previous logic was target >= tomorrow && target < nextWeek
    return target >= start && target < end;
};

// --- 集計用ヘルパー ---

export function getStartOfDay(date: Date | Timestamp | string | number | null = new Date()): Date {
    const d = toDate(date) || new Date();
    const res = new Date(d);
    res.setHours(0, 0, 0, 0);
    return res;
}

export function getEndOfDay(date: Date | Timestamp | string | number | null = new Date()): Date {
    const d = toDate(date) || new Date();
    const res = new Date(d);
    res.setHours(23, 59, 59, 999);
    return res;
}

/**
 * 週の開始日を取得
 * @param startDay 0: 日曜日, 1: 月曜日 (デフォルト: 1)
 */
export function getStartOfWeek(date: Date | Timestamp | string | number | null = new Date(), startDay: number = 1): Date {
    const d = toDate(date) || new Date();
    const day = d.getDay();
    // 指定した開始日からの差分を計算
    const diff = d.getDate() - day + (day < startDay ? startDay - 7 : startDay);
    const start = new Date(d);
    start.setDate(diff);

    // NOTE: FirestoreはUTCで保存されるが、表示時はローカルタイムに変換される。
    // 日付境界での不整合を避けるため、常にローカルタイムの 00:00:00 を基準とする。
    return getStartOfDay(start);
}

export function getStartOfMonth(date: Date | Timestamp | string | number | null = new Date()): Date {
    const d = toDate(date) || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

// --- UI・フォーマット関連 ---

/**
 * 日付をコンパクトにフォーマット (今日/明日/昨日 または mm/dd)
 */
export function formatDateCompact(date: Date | Timestamp | string | number | null): string {
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
 * HTML <input type="date"> 用のフォーマット (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | Timestamp | string | number | null): string => {
    const target = toDate(date);
    if (!target) return '';
    const y = target.getFullYear();
    const m = String(target.getMonth() + 1).padStart(2, '0');
    const d = String(target.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * HTML <input type="date"> の値 (YYYY-MM-DD) をDate型に変換
 */
export const parseDateInput = (val: string): Date | null => {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
};

/**
 * 期限日に基づくTailwindカラークラスを取得
 */
export function getTaskDateColor(date: Date | Timestamp | string | number | null): string {
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
export function getNextRecurrenceDate(currentDueDate: Date | Timestamp | string | number | null, recurrence: RecurrenceConfig): Date | null {
    if (!currentDueDate || !recurrence?.type) return null;
    const nextDate = new Date(toDate(currentDueDate)!);

    switch (recurrence.type) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            return nextDate;

        case 'weekly': {
            if (!recurrence.days?.length) return null;
            const currentDay = nextDate.getDay();
            // 1日目から探索開始（当日は含めない = 次の該当曜日を探す）
            for (let i = 1; i <= 7; i++) {
                const targetDay = (currentDay + i) % 7;
                if (recurrence.days.includes(targetDay)) {
                    nextDate.setDate(nextDate.getDate() + i);
                    return nextDate;
                }
            }
            return null;
        }

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
export function getInitialDueDateFromRecurrence(recurrence: RecurrenceConfig): Date {
    const today = getStartOfDay(new Date());

    if (!recurrence?.type || recurrence.type === 'daily' || recurrence.type === 'monthly') {
        return today;
    }

    if (recurrence.type === 'weekly' && recurrence.days && recurrence.days.length > 0) {
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
