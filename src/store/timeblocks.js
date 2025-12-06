// @ts-nocheck
// 時間帯ブロックデータ管理

// 初期モックデータ
let timeBlocks = [
    { id: 'tb_morning', name: '朝集中', start: '06:00', end: '09:00', color: '#EF4444', order: 0 },
    { id: 'tb_afternoon', name: '午後作業', start: '13:00', end: '17:00', color: '#3B82F6', order: 1 },
    { id: 'tb_night', name: '夜ルーティン', start: '20:00', end: '22:00', color: '#8B5CF6', order: 2 }
];

/**
 * 全ての時間帯ブロックを取得 (順序付き)
 */
export function getTimeBlocks() {
    return [...timeBlocks].sort((a, b) => a.order - b.order);
}

/**
 * 時間帯ブロックを保存 (追加/更新)
 */
export async function saveTimeBlock(block) {
    const existingIndex = timeBlocks.findIndex(b => b.id === block.id);
    if (existingIndex >= 0) {
        timeBlocks[existingIndex] = { ...timeBlocks[existingIndex], ...block };
    } else {
        // 新規追加 (最大5個チェックはUI側で行う想定だが念のため)
        if (timeBlocks.length >= 5) throw new Error("最大5個までです");
        
        const newBlock = {
            ...block,
            id: block.id || crypto.randomUUID(),
            order: timeBlocks.length
        };
        timeBlocks.push(newBlock);
    }
    // ここでDB保存処理などを呼ぶ
    return true;
}

/**
 * 時間帯ブロックを削除
 */
export async function deleteTimeBlock(id) {
    timeBlocks = timeBlocks.filter(b => b.id !== id);
    // 順序再計算
    timeBlocks.forEach((b, idx) => b.order = idx);
    return true;
}

/**
 * 時間帯ブロックの順序を更新
 * @param {string[]} orderedIds - IDの配列
 */
export async function updateTimeBlockOrder(orderedIds) {
    const newBlocks = [];
    orderedIds.forEach((id, index) => {
        const block = timeBlocks.find(b => b.id === id);
        if (block) {
            block.order = index;
            newBlocks.push(block);
        }
    });
    // 存在しないIDがあった場合の考慮（今回は簡易実装）
    timeBlocks = newBlocks.concat(timeBlocks.filter(b => !orderedIds.includes(b.id)));
}

/**
 * IDからブロック詳細を取得
 */
export function getTimeBlockById(id) {
    return timeBlocks.find(b => b.id === id);
}