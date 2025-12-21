// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: クエリ解析のバグ修正、未定IDの安全化、モーダル挙動の改善（Grok指摘対応）
 */

import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { addFilter, updateFilter } from '../store/store.js'; 
import { showMessageModal } from './components.js';

/**
 * フィルター作成・編集モーダルを表示
 */
export function showFilterModal(filterToEdit = null) {
    const isEditMode = !!filterToEdit;
    
    // データ取得（同期キャッシュ）
    // ※データが未ロードの場合は空配列になる可能性があるが、現状の仕様とする
    const projects = getProjects();
    const timeBlocks = getTimeBlocks();
    const durations = [30, 45, 60, 75, 90];

    // クエリ解析（安全なパース）
    const state = parseFilterQuery(filterToEdit?.query || '');

    const modal = document.createElement('div');
    modal.id = 'filter-creation-modal';
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in';

    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all" role="dialog" aria-modal="true">
            <!-- ヘッダー -->
            <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    ${isEditMode ? 'フィルター編集' : 'フィルター作成'}
                </h3>
                <button id="close-filter-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-4 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                <div>
                    <label class="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">フィルター名</label>
                    <input type="text" id="filter-name" value="${filterToEdit?.name || ''}" class="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all" placeholder="例: 午前の重要タスク">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- プロジェクト -->
                    ${createSelectionBox('プロジェクト', projects, state.project, 'filter-project-checkbox')}
                    <!-- 時間帯 -->
                    ${createTimeBlockSelectionBox(timeBlocks, state.timeblock)}
                    <!-- 所要時間 -->
                    ${createSelectionBox('所要時間', durations, state.duration, 'filter-duration-checkbox', d => `⏱️ ${d} min`)}
                </div>

                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-600 dark:text-blue-300">
                    <p class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        条件設定のヒント: 各カテゴリ内は「OR（いずれか）」、カテゴリ間は「AND（かつ）」条件になります。
                    </p>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700">
                <button id="cancel-filter-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">キャンセル</button>
                <button id="save-filter-btn" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-all transform active:scale-95">
                    ${isEditMode ? '変更を保存' : 'フィルターを作成'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupEvents(modal, filterToEdit);
    
    // 初期フォーカス
    requestAnimationFrame(() => {
        const nameInput = modal.querySelector('#filter-name');
        if (nameInput) nameInput.focus();
    });
}

// --- Helpers ---

/**
 * クエリ文字列を解析してオブジェクトに変換
 * 安全にパースし、不正な値を排除する
 */
function parseFilterQuery(query) {
    const result = { project: [], timeblock: [], duration: [] };
    if (!query) return result;
    
    query.split(' ').forEach(part => {
        if (!part.includes(':')) return;
        
        const [key, valueStr] = part.split(':');
        
        // 未定義のキーや空の値はスキップ
        if (!result[key] || !valueStr) return;
        
        // 配列に変換（上書きでOK）
        // 'null' 文字列対策: UI上では 'none' として扱うため変換
        result[key] = valueStr.split(',').map(v => 
            (key === 'timeblock' && v === 'null') ? 'none' : v
        );
    });
    return result;
}

function createSelectionBox(title, items, initialValues, className, labelFn = (i) => i.name || i) {
    // initialValues が undefined の場合のガード
    const safeInitials = Array.isArray(initialValues) ? initialValues : [];

    return `
        <div class="flex flex-col h-64 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center font-bold text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <span>${title}</span>
                <span class="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">${items.length}</span>
            </div>
            <div class="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-1">
                ${items.map(item => {
                    const id = String(item.id || item);
                    const isChecked = safeInitials.includes(id);
                    return `
                        <label class="flex items-center px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group">
                            <input type="checkbox" value="${id}" ${isChecked ? 'checked' : ''} class="${className} form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600">
                            <span class="ml-2.5 text-sm text-gray-700 dark:text-gray-300 truncate group-hover:text-gray-900 dark:group-hover:text-white transition-colors">${labelFn(item)}</span>
                        </label>
                    `;
                }).join('')}
                ${items.length === 0 ? '<div class="text-center text-xs text-gray-400 py-4">項目がありません</div>' : ''}
            </div>
        </div>
    `;
}

function createTimeBlockSelectionBox(blocks, initialValues) {
    // 'null' を 'none' に置換してUI表示
    const items = [{ id: 'none', name: '未定', color: '#9CA3AF' }, ...blocks];
    return createSelectionBox('時間帯', items, initialValues, 'filter-timeblock-checkbox', b => `
        <span class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ring-1 ring-white/10" style="background-color: ${b.color}"></span>
            ${b.id === 'none' ? b.name : `${b.start} - ${b.end}`}
        </span>
    `);
}

function setupEvents(modal, filterToEdit) {
    // クリーンアップ付きの閉じる処理
    const close = () => {
        document.removeEventListener('keydown', escHandler);
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    };

    const escHandler = (e) => {
        if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', escHandler);

    modal.querySelector('#close-filter-modal').onclick = close;
    modal.querySelector('#cancel-filter-btn').onclick = close;
    
    // 背景クリック判定（inner div をクリックしたときは閉じない）
    modal.onclick = (e) => { 
        if (e.target === modal) close(); 
    };

    modal.querySelector('#save-filter-btn').onclick = async () => {
        const nameInput = modal.querySelector('#filter-name');
        const name = nameInput.value.trim();
        
        if (!name) {
            // オブジェクト形式でエラー表示
            showMessageModal({ message: "フィルター名を入力してください", type: "error" });
            nameInput.focus();
            return;
        }

        const getVals = (cls) => Array.from(modal.querySelectorAll(`.${cls}:checked`)).map(cb => cb.value);
        
        // 保存時に 'none' を 'null' に戻す
        const timeblocks = getVals('filter-timeblock-checkbox').map(v => v === 'none' ? 'null' : v);

        const queryMap = {
            project: getVals('filter-project-checkbox'),
            timeblock: timeblocks,
            duration: getVals('filter-duration-checkbox')
        };

        const queryStr = Object.entries(queryMap)
            .filter(([_, vals]) => vals.length > 0)
            .map(([key, vals]) => `${key}:${vals.join(',')}`)
            .join(' ');

        if (!queryStr) {
            return showMessageModal({ message: "少なくとも1つの条件を選択してください", type: "error" });
        }

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
            // サイドバー等の更新を促す
            document.dispatchEvent(new CustomEvent('filters-updated'));
            close();
        } catch (e) {
            console.error(e);
            showMessageModal({ message: "保存に失敗しました: " + e.message, type: "error" });
        }
    };
}