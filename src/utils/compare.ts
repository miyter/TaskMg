import { deepEqual } from 'fast-equals';
import { Project, Task } from '../store/schema';

/**
 * 汎用的な等価比較
 */
export function areEqual(a: any, b: any): boolean {
    return deepEqual(a, b);
}

/**
 * 簡易的な配列の内容比較
 * 現在は fast-equals の deepEqual を使用
 */
export function areArraysEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
    return deepEqual(a, b);
}

/**
 * タスク一覧の変更検知（順序非依存版）
 * ID でソートした後に比較するため、Firestore の順序保証がない場合でも安定動作
 */
export function areTaskArraysIdentical(a: Task[] | undefined, b: Task[] | undefined): boolean {
    if (a === b) return true;
    if (!a || !b || a.length !== b.length) return false;

    // IDでソートして順序非依存にする
    const sortedA = [...a].sort((x, y) => (x.id || '').localeCompare(y.id || ''));
    const sortedB = [...b].sort((x, y) => (x.id || '').localeCompare(y.id || ''));

    return deepEqual(sortedA, sortedB);
}

/**
 * プロジェクト一覧の変更検知
 */
export function areProjectArraysIdentical(a: Project[] | undefined, b: Project[] | undefined): boolean {
    // 順序も重要とみなし、単純比較を行う
    return deepEqual(a, b);
}
