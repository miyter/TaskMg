// @ts-nocheck
/**
 * 時間帯フィルタ時の工数サマリーコンポーネント
 * 改修: 時間帯外（一般ビュー）での集計表示に対応
 */
import { getTimeBlockById } from '../../store/timeblocks.js';
import { UI_STYLES } from '../core/ui-style-constants.js';

export function renderTimeBlockStats(container, tasks, timeBlockId) {
    // 既存のコンテナ内をクリア
    container.innerHTML = '';

    // 時間帯情報の取得（あれば）
    const timeBlock = timeBlockId ? getTimeBlockById(timeBlockId) : null;

    // タスク合計計算 (分)
    const totalTaskMinutes = tasks.reduce((sum, task) => {
        const duration = parseInt(task.duration, 10);
        return sum + (isNaN(duration) ? 0 : duration);
    }, 0);

    // 時間表示フォーマット (例: 1時間45分)
    const formatTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}時間${m}分` : `${m}分`;
    };

    let html = '';

    // A. 時間帯モード (従来通り)
    if (timeBlock && timeBlock.start && timeBlock.end) {
        const capacityMinutes = calculateMinutes(timeBlock.start, timeBlock.end);

        // 容量0なら表示しない（安全策）
        if (capacityMinutes <= 0) return;

        const capacityHours = (capacityMinutes / 60).toFixed(2);
        const totalTaskHours = (totalTaskMinutes / 60).toFixed(2);
        const progressPercent = Math.min((totalTaskMinutes / capacityMinutes) * 100, 100);
        const rawPercent = (totalTaskMinutes / capacityMinutes) * 100;

        const diffMinutes = capacityMinutes - totalTaskMinutes;
        const isOver = diffMinutes < 0;
        const absDiffMinutes = Math.abs(diffMinutes);
        const absDiffHours = (absDiffMinutes / 60).toFixed(2);

        const isExceeded = rawPercent > 100;
        const barClass = isExceeded ? UI_STYLES.PROGRESS_BAR.OVER : UI_STYLES.PROGRESS_BAR.FILLED;
        const barWidth = isExceeded ? '100%' : `${progressPercent}%`;

        const diffColorClass = isOver ? 'text-red-500' : 'text-green-500';
        const diffLabel = isOver ? '超過' : '残り';

        // プログレスバー付きUI (1行レイアウト改善版)
        html = `
            <div class="mt-2 mb-2 py-2 px-4 bg-gray-50/80 dark:bg-[#1e1e1e]/50 rounded-lg flex items-center gap-4 text-sm border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                <!-- 1. 時間帯名 (左端) -->
                <div class="flex-shrink-0 w-24 truncate text-xs font-bold text-gray-500 dark:text-gray-400" title="${timeBlock.name}">
                    ${timeBlock.name}
                </div>

                <!-- 2. 進捗時間 (中央左) -->
                <div class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums">
                    <span class="font-bold text-gray-700 dark:text-gray-300 w-[4.5ch] text-right inline-block">${totalTaskHours}h</span>
                    <span class="text-gray-400 mx-0.5">/</span>
                    <span class="w-[4.5ch] inline-block">${capacityHours}h</span>
                </div>

                <!-- 3. プログレスバー (可変幅) -->
                <div class="${UI_STYLES.PROGRESS_BAR.CONTAINER}">
                     <div class="${barClass}" style="width: ${barWidth}"></div>
                </div>

                <!-- 4. 詳細情報 (右端) -->
                <div class="flex-shrink-0 flex items-center justify-end gap-3 min-w-[140px]">
                    <div class="text-lg font-bold ${isExceeded ? 'text-red-500' : 'text-blue-500'} tabular-nums text-right w-[3.5ch]">
                        ${Math.round(rawPercent)}<span class="text-xs font-normal opacity-70">%</span>
                    </div>
                    <div class="text-xs ${diffColorClass} whitespace-nowrap text-right w-[100px]">
                        (${diffLabel} ${absDiffHours}h)
                    </div>
                </div>
            </div>
        `;
    } else {
        // B. 一般集計モード (タスク数・合計時間・平均)
        // タスク0件なら表示しない、または"0件"と出すか？ -> 情報不足解消のため出す方が親切

        const count = tasks.length;
        const avgMinutes = count > 0 ? Math.round(totalTaskMinutes / count) : 0;
        const totalTimeText = formatTime(totalTaskMinutes);

        html = `
            <div class="${UI_STYLES.STATS_BAR.CONTAINER}">
                <div class="${UI_STYLES.STATS_BAR.ITEM}">
                    <span class="${UI_STYLES.STATS_BAR.LABEL}">Count</span>
                    <span class="${UI_STYLES.STATS_BAR.VALUE}">${count}<span class="text-xs font-normal ml-0.5 text-gray-400">件</span></span>
                </div>
                <div class="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div class="${UI_STYLES.STATS_BAR.ITEM}">
                    <span class="${UI_STYLES.STATS_BAR.LABEL}">Total</span>
                    <span class="${UI_STYLES.STATS_BAR.VALUE} ${UI_STYLES.STATS_BAR.HIGHLIGHT}">${totalTimeText}</span>
                </div>
                <div class="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                <div class="${UI_STYLES.STATS_BAR.ITEM}">
                    <span class="${UI_STYLES.STATS_BAR.LABEL}">Avg</span>
                    <span class="font-medium text-sm">${avgMinutes}<span class="text-xs ml-0.5">min/件</span></span>
                </div>
            </div>
        `;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    container.appendChild(wrapper);
}

/**
 * "HH:MM" 形式の開始・終了時間から分数を計算
 */
function calculateMinutes(start, end) {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    if (endMinutes < startMinutes) {
        endMinutes += 24 * 60; // 日跨ぎ対応
    }

    return endMinutes - startMinutes;
}
