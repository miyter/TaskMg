// @ts-nocheck
/**
 * 時間帯フィルタ時の工数サマリーコンポーネント
 * 改修: 時間帯外（一般ビュー）での集計表示に対応
 */
import { getTimeBlockById } from '../../store/timeblocks.js';

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
        const barColorClass = isExceeded ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500';
        const barWidth = isExceeded ? '100%' : `${progressPercent}%`;

        const diffColorClass = isOver ? 'text-red-500' : 'text-green-500';
        const diffLabel = isOver ? '超過' : '残り';

        // プログレスバー付きUI
        html = `
            <div class="mt-2 mb-2 py-2 px-4 bg-gray-50/80 dark:bg-[#1e1e1e]/50 rounded-lg flex items-center justify-between gap-4 text-sm border border-gray-100 dark:border-gray-800/50 backdrop-blur-sm">
                <div class="flex-shrink-0 text-xs text-gray-400 font-mono w-16 truncate" title="${timeBlock.name}">
                    ${timeBlock.name}
                </div>

                <div class="flex-1 flex flex-col justify-center gap-1 mx-2">
                    <div class="text-xs text-center text-gray-500 dark:text-gray-400 flex justify-between px-1">
                        <span>${totalTaskHours}h</span>
                        <span class="text-[10px] text-gray-400">/ ${capacityHours}h</span>
                    </div>
                    <div class="relative h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden w-full">
                         <div class="${barColorClass} h-full rounded-full transition-all duration-500 ease-out"
                             style="width: ${barWidth}">
                        </div>
                    </div>
                </div>

                <div class="flex-shrink-0 text-right min-w-[80px]">
                    <div class="text-lg font-bold ${isExceeded ? 'text-red-500' : 'text-blue-500'} leading-none">
                        ${Math.round(rawPercent)}<span class="text-xs font-normal opacity-70">%</span>
                    </div>
                    <div class="text-[10px] font-medium ${diffColorClass} mt-0.5">
                        ${diffLabel} ${absDiffHours}h
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
            <div class="mt-2 mb-2 py-2 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-around text-sm text-gray-600 dark:text-gray-300">
                <div class="flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 uppercase tracking-wider">Count</span>
                    <span class="font-bold text-base">${count}<span class="text-xs font-normal ml-0.5 text-gray-400">件</span></span>
                </div>
                <div class="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                <div class="flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
                    <span class="font-bold text-base text-blue-600 dark:text-blue-400">${totalTimeText}</span>
                </div>
                <div class="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                <div class="flex flex-col items-center">
                    <span class="text-[10px] text-gray-400 uppercase tracking-wider">Avg</span>
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
