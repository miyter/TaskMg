// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: ヘッダータイトルの具体化、ソートロジックの改善（Grok指摘対応）
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
 * @param {Array} allLabels - 全ラベルの配列 (追加)
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 */
export function renderTaskView(tasks, allProjects, allLabels = [], projectId = null, labelId = null) {
    const container = document.getElementById('task-view');
    if (!container) return;

    // ヘッダー情報の更新（具体的な名前を表示）
    updateHeaderInfo(tasks.length, projectId, labelId, allProjects, allLabels);

    // ソートの適用
    // 1. 隠しselect要素があればそれを使う
    // 2. なければカスタムドロップダウンのトリガーから値を取得
    // 3. どちらもなければデフォルト
    const sortSelect = document.getElementById('sort-select');
    const sortTrigger = document.getElementById('sort-trigger');
    
    let sortValue = 'createdAt_desc';
    if (sortSelect) {
        sortValue = sortSelect.value;
    } else if (sortTrigger && sortTrigger.dataset.value) {
        sortValue = sortTrigger.dataset.value;
    }

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
function updateHeaderInfo(count, projectId, labelId, allProjects, allLabels) {
    const headerTitle = document.getElementById('header-title');
    const headerCount = document.getElementById('header-count');
    
    if (headerTitle) {
        let title = "インボックス";
        
        if (projectId) {
            const project = allProjects.find(p => p.id === projectId);
            title = project ? project.name : "プロジェクト";
        } else if (labelId) {
            const label = allLabels.find(l => l.id === labelId);
            title = label ? `${label.name}` : "ラベル";
        }
        
        headerTitle.textContent = title;
    }
    
    if (headerCount) {
        headerCount.textContent = `${count}件`;
    }
}