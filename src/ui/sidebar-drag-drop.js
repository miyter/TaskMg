// @ts-nocheck
// サイドバーのドラッグ＆ドロップ機能管理

import { updateTask } from '../store/store.js';
import { showMessageModal } from './components.js';

/**
 * 指定された要素にドロップゾーンのイベントを設定する
 * @param {HTMLElement} element - ドロップゾーンとなる要素
 * @param {string} type - ドロップゾーンのタイプ ('inbox', 'project', 'timeblock', 'duration')
 * @param {string|number|null} value - ドロップ時の更新値 (プロジェクトID, 時間帯ID, 分数など)
 */
export function setupDropZone(element, type, value = null) {
    if (!element) return;

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
        const taskId = e.dataTransfer.getData('text/plain');

        if (taskId) {
            try {
                if (type === 'inbox') {
                    await updateTask(taskId, { projectId: null });
                    // showMessageModal("タスクをインボックスに戻しました"); // ★削除
                } else if (type === 'project' && value) {
                    await updateTask(taskId, { projectId: value });
                    // showMessageModal("プロジェクトへ移動しました"); // ★削除
                } 
                // 時間帯へのドロップ
                else if (type === 'timeblock') {
                    // value が null (文字列の'null'や'unassigned') なら未定、それ以外はID
                    const timeBlockId = (value === 'unassigned' || value === null) ? null : value;
                    await updateTask(taskId, { timeBlockId: timeBlockId });
                    // ポップアップ削除 (元々コメントで「ポップアップ削除」と書かれていたため、何もしない)
                }
                // 所要時間へのドロップ
                else if (type === 'duration' && value) {
                    const minutes = parseInt(value, 10);
                    await updateTask(taskId, { duration: minutes });
                    // ポップアップ削除 (元々コメントで「ポップアップ削除」と書かれていたため、何もしない)
                }
            } catch (error) {
                console.error("Drop Error:", error);
            }
        }
    });
}