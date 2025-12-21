/**
 * 時間計算、重複チェック、ボタン状態管理のユーティリティ
 */
import { getTimeBlocks } from '../store/timeblocks.js';

export const MAX_BLOCKS = 5;

export const ICONS = {
    ADD: `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        <span>新しい時間帯を追加 (最大${MAX_BLOCKS}個)</span>
    `,
    LIMIT: `<span class="text-gray-400">これ以上追加できません (最大${MAX_BLOCKS}個)</span>`
};

/**
 * 時間を分に変換
 */
export function timeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

/**
 * 他のブロックとの重複チェック
 */
export function checkOverlap(currentId, startMin, endMin) {
    const blocks = getTimeBlocks();
    const others = blocks.filter(b => b.id !== currentId);

    for (const b of others) {
        const bStart = timeToMinutes(b.start);
        const bEnd = timeToMinutes(b.end);
        if (Math.max(startMin, bStart) < Math.min(endMin, bEnd)) {
            return true;
        }
    }
    return false;
}

/**
 * 追加ボタンの状態を更新
 */
export function updateAddButtonUI(btn, count) {
    if (!btn) return;
    const disabled = count >= MAX_BLOCKS;
    btn.disabled = disabled;
    btn.innerHTML = disabled ? ICONS.LIMIT : ICONS.ADD;
}