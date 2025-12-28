// @ts-nocheck
// @miyter:20251221
// カスタムフィルターのクエリ文字列解析ロジック
import { getStartOfDay, getEndOfDay, getStartOfWeek, toDate } from '../utils/date.js';

/**
 * クエリ文字列からフィルタリング関数を生成
 * 形式: "project:A,B timeblock:C,null keyword"
 * カテゴリ間: AND, カテゴリ内(カンマ区切り): OR
 */
export function createFilter(queryString) {
    if (!queryString?.trim()) return () => true;

    const conditions = parseQuery(queryString);

    return (task) => {
        // 1. プロジェクト判定 (OR)
        if (conditions.projectIds && !conditions.projectIds.has(task.projectId)) return false;

        // 2. 時間帯判定 (OR)
        if (conditions.timeBlockIds) {
            const taskTbId = (task.timeBlockId === null || task.timeBlockId === 'null') ? 'null' : String(task.timeBlockId);
            if (!conditions.timeBlockIds.has(taskTbId)) return false;
        }

        // 3. 所要時間判定 (OR)
        if (conditions.durations) {
            const taskDuration = task.duration ? Number(task.duration) : 0;
            if (!conditions.durations.has(taskDuration)) return false;
        }

        // 4. 日付判定 (OR)
        if (conditions.dates && conditions.dates.size > 0) {
            const dueDate = task.dueDate ? toDate(task.dueDate) : null;
            if (!dueDate) return false;

            const now = new Date();
            const todayStart = getStartOfDay(now);

            // 条件のいずれかに一致すればOK
            let dateMatch = false;
            if (conditions.dates.has('today')) {
                // 今日 (過去含む) = 期限が今日の終わり以前
                if (dueDate <= getEndOfDay(now)) dateMatch = true;
            }
            if (!dateMatch && conditions.dates.has('tomorrow')) {
                const tomorrowStart = new Date(todayStart);
                tomorrowStart.setDate(tomorrowStart.getDate() + 1);
                const tomorrowEnd = getEndOfDay(tomorrowStart);
                if (dueDate >= tomorrowStart && dueDate <= tomorrowEnd) dateMatch = true;
            }
            if (!dateMatch && conditions.dates.has('week')) {
                // 今週 (週の始まり〜終わり)
                // getStartOfWeekは月曜始まりを想定
                const weekStart = getStartOfWeek(now);
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);
                if (dueDate >= weekStart && dueDate <= weekEnd) dateMatch = true;
            }
            if (!dateMatch && conditions.dates.has('next-week')) {
                const weekStart = getStartOfWeek(now);
                const nextWeekStart = new Date(weekStart);
                nextWeekStart.setDate(nextWeekStart.getDate() + 7);
                const nextWeekEnd = new Date(nextWeekStart);
                nextWeekEnd.setDate(nextWeekEnd.getDate() + 6);
                nextWeekEnd.setHours(23, 59, 59, 999);
                if (dueDate >= nextWeekStart && dueDate <= nextWeekEnd) dateMatch = true;
            }

            if (!dateMatch) return false;
        }

        // 5. キーワード判定 (AND)
        if (conditions.keywords.length > 0) {
            const searchTarget = `${task.title} ${task.description || ''}`.toLowerCase();
            if (!conditions.keywords.every(kw => searchTarget.includes(kw))) return false;
        }

        return true;
    };
}

/**
 * 文字列を解析して内部的な条件オブジェクトに変換
 */
function parseQuery(queryString) {
    const conditions = {
        projectIds: null,
        timeBlockIds: null,
        durations: null,
        dates: null,
        keywords: []
    };

    queryString.trim().split(/\s+/).forEach(part => {
        if (part.includes(':')) {
            const [key, rawValue] = part.split(':');
            const values = rawValue.split(',').filter(Boolean);

            if (values.length === 0) return;

            switch (key) {
                case 'project':
                    conditions.projectIds = new Set(values);
                    break;
                case 'timeblock':
                    conditions.timeBlockIds = new Set(values.map(v => String(v)));
                    break;
                case 'duration':
                    conditions.durations = new Set(values.map(v => parseInt(v, 10)).filter(n => !isNaN(n)));
                    break;
                case 'date':
                    conditions.dates = new Set(values);
                    break;
                default:
                    // 未知のタグはキーワードとして扱う
                    conditions.keywords.push(part.toLowerCase());
            }
        } else {
            conditions.keywords.push(part.toLowerCase());
        }
    });

    return conditions;
}