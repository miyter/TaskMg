// @ts-nocheck
/**
 * カスタムフィルターパーサー
 * フィルターモーダルで生成された構造化クエリ文字列を解析し、
 * タスクが条件に合致するか判定する関数を返します。
 * * 対応フォーマット:
 * - project:id1,id2  (プロジェクトIDがいずれかに一致)
 * - timeblock:id1,null (時間帯IDがいずれかに一致、nullは未定)
 * - duration:30,60   (所要時間がいずれかに一致)
 * - 上記以外の文字列   (タイトルや説明文へのキーワード検索)
 * * 各カテゴリ間は AND 条件、カテゴリ内のカンマ区切りは OR 条件として扱います。
 */

/**
 * クエリ文字列からフィルタリング関数を生成する
 * @param {string} queryString - "project:A,B timeblock:C keyword"
 * @returns {Function} (task) => boolean
 */
export function createFilter(queryString) {
    if (!queryString || !queryString.trim()) {
        return () => true;
    }

    // 1. クエリの解析
    const conditions = {
        projectIds: null, // Set<string> | null
        timeBlockIds: null, // Set<string> | null
        durations: null, // Set<number> | null
        keywords: [] // string[]
    };

    // 空白で分割して各パートを解析
    const parts = queryString.trim().split(/\s+/);

    parts.forEach(part => {
        if (part.startsWith('project:')) {
            const val = part.substring(8); // 'project:'.length
            if (val) {
                // 既存の条件があればマージする（あるいは上書き）
                const ids = val.split(',').filter(s => s);
                if (!conditions.projectIds) conditions.projectIds = new Set();
                ids.forEach(id => conditions.projectIds.add(id));
            }
        } else if (part.startsWith('timeblock:')) {
            const val = part.substring(10); // 'timeblock:'.length
            if (val) {
                const ids = val.split(',').filter(s => s);
                if (!conditions.timeBlockIds) conditions.timeBlockIds = new Set();
                ids.forEach(id => conditions.timeBlockIds.add(id));
            }
        } else if (part.startsWith('duration:')) {
            const val = part.substring(9); // 'duration:'.length
            if (val) {
                const mins = val.split(',').map(v => parseInt(v, 10)).filter(n => !isNaN(n));
                if (!conditions.durations) conditions.durations = new Set();
                mins.forEach(m => conditions.durations.add(m));
            }
        } else {
            // キーワード検索（除外キーワード '-' は未対応だが拡張可能）
            conditions.keywords.push(part.toLowerCase());
        }
    });

    // 2. 評価関数の返却
    return (task) => {
        // プロジェクト判定 (OR条件)
        if (conditions.projectIds) {
            // タスクのプロジェクトIDが条件セットに含まれているか
            // プロジェクト未設定のタスク(null)は、条件に'null'文字列が含まれていればヒットとする運用も可能だが、
            // 現状のUIではプロジェクトIDのみ扱う
            if (!task.projectId || !conditions.projectIds.has(task.projectId)) {
                return false;
            }
        }

        // 時間帯判定 (OR条件)
        if (conditions.timeBlockIds) {
            // タスクの時間帯ID (未設定は null)
            // モーダル側で "null" という文字列を未定として扱っているため、文字列比較を行う
            const taskTbId = task.timeBlockId === null ? 'null' : task.timeBlockId;
            if (!conditions.timeBlockIds.has(taskTbId)) {
                return false;
            }
        }

        // 所要時間判定 (OR条件)
        if (conditions.durations) {
            const taskDuration = task.duration || 0; // 未設定は0扱い、またはヒットしないようにするか
            // task.duration が undefined/null の場合の扱い
            if (!task.duration || !conditions.durations.has(task.duration)) {
                return false;
            }
        }

        // キーワード判定 (AND条件)
        if (conditions.keywords.length > 0) {
            const text = `${task.title} ${task.description || ''}`.toLowerCase();
            // すべてのキーワードが含まれていること
            const isMatch = conditions.keywords.every(kw => text.includes(kw));
            if (!isMatch) {
                return false;
            }
        }

        return true;
    };
}