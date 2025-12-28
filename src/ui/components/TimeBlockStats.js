/**
 * 時間帯フィルタ時の工数サマリーコンポーネント
 */
import { getTimeBlockById } from '../../store/timeblocks.js';

export function renderTimeBlockStats(container, tasks, timeBlockId) {
    const timeBlock = getTimeBlockById(timeBlockId);
    if (!timeBlock || !timeBlock.start || !timeBlock.end) return;

    // 1. 容量計算 (分)
    const capacityMinutes = calculateMinutes(timeBlock.start, timeBlock.end);
    if (capacityMinutes <= 0) return;

    // 2. タスク合計計算 (分)
    const totalTaskMinutes = tasks.reduce((sum, task) => {
        // 完了済みタスクを含めるかどうかは要件次第だが、進捗確認なら含めるべきか？
        // ユーザー指示「表示中のタスクの所要時間合計」。
        // 表示中のタスクは ui-view-manager でフィルタリング済みのもの。つまり完了タスクを表示していれば含まれる。
        const duration = parseInt(task.duration, 10);
        return sum + (isNaN(duration) ? 0 : duration);
    }, 0);

    // 3. 計算
    const capacityHours = (capacityMinutes / 60).toFixed(2);
    const totalTaskHours = (totalTaskMinutes / 60).toFixed(2);
    const progressPercent = Math.min((totalTaskMinutes / capacityMinutes) * 100, 100); // UI上のバーは100で止める
    const rawPercent = (totalTaskMinutes / capacityMinutes) * 100;

    // 過不足
    const diffMinutes = capacityMinutes - totalTaskMinutes;
    const isOver = diffMinutes < 0;
    const absDiffMinutes = Math.abs(diffMinutes);
    const absDiffHours = (absDiffMinutes / 60).toFixed(2);

    // 時間表示フォーマット (例: 1時間45分)
    const formatTime = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return h > 0 ? `${h}時間${m}分` : `${m}分`;
    };

    // バーの色: 100%超えで赤くする指示あり
    // "100%超えたら赤み帯びる" -> バー自体を赤くするか、背景色を変えるか。
    // TickTick参考: 青ベース、超過で赤。
    const isExceeded = rawPercent > 100;
    const barColorClass = isExceeded ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500';
    const barWidth = isExceeded ? '100%' : `${progressPercent}%`;

    // テキストカラー
    const diffColorClass = isOver ? 'text-red-500' : 'text-green-500';
    const diffLabel = isOver ? '超過' : '残り';

    // HTML構築 (コンパクト・ミニマル版)
    // 背景薄く、上下パディング最小限(py-2 px-4程度)、横並び

    // 背景色: darkモードで #1e1e1e (gray-900に近いが透明度調整)
    // 影なし、フラット

    const html = `
        <div class="mt-4 mb-4 py-2 px-4 bg-gray-50/50 dark:bg-[#1e1e1e]/30 rounded-lg flex items-center justify-between gap-4 text-sm animate-fade-in border border-gray-100 dark:border-gray-800/50">
            
            <!-- Left: 時間帯名 -->
            <div class="flex-shrink-0 text-xs text-gray-400 font-mono">
                ${timeBlock.name}
            </div>

            <!-- Center: 数字とプログレスバー -->
            <div class="flex-1 flex flex-col justify-center gap-1 mx-2">
                <div class="text-xs text-center text-gray-500 dark:text-gray-400">
                    <span class="font-bold text-gray-700 dark:text-gray-300">${totalTaskHours}</span> <span class="text-[10px] text-gray-400">/</span> ${capacityHours} <span class="text-[10px]">h</span>
                </div>
                <div class="relative h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden w-full">
                     <div class="${barColorClass} h-full rounded-full transition-all duration-500 ease-out"
                         style="width: ${barWidth}">
                    </div>
                </div>
            </div>

            <!-- Right: %と過不足 -->
            <div class="flex-shrink-0 text-right min-w-[80px]">
                <div class="text-xl font-bold ${isExceeded ? 'text-red-500' : 'text-blue-500'} leading-none">
                    ${Math.round(rawPercent)}<span class="text-xs font-normal opacity-70">%</span>
                </div>
                <div class="text-[10px] font-medium ${diffColorClass} mt-0.5">
                    ${diffLabel} ${absDiffHours}h
                </div>
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    container.appendChild(wrapper);
}

/**
 * "HH:MM" 形式の開始・終了時間から分数を計算
 * 終了が開始より小さい場合は日を跨いだとみなして+24時間
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
