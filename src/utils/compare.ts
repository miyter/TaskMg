/**
 * 簡易的な配列の内容比較
 */
export function areArraysEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * タスク一覧の変更検知
 */
export function areTaskArraysIdentical(a: any[] | undefined, b: any[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        const ta = a[i];
        const tb = b[i];
        if (ta.id !== tb.id) return false;
        if (ta.status !== tb.status) return false;
        if (ta.title !== tb.title) return false;
        if (ta.description !== tb.description) return false;
        if (ta.projectId !== tb.projectId) return false;
        if (ta.timeBlockId !== tb.timeBlockId) return false;
        if (ta.duration !== tb.duration) return false;
        // 日付の比較（getTime()等）はパフォーマンスと相談だが、一旦これだけでも十分安定する
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
