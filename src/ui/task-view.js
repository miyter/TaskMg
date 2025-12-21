// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 重複宣言の解消とモジュールの一本化
 */

import { renderTaskList } from './task-list.js';
import { renderInlineInput } from './task-input.js';
import { sortTasks } from '../logic/sort.js';

// main.js 等で利用するために再エクスポート
export { renderTaskList };

/**
 * タスクビュー全体（リスト＋入力欄）を描画
 * @param {Array} tasks - 表示するタスクの配列
 * @param {Array} allProjects - 全プロジェクトの配列
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 */
export function renderTaskView(tasks, allProjects, projectId = null, labelId = null) {
    const container = document.getElementById('task-view');
    if (!container) return;

    // ヘッダー情報の更新
    updateHeaderInfo(tasks.length, projectId, labelId);

    // ソートの適用
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect ? sortSelect.value : 'createdAt_desc';
    const sortedTasks = sortTasks(tasks, sortValue);

    container.innerHTML = '';

    // 1. タスクリスト表示エリア
    const listContainer = document.createElement('div');
    listContainer.id = 'task-list-container';
    container.appendChild(listContainer);
    
    renderTaskList(listContainer, sortedTasks, allProjects);

    // 2. インライン入力フォームエリア
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inline-input-container';
    inputContainer.className = 'mt-2 pb-10';
    container.appendChild(inputContainer);

    renderInlineInput(inputContainer, projectId, labelId);
}

/**
 * ヘッダータイトルと件数の更新
 */
function updateHeaderInfo(count, projectId, labelId) {
    const headerTitle = document.getElementById('header-title');
    const headerCount = document.getElementById('header-count');
    
    if (headerTitle) {
        if (projectId) {
            headerTitle.textContent = "プロジェクトタスク"; 
        } else if (labelId) {
            headerTitle.textContent = "ラベル付きタスク";
        } else {
            headerTitle.textContent = "インボックス";
        }
    }
    if (headerCount) {
        headerCount.textContent = `${count}件`;
    }
}