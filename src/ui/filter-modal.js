// @ts-nocheck
// @miyter:20251221
// フィルター作成・編集モーダル

import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { addFilter, updateFilter } from '../store/store.js'; 
import { showMessageModal } from './components.js';

/**
 * フィルター作成・編集モーダルを表示
 */
export function showFilterModal(filterToEdit = null) {
    const isEditMode = !!filterToEdit;
    const projects = getProjects();
    const timeBlocks = getTimeBlocks();
    const durations = [30, 45, 60, 75, 90];

    // 初期状態の解析
    const state = parseFilterQuery(filterToEdit?.query || '');

    const modal = document.createElement('div');
    modal.id = 'filter-creation-modal';
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in';

    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <!-- ヘッダー -->
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50">
                <h3 class="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    ${isEditMode ? 'フィルター編集' : 'フィルター作成'}
                </h3>
                <button id="close-filter-modal" class="p-1 rounded-full hover:bg-gray-200 text-gray-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>

            <!-- ボディ -->
            <div class="p-4 overflow-y-auto flex-1 space-y-4">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">フィルター名</label>
                    <input type="text" id="filter-name" value="${filterToEdit?.name || ''}" class="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md outline-none text-sm" placeholder="例: 午前の重要タスク">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- プロジェクト -->
                    ${createSelectionBox('プロジェクト', projects, state.project, 'filter-project-checkbox')}
                    <!-- 時間帯 -->
                    ${createTimeBlockSelectionBox(timeBlocks, state.timeblock)}
                    <!-- 所要時間 -->
                    ${createSelectionBox('所要時間', durations, state.duration, 'filter-duration-checkbox', d => `⏱️ ${d} min`)}
                </div>

                <div class="text-[10px] text-gray-500 space-y-0.5">
                    <p>※ 各カテゴリ内は「OR」、カテゴリ間は「AND」条件になります。</p>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-2 border-t border-gray-100 dark:border-gray-700">
                <button id="cancel-filter-btn" class="px-3 py-1.5 text-xs text-gray-600">キャンセル</button>
                <button id="save-filter-btn" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-transform active:scale-95">
                    ${isEditMode ? '変更を保存' : 'フィルターを作成'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupEvents(modal, filterToEdit);
}

// --- Helpers ---

function parseFilterQuery(query) {
    const result = { project: [], timeblock: [], duration: [] };
    if (!query) return result;
    
    query.split(' ').forEach(part => {
        const [key, values] = part.split(':');
        if (result[key]) result[key] = values.split(',');
    });
    return result;
}

function createSelectionBox(title, items, initialValues, className, labelFn = (i) => i.name || i) {
    return `
        <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div class="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center font-bold text-xs">
                <span>${title}</span>
            </div>
            <div class="p-1.5 overflow-y-auto max-h-56 space-y-0.5">
                ${items.map(item => {
                    const id = String(item.id || item);
                    return `
                        <label class="flex items-center px-2 py-1.5 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                            <input type="checkbox" value="${id}" ${initialValues.includes(id) ? 'checked' : ''} class="${className} form-checkbox h-3.5 w-3.5 text-blue-600 rounded">
                            <span class="ml-2 text-xs text-gray-700 dark:text-gray-300 truncate">${labelFn(item)}</span>
                        </label>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function createTimeBlockSelectionBox(blocks, initialValues) {
    const items = [{ id: 'null', name: '未定', color: '#a0aec0' }, ...blocks];
    return createSelectionBox('時間帯', items, initialValues, 'filter-timeblock-checkbox', b => `
        <span class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${b.color}"></span>
            ${b.id === 'null' ? b.name : `${b.start} - ${b.end}`}
        </span>
    `);
}

function setupEvents(modal, filterToEdit) {
    const close = () => modal.remove();
    modal.querySelector('#close-filter-modal').onclick = close;
    modal.querySelector('#cancel-filter-btn').onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };

    modal.querySelector('#save-filter-btn').onclick = async () => {
        const name = modal.querySelector('#filter-name').value.trim();
        if (!name) return showMessageModal("名前を入力してください", 'error');

        const getVals = (cls) => Array.from(modal.querySelectorAll(`.${cls}:checked`)).map(cb => cb.value);
        const queryMap = {
            project: getVals('filter-project-checkbox'),
            timeblock: getVals('filter-timeblock-checkbox'),
            duration: getVals('filter-duration-checkbox')
        };

        const queryStr = Object.entries(queryMap)
            .filter(([_, vals]) => vals.length > 0)
            .map(([key, vals]) => `${key}:${vals.join(',')}`)
            .join(' ');

        if (!queryStr) return showMessageModal("条件を選択してください", 'error');

        const filterData = {
            name,
            query: queryStr,
            type: 'custom'
        };

        try {
            if (filterToEdit) {
                await updateFilter(filterToEdit.id, filterData);
            } else {
                await addFilter(filterData);
            }
            document.dispatchEvent(new CustomEvent('filters-updated'));
            close();
        } catch (e) {
            showMessageModal("保存に失敗しました", 'error');
        }
    };
}