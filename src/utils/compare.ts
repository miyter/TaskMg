/**
 * 簡易的な配列の内容比較
 * 
 * ⚠️ 注意: JSON.stringify を使用しているため、以下の制限があります:
 * - プロパティの順序に依存
 * - 循環参照に対応していない
 * - Date オブジェクトは文字列化される
 * 単純な値の配列やプリミティブ向けです。
 */
export function areArraysEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * タスク一覧の変更検知（順序非依存版）
 * 
 * ID でソートした後に比較するため、Firestore の順序保証がない場合でも安定動作
 */
export function areTaskArraysIdentical(a: any[] | undefined, b: any[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;

    // IDでソートして順序非依存にする
    const sortedA = [...a].sort((x, y) => (x.id || '').localeCompare(y.id || ''));
    const sortedB = [...b].sort((x, y) => (x.id || '').localeCompare(y.id || ''));

    for (let i = 0; i < sortedA.length; i++) {
        const ta = sortedA[i];
        const tb = sortedB[i];
        if (ta.id !== tb.id) return false;
        if (ta.status !== tb.status) return false;
        if (ta.title !== tb.title) return false;
        if (ta.description !== tb.description) return false;
        if (ta.projectId !== tb.projectId) return false;
        if (ta.timeBlockId !== tb.timeBlockId) return false;
        if (ta.duration !== tb.duration) return false;
        if (ta.isImportant !== tb.isImportant) return false;
        // 日付の比較 (Date / Firestore Timestamp の両方に対応)
        const toMs = (val: any): number | null | undefined => {
            if (val === null || val === undefined) return val;
            if (val instanceof Date) return val.getTime();
            if (typeof val?.toMillis === 'function') return val.toMillis(); // Firestore Timestamp
            if (typeof val === 'number') return val;
            return val;
        };
        if (toMs(ta.dueDate) !== toMs(tb.dueDate)) return false;
    }

    return true;
}

/**
 * プロジェクト一覧の変更検知
 */
export function areProjectArraysIdentical(a: any[] | undefined, b: any[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].id !== b[i].id) return false;
        if (a[i].name !== b[i].name) return false;
        if (a[i].color !== b[i].color) return false;
    }

    return true;
}
