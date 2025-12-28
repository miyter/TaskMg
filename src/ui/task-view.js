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
    // レイアウト設定: 画面全体を使うが、コンテンツは高さ固定のリストを含む
    container.className = 'flex flex-col h-full bg-transparent overflow-y-hidden';

    // メインコンテンツラッパー (全体レイアウト制御)
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'w-full max-w-3xl mx-auto h-full flex flex-col pt-2'; // 中央寄せ
    container.appendChild(contentWrapper);

    // 1. タスクリスト表示エリア (高さ固定・内部スクロール)
    // タスク12件分程度の高さを確保 (約520px)
    const listContainer = document.createElement('div');
    listContainer.id = 'task-list-container';
    listContainer.className = 'flex-none h-[520px] overflow-y-auto custom-scrollbar pr-2 mb-4 scroll-smooth';
    contentWrapper.appendChild(listContainer);

    renderTaskList(listContainer, sortedTasks, allProjects);

    // 2. 時間帯別工数統計 (リストの直下、スクロール外の固定位置)
    if (timeBlockId) {
        const statsContainer = document.createElement('div');
        statsContainer.id = 'timeblock-stats-container';
        statsContainer.className = 'flex-none mb-4 animate-fade-in';
        contentWrapper.appendChild(statsContainer);
        renderTimeBlockStats(statsContainer, tasks, timeBlockId);
    }

    // 3. タスク追加エリア (その下、固定位置)
    const inputContainer = document.createElement('div');
    inputContainer.id = 'inline-input-container';
    inputContainer.className = 'flex-none pb-10'; // 下部に余白
    contentWrapper.appendChild(inputContainer);

    // 固定追加バーとして描画 (フッターではなく、静的配置)
    // 第1引数をコンテナ自身にして、内部で書き換えさせる
    renderFixedAddTaskBar(inputContainer, inputContainer, projectId, labelId);
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