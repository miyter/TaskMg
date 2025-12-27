/**
 * タスクモーダル内のラベル（タグ）UI制御
 */
import { getLabelDetails } from '../sidebar-utils.js';
import { getData } from '../core/DataSyncManager.js';

const STYLE_CONFIG = {
    BADGE_MAX_WIDTH: 'max-w-[100px]'
};

/**
 * モーダル内のラベルバッジを描画する
 */
export function renderModalLabels(container, labelIds, onRemove) {
    if (!container) return;
    container.innerHTML = '';
    
    if (!labelIds || labelIds.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-400 italic">ラベルなし</span>';
        return;
    }

    const fragment = document.createDocumentFragment();

    labelIds.forEach(lid => {
        const label = getLabelDetails(lid);
        if (!label) return;

        const badge = document.createElement('span');
        badge.className = "text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 group";
        
        badge.innerHTML = `
            <span class="w-2 h-2 rounded-full" style="background-color: ${label.color}"></span>
            <span class="truncate ${STYLE_CONFIG.BADGE_MAX_WIDTH}">${label.name}</span>
            <button class="text-gray-400 hover:text-red-500 transition-colors rounded-full p-0.5" title="削除">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;
        
        badge.querySelector('button').onclick = (e) => {
            e.stopPropagation();
            onRemove(lid); // 名前は不要なのでIDのみ渡す
        };
        
        fragment.appendChild(badge);
    });

    container.appendChild(fragment);
}

/**
 * ラベル追加用プルダウンの選択肢を生成する
 */
export function setupLabelSelectOptions(selectElement) {
    if (!selectElement) return;

    const allLabels = getData.labels() || [];
    
    selectElement.innerHTML = '<option value="">＋ ラベルを追加...</option>';
    
    allLabels.forEach(label => {
        const opt = document.createElement('option');
        opt.value = label.id;
        opt.textContent = label.name; 
        selectElement.appendChild(opt);
    });
    
    selectElement.value = '';
}