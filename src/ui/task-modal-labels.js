// タスクモーダル内のラベル（タグ）UI制御

import { getLabelDetails } from './sidebar.js'; // ★修正: sidebar.js からエクスポートされた関数をインポート

/**
 * モーダル内のラベルバッジを描画する
 * @param {HTMLElement} container - 描画対象のコンテナ要素
 * @param {Array} labelIds - 表示するラベルIDの配列
 * @param {Function} onRemove - 削除ボタン押下時のコールバック (labelId, labelName) => void
 */
export function renderModalLabels(container, labelIds, onRemove) {
    if (!container) return;
    container.innerHTML = '';
    
    if (!labelIds || labelIds.length === 0) return;

    labelIds.forEach(lid => {
        const label = getLabelDetails(lid);
        if (!label) return;

        const badge = document.createElement('span');
        badge.className = "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200";
        
        badge.innerHTML = `
            <span class="w-2 h-2 rounded-full" style="background-color: ${label.color}"></span>
            ${label.name}
            <button class="text-gray-400 hover:text-red-500 ml-1 remove-tag-btn transition-colors rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // 削除ボタンイベント
        badge.querySelector('.remove-tag-btn').onclick = (e) => {
            e.stopPropagation();
            onRemove(lid, label.name);
        };
        
        container.appendChild(badge);
    });
}

/**
 * ラベル追加用プルダウンの選択肢を生成する
 * @param {HTMLSelectElement} selectElement - select要素
 */
export function setupLabelSelectOptions(selectElement) {
    if (!selectElement) return;

    const labelList = document.getElementById('label-list');
    // sidebar.jsが描画したDOMからラベル情報を取得
    const allLabels = Array.from(labelList ? labelList.querySelectorAll('li') : []).map(li => ({
        id: li.dataset.id,
        // ★修正: textContentを取得後、trim()を追加し余分な空白文字を削除
        name: li.textContent ? li.textContent.trim() : ''
    }));
    
    selectElement.innerHTML = '<option value="">＋ タグを追加...</option>';
    allLabels.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l.id;
        opt.textContent = l.name;
        selectElement.appendChild(opt);
    });
    selectElement.value = '';
}