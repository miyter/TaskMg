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

    // HTML構築
    const html = `
        <div class="mt-6 mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
            <div class="flex justify-between items-end mb-3">
                <div>
                    <h3 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        ${timeBlock.name} の工数状況
                    </h3>
                    <div class="flex items-baseline gap-2">
                        <span class="text-2xl font-bold text-gray-900 dark:text-white font-mono">
                            ${totalTaskHours}
                        </span>
                        <span class="text-sm text-gray-400 font-medium">
                            / ${capacityHours} 時間
                        </span>
                    </div>
                </div>
                <div class="text-right">
                    <div class="text-3xl font-bold ${isExceeded ? 'text-red-500' : 'text-blue-600'} mb-1">
                        ${Math.round(rawPercent)}<span class="text-lg">%</span>
                    </div>
                    <div class="text-xs font-medium ${diffColorClass}">
                        ${diffLabel} ${formatTime(absDiffMinutes)} (${absDiffHours}h)
                    </div>
                </div>
            </div>

            <div class="relative h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="${barColorClass} h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                     style="width: ${barWidth}">
                </div>
            </div>
            
            <div class="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                <span>合計: ${formatTime(totalTaskMinutes)}</span>
                <span>容量: ${formatTime(capacityMinutes)}</span>
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
