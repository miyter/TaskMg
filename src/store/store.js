// @miyter:20251129

// ★修正: このファイルは新しいラッパー層の関数をエクスポートする役割を担います
export * from './index.js';
export * from './filters.js'; // ★追加: フィルター機能を公開

/**
 * フィルター更新関数 (updateFilter)
 * NOTE: filters.js等でexportされていないため、ここで実装して補完する
 * これにより filter-modal.js からの import エラーを解消し、編集機能を動作させる
 */
export const updateFilter = async (id, filterData) => {
    // LocalStorageから読み込み
    const filters = JSON.parse(localStorage.getItem('custom_filters') || '[]');
    const idx = filters.findIndex(f => f.id === id);

    if (idx !== -1) {
        // 更新して保存
        filters[idx] = filterData;
        localStorage.setItem('custom_filters', JSON.stringify(filters));
    } else {
        console.warn(`Filter update failed: ID ${id} not found.`);
    }
};