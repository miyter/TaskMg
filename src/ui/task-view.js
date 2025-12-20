// 機能ごとのモジュールをインポート
import { renderTaskList } from './task-list.js';
import { renderInlineInput } from './task-input.js';
import { sortTasks } from '../logic/sort.js';

// 状態管理用変数
let currentProjectId = null;
let currentLabelId = null;

// =========================================================
// 公開メソッド (main.js / app.js から利用)
// =========================================================

/**
 * ★重要: main.js が必要としている関数をここから再エクスポートします
 * これにより、外部からは task-view.js ひとつを見るだけで済みます
 */
export { renderTaskList };

/**
 * タスクビュー全体（リスト＋入力欄）を描画するメイン関数
 * @param {Array} tasks - 表示するタスクの配列
 * @param {Array} allProjects - 全プロジェクトの配列 ★追加
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 */
export function renderTaskView(tasks, allProjects, projectId = null, labelId = null) {
    currentProjectId = projectId;
    currentLabelId = labelId;
    
    const container = document.getElementById('task-view');
    if (!container) return;

    // ヘッダー情報の更新
    updateHeaderInfo(tasks.length, projectId, labelId);

    // ソートの適用
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect ? sortSelect.value : 'createdAt_desc';
    const sortedTasks = sortTasks(tasks, sortValue);

    container.innerHTML = '';

    // 1. リストの描画 (task-list.js の機能を利用)
    // ★修正: renderTaskList に allProjects を渡す
    renderTaskList(container, sortedTasks, allProjects);

    // 2. インライン入力フォームの描画 (task-input.js の機能を利用)
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inline-input-container';
    inputContainer.className = 'mt-2 pb-10';
    container.appendChild(inputContainer);

    renderInlineInput(inputContainer, currentProjectId, currentLabelId);
}

// =========================================================
// 内部ヘルパー
// =========================================================

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
}// @ts-nocheck
// @miyter:20251221
// タスクビューのレイアウト構成（リスト + 入力欄）

import { renderTaskList } from './task-list.js';
import { renderInlineInput } from './task-input.js';

/**
 * タスクビュー全体を描画
 * @param {Array} tasks - フィルタ・ソート済みのタスク配列
 * @param {Array} allProjects - プロジェクト一覧（コンテキスト用）
 * @param {string|null} projectId - 選択中のプロジェクトID
 * @param {string|null} labelId - 選択中のラベルID
 */
export function renderTaskView(tasks, allProjects, projectId = null, labelId = null) {
    const container = document.getElementById('task-view');
    if (!container) return;

    // コンテナを初期化
    container.innerHTML = '';

    // 1. タスクリスト表示エリア
    const listContainer = document.createElement('div');
    listContainer.id = 'task-list-container';
    container.appendChild(listContainer);
    
    renderTaskList(listContainer, tasks, allProjects);

    // 2. インライン入力フォームエリア
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inline-input-container';
    inputContainer.className = 'mt-2 pb-10';
    container.appendChild(inputContainer);

    renderInlineInput(inputContainer, projectId, labelId);
}