/**
 * 更新日: 2025-12-29
 * 内容: コンテキストメニューからのソート変更、複数選択モード対応、レイアウトの高さ調整、ヘッダータイトルの動的反映
 */

import { SIDEBAR_CONFIG } from './features/sidebar/sidebar-constants';
import { renderTaskList } from './task-list';
// @ts-ignore: task-input.ts exports are checked and exist
import { sortTasks } from '../logic/sort';
import { Label, Project, Task } from '../store/schema';
import { renderTimeBlockStats } from './components/TimeBlockStats';
import { selectionState, subscribeToSelectionChange } from './state/ui-state';

// main.js 等で利用するために再エクスポート
export { renderTaskList };

// 再描画用に直前の引数を保持
let lastRenderArgs: [Task[], Project[], Label[], any] | null = null;

// コンテキストメニューからのソート要求を処理
document.addEventListener('request-sort-change', (e: any) => {
    const { sort } = e.detail;
    // セレクトボックスがあれば更新
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
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
        renderTaskView(...lastRenderArgs);
    }
});

// 表示件数変更の監視
window.addEventListener('visible-task-count-updated', () => {
    if (lastRenderArgs) {
        renderTaskView(...lastRenderArgs);
    }
});

// UI密度変更の監視
window.addEventListener('sidebar-settings-updated', () => {
    if (lastRenderArgs) {
        renderTaskView(...lastRenderArgs);
    }
});

/**
 * タスクビュー全体（リスト＋入力欄）を描画
 * @param {Array} tasks - 表示するタスクの配列
 * @param {Array} allProjects - 全プロジェクトの配列
 * @param {Array} allLabels - 全ラベルの配列 (追加)
 * @param {Object} context - コンテキスト情報 (projectId, labelId, timeBlockId, title等)
 */
export function renderTaskView(tasks: Task[], allProjects: Project[], allLabels: Label[] = [], context: any = {}): void {
    const { projectId = null, labelId = null, timeBlockId = null, title = '' } = context;

    // 引数をキャッシュ
    lastRenderArgs = [tasks, allProjects, allLabels, context];

    const container = document.getElementById('task-view');
    if (!container) return;

    // ヘッダー情報の更新
    updateHeaderInfo(tasks.length, title);

    // ソート準備
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
    const sortTrigger = document.getElementById('sort-trigger');
    let sortValue = 'createdAt_desc';
    if (sortSelect) {
        sortValue = sortSelect.value;
    } else if (sortTrigger && sortTrigger.dataset.value) {
        sortValue = sortTrigger.dataset.value;
    }

    // @ts-ignore: sortValue type mismatch potential check
    const sortedTasks = sortTasks(tasks, sortValue as any);

    container.innerHTML = '';
    // レイアウト設定: 画面全体を使う。
    container.className = 'flex flex-col h-full bg-transparent overflow-hidden';

    // メインコンテンツラッパー (全体レイアウト制御)
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'w-full px-4 sm:px-6 h-full flex flex-col pt-2'; // 中央寄せ廃止、左詰め
    container.appendChild(contentWrapper);

    // 1. タスクリスト表示エリア
    const listContainer = document.createElement('div');
    listContainer.id = 'task-list-container';

    // 表示件数設定の適用
    const savedCount = localStorage.getItem('visible_task_count');
    const visibleCount = savedCount ? Number(savedCount) : 10;
    const density = localStorage.getItem(SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY) || 'normal';

    // 密度ごとの概算タスク行高さ (px) + マージン等
    // Compact: py-1.5(6px*2) + text-sm(20px) + gap(8px) approx 40-45
    const HEIGHT_MAP: Record<string, number> = {
        'compact': 42,
        'normal': 52,
        'comfortable': 64,
        'spacious': 76
    };
    const rowHeight = HEIGHT_MAP[density] || 52;
    // ヘッダーやパディング誤差を考慮して少し余裕を持たせる
    // visibleCount * rowHeight

    const maxHeight = visibleCount * rowHeight;
    // 高さ固定（可変にしない）
    listContainer.style.height = `${maxHeight}px`;

    // flex-1 を flex-none にし、overflow-y-auto でスクロールさせる
    listContainer.className = `w-full flex-none overflow-y-auto custom-scrollbar pr-2 mb-2 scroll-smooth border-b border-gray-100 dark:border-gray-800`;
    contentWrapper.appendChild(listContainer);

    renderTaskList(listContainer, sortedTasks, allProjects, selectionState, context);

    // ...

    // 2. 統計エリア (時間帯 or 一般)
    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    // mt-auto で下寄せ（タスク作成ボタンの直上）
    statsContainer.className = 'flex-none mb-0 animate-fade-in transition-all duration-300 mt-auto';
    contentWrapper.appendChild(statsContainer);
    renderTimeBlockStats(statsContainer, tasks, timeBlockId);

    // 3. タスク追加エリア (役割終了のため削除し、レイアウト側の固定フッターに委譲)
    // 以前のコンテナ生成コードは削除
}

/**
 * ヘッダータイトルと件数の更新
 */
function updateHeaderInfo(count: number, title: string): void {
    const headerTitle = document.getElementById('header-title');
    const headerCount = document.getElementById('header-count');

    if (headerTitle) {
        headerTitle.textContent = title || "インボックス";
    }

    if (headerCount) {
        headerCount.textContent = `${count}件`;
    }
}
