// @ts-nocheck
// @miyter:20251221
// カスタムフィルターのクエリ文字列解析ロジック

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

        // 4. キーワード判定 (AND)
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