// @ts-nocheck
/**
 * 更新日: 2025-12-29
 * 内容: コンテキストメニューからのソート変更、複数選択モード対応、レイアウトの高さ調整
 */

import { renderTaskList } from './task-list.js';
import { renderInlineInput, renderFixedAddTaskBar } from './task-input.js';
import { sortTasks } from '../logic/sort.js';
import { renderTimeBlockStats } from './components/TimeBlockStats.js';
import { selectionState, subscribeToSelectionChange } from './state/ui-state.js';

// main.js 等で利用するために再エクスポート
export { renderTaskList };

// 再描画用に直前の引数を保持
let lastRenderArgs = null;

// コンテキストメニューからのソート要求を処理
document.addEventListener('request-sort-change', (e) => {
    const { sort } = e.detail;
    // セレクトボックスがあれば更新
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.value = sort;
    }
    // トリガーデータがあれば更新
    const sortTrigger = document.getElementById('sort-trigger');
    if (sortTrigger) {
        sortTrigger.dataset.value = sort;
        // 表示ラベルの更新ロジックが必要だが、ここでは再描画で反映させる
        const label = document.getElementById('sort-label');
        if (label) {
            if (sort === 'title_asc') label.textContent = '名前順';
            if (sort === 'dueDate_asc') label.textContent = '日付順';
        }
    }

    // 再描画
    if (lastRenderArgs) {
        renderTaskView(...lastRenderArgs);
    }
});

// 選択モードの変化を監視して再描画（カレントのリストを維持）
subscribeToSelectionChange(() => {
    if (lastRenderArgs) {
        // ちらつき防止のため、コンテンツ差分更新が理想だが、
        // 簡易的に全体再描画を行う。スクロール位置は維持したい場合はtask-list側で制御が必要。
        // ここでは単純再描画。
        renderTaskView(...lastRenderArgs);
    }
});

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
    // 引数をキャッシュ
    lastRenderArgs = [tasks, allProjects, allLabels, projectId, labelId, timeBlockId];

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
    // レイアウト設定: 画面全体を使う。
    container.className = 'flex flex-col h-full bg-transparent overflow-hidden';

    // メインコンテンツラッパー (全体レイアウト制御)
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'w-full max-w-3xl mx-auto h-full flex flex-col pt-2'; // 中央寄せ
    container.appendChild(contentWrapper);

    // 1. タスクリスト表示エリア
    // flex-1 を指定し、残りの高さを全て使う。これにより入力欄が下部に固定される。
    const listContainer = document.createElement('div');
    listContainer.id = 'task-list-container';
    // overflow-y-auto でここだけスクロールさせる
    listContainer.className = 'flex-1 overflow-y-auto custom-scrollbar pr-2 mb-2 scroll-smooth min-h-0';
    contentWrapper.appendChild(listContainer);

    renderTaskList(listContainer, sortedTasks, allProjects, selectionState);

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
    // 下部に適度な余白
    inputContainer.className = 'flex-none pb-6';
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