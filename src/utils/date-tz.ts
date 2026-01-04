/**
 * タイムゾーン対応の日付ユーティリティ
 * 
 * date-fns-tz を使用して、Firestore (UTC) とローカル時間の変換を安全に行う。
 * i18n対応済み：現在の言語設定に基づいてフォーマットを行う。
 */

import {
    addDays,
    addMonths,
    startOfMonth as dateFnsStartOfMonth,
    startOfWeek as dateFnsStartOfWeek,
    differenceInCalendarDays,
    endOfDay,
    getDay,
    isToday,
    isTomorrow,
    isYesterday,
    startOfDay
} from 'date-fns';
import {
    formatInTimeZone as dateFnsTzFormat,
    fromZonedTime,
    toZonedTime
} from 'date-fns-tz';
import { enUS, ja } from 'date-fns/locale';
import { translations } from '../core/i18n/constants';
import { Language } from '../core/i18n/types';
import { useSettingsStore } from '../store/ui/settings-store';

/**
 * 現在のロケールを取得
 */
const getCurrentLocale = () => {
    const { language } = useSettingsStore.getState();
    return language === 'en' ? enUS : ja;
};

/**
 * 現在の言語の翻訳リソースを取得
 */
const getTranslations = () => {
    const { language } = useSettingsStore.getState();
    return translations[language as Language] || translations['ja'];
};

/**
 * ユーザーのタイムゾーンを取得
 */
export function getUserTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * UTC DateをユーザーのローカルタイムゾーンのDateに変換
 */
export function toLocalTime(date: Date): Date {
    return toZonedTime(date, getUserTimeZone());
}

/**
 * ローカルタイムのDateをUTC Dateに変換
 */
export function toUTCTime(date: Date): Date {
    return fromZonedTime(date, getUserTimeZone());
}

/**
 * ローカルタイムゾーンでの日の開始時刻を取得
 */
export function getLocalStartOfDay(date: Date = new Date()): Date {
    const zonedDate = toLocalTime(date);
    return startOfDay(zonedDate);
}

/**
 * ローカルタイムゾーンでの日の終了時刻を取得
 */
export function getLocalEndOfDay(date: Date = new Date()): Date {
    const zonedDate = toLocalTime(date);
    return endOfDay(zonedDate);
}

/**
 * ローカルタイムゾーンでの週の開始日を取得
 * @param weekStartsOn 0: 日曜日, 1: 月曜日 (デフォルト: 1)
 */
export function getLocalStartOfWeek(date: Date = new Date(), weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1): Date {
    const zonedDate = toLocalTime(date);
    return dateFnsStartOfWeek(zonedDate, { weekStartsOn });
}

/**
 * ローカルタイムゾーンでの月の開始日を取得
 */
export function getLocalStartOfMonth(date: Date = new Date()): Date {
    const zonedDate = toLocalTime(date);
    return dateFnsStartOfMonth(zonedDate);
}

/**
 * ローカルタイムゾーンで「今日」かどうかを判定
 */
export function isLocalToday(date: Date): boolean {
    return isToday(toLocalTime(date));
}

/**
 * ローカルタイムゾーンで「明日」かどうかを判定
 */
export function isLocalTomorrow(date: Date): boolean {
    return isTomorrow(toLocalTime(date));
}

/**
 * ローカルタイムゾーンで「昨日」かどうかを判定
 */
export function isLocalYesterday(date: Date): boolean {
    return isYesterday(toLocalTime(date));
}

/**
 * 2つの日付間のカレンダー日数差を計算（ローカルタイムゾーン基準）
 */
export function getDaysDifference(dateLeft: Date, dateRight: Date): number {
    return differenceInCalendarDays(toLocalTime(dateLeft), toLocalTime(dateRight));
}

/**
 * 日付をローカルタイムゾーンでフォーマット
 */
export function formatLocalDate(date: Date, formatStr: string = 'yyyy/MM/dd'): string {
    return dateFnsTzFormat(date, getUserTimeZone(), formatStr, { locale: getCurrentLocale() });
}

/**
 * 日付をコンパクトにフォーマット（今日/明日/昨日 または MM/dd）
 */
export function formatDateCompactTz(date: Date): string {
    const t = getTranslations();

    if (isLocalToday(date)) return t.date_options.today;
    if (isLocalTomorrow(date)) return t.date_options.tomorrow;
    if (isLocalYesterday(date)) return t.date_options.yesterday;

    const now = new Date();
    const zonedDate = toLocalTime(date);
    const zonedNow = toLocalTime(now);

    if (zonedDate.getFullYear() !== zonedNow.getFullYear()) {
        return dateFnsTzFormat(date, getUserTimeZone(), 'yyyy/MM/dd', { locale: getCurrentLocale() });
    }
    return dateFnsTzFormat(date, getUserTimeZone(), 'MM/dd', { locale: getCurrentLocale() });
}

/**
 * HTML input[type="date"] 用のフォーマット (YYYY-MM-DD)
 * ローカルタイムゾーンで日付部分を取得
 */
export function formatForDateInput(date: Date): string {
    return dateFnsTzFormat(date, getUserTimeZone(), 'yyyy-MM-dd');
}

/**
 * 日付を次の営業日（月〜金）に進める
 */
export function nextWeekday(date: Date): Date {
    let result = addDays(toLocalTime(date), 1);
    while (getDay(result) === 0 || getDay(result) === 6) {
        result = addDays(result, 1);
    }
    return result;
}

/**
 * 日付を指定日数分進める
 */
export function addDaysLocal(date: Date, days: number): Date {
    return addDays(toLocalTime(date), days);
}

/**
 * 日付を指定月数分進める
 */
export function addMonthsLocal(date: Date, months: number): Date {
    return addMonths(toLocalTime(date), months);
}

/**
 * 曜日を取得（0: 日曜日 〜 6: 土曜日）
 */
export function getDayOfWeek(date: Date): number {
    return getDay(toLocalTime(date));
}

/**
 * 任意の日付形式をDateオブジェクトに変換 (Timestamp対応)
 */
export function ensureDate(val: Date | { toDate: () => Date } | number | string | null | undefined): Date | null {
    if (val === null || val === undefined) return null;
    if (val instanceof Date) return val;
    // Duck typing for Firestore Timestamp to avoid dependency
    if (typeof val === 'object' && 'toDate' in val && typeof (val as any).toDate === 'function') {
        return (val as any).toDate();
    }
    const d = new Date(val as string | number);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * 期限日に基づくTailwindカラークラスを取得 (タイムゾーン考慮)
 */
export function getTaskDateColorTz(date: Date | { toDate: () => Date } | number | string | null | undefined): string {
    const target = ensureDate(date);
    if (!target) return 'text-gray-500 dark:text-gray-400';

    const zonedDate = toLocalTime(target);
    const zonedNow = toLocalTime(new Date());

    // reset time to compare dates only
    zonedDate.setHours(0, 0, 0, 0);
    zonedNow.setHours(0, 0, 0, 0);

    const diffDays = differenceInCalendarDays(zonedDate, zonedNow);

    if (diffDays < 0) return 'text-red-500 font-bold';
    if (diffDays === 0) return 'text-green-600 dark:text-green-400 font-medium';
    if (diffDays === 1) return 'text-orange-500 dark:text-orange-400 font-medium';
    return 'text-gray-500 dark:text-gray-400';
}
