/**
 * タイムゾーン対応の日付ユーティリティ
 * 
 * date-fns-tz を使用して、Firestore (UTC) とローカル時間の変換を安全に行う。
 * 
 * 設計方針:
 * - Firestoreには常にUTCで保存される（Timestampは内部的にUTC）
 * - ユーザー表示時はブラウザのローカルタイムゾーンに自動変換
 * - 日付境界の比較は常にローカルタイムゾーンで行う（ユーザー体験重視）
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
import { ja } from 'date-fns/locale';

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
    return dateFnsTzFormat(date, getUserTimeZone(), formatStr, { locale: ja });
}

/**
 * 日付をコンパクトにフォーマット（今日/明日/昨日 または MM/dd）
 */
export function formatDateCompactTz(date: Date): string {
    if (isLocalToday(date)) return '今日';
    if (isLocalTomorrow(date)) return '明日';
    if (isLocalYesterday(date)) return '昨日';

    const now = new Date();
    const zonedDate = toLocalTime(date);
    const zonedNow = toLocalTime(now);

    if (zonedDate.getFullYear() !== zonedNow.getFullYear()) {
        return dateFnsTzFormat(date, getUserTimeZone(), 'yyyy/MM/dd', { locale: ja });
    }
    return dateFnsTzFormat(date, getUserTimeZone(), 'MM/dd', { locale: ja });
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
