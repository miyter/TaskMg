// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: ヘッダータイトルの具体化、ソートロジックの改善（Grok指摘対応）
 */

import { renderTaskList } from './task-list.js';
import { renderInlineInput, renderFixedAddTaskBar } from './task-input.js';
import { sortTasks } from '../logic/sort.js';
import { renderTimeBlockStats } from './components/TimeBlockStats.js';

// main.js 等で利用するために再エクスポート
export { renderTaskList };

/**
 * タスクビュー全体（リスト＋入力欄）を描画
 * @param {Array} tasks - 表示するタスクの配列
 * @param {Array} allProjects - 全プロジェクトの配列
 * @param {Array} allLabels - 全ラベルの配列 (追加)
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 * @param {string|null} timeBlockId - TimeBlock ID for stats
 */
export function renderTaskView(tasks, allProjects, allLabels = [], projectId = null, labelId = null, timeBlockId = null) {
    const container = document.getElementById('task-view');
    if (!container) return;

    // ヘッダー情報の更新
    updateHeaderInfo(tasks.length, projectId, labelId, allProjects, allLabels);

    // ソート準備
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
    // レイアウト設定: 画面全体を使うためにflex columnとoverflow制御
    container.className = 'flex flex-col h-full relative overflow-hidden';

    // 1. スクロール領域 (リスト + 統計 + 入力フォーム)
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'flex-1 overflow-y-auto custom-scrollbar p-1 pb-20'; // フッター分の余白
    container.appendChild(scrollContainer);

    // タスクリスト
    const listContainer = document.createElement('div');
    listContainer.id = 'task-list-container';
    scrollContainer.appendChild(listContainer);
    renderTaskList(listContainer, sortedTasks, allProjects);

    // 時間帯別統計 (指定がある場合、リストの直下に表示)
    if (timeBlockId) {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'timeblock-stats-container';
        scrollContainer.appendChild(statsContainer);
        renderTimeBlockStats(statsContainer, tasks, timeBlockId);
    }

    // インライン入力フォームエリア (初期は非表示、フッターボタンで展開)
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inline-input-container';
    inputContainer.className = 'mt-4 hidden'; // 初期非表示
    scrollContainer.appendChild(inputContainer);

    // 2. 固定フッター (タスク追加ボタン)
    const footerContainer = document.createElement('div');
    footerContainer.id = 'fixed-buffer-footer';
    footerContainer.className = 'absolute bottom-0 left-0 w-full h-12 bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 z-20';
    container.appendChild(footerContainer);

    // 固定フッターを描画
    renderFixedAddTaskBar(footerContainer, inputContainer, projectId, labelId);
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