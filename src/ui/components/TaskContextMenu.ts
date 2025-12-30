/**
 * タスクコンテキストメニュー (スタブ)
 * TODO: 実装が必要な場合は機能を追加
 */

import { Task } from '../../store/schema';

/**
 * タスクのコンテキストメニューを表示 (未実装スタブ)
 */
export function showTaskContextMenu(task: Task | null, x: number, y: number): void {
    // TODO: 右クリックメニューの実装
    console.debug('[TaskContextMenu] Context menu requested for task:', task?.id, 'at', x, y);
}
