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
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 */
export function renderTaskView(tasks, projectId = null, labelId = null) {
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
    renderTaskList(container, sortedTasks);

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
}