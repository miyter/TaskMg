// @ts-nocheck
// フィルター作成・編集モーダル

// ★修正: getAllProjects -> getProjects に変更
import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { addFilter } from '../store/store.js'; // store.jsからインポート
import { showMessageModal } from './components.js';

/**
 * フィルター作成モーダルを表示する
 */
export function showFilterModal() {
    const modalId = 'filter-creation-modal';
    document.getElementById(modalId)?.remove();

    // ★修正: getProjects() を呼び出し
    const projects = getProjects();
    const timeBlocks = getTimeBlocks();
    const durations = [15, 30, 45, 60, 75, 90, 120, 180];

    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';

    modalOverlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            
            <!-- ヘッダー -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    カスタムフィルター作成
                </h3>
                <button id="close-filter-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                
                <!-- フィルター名 -->
                <div>
                    <label class="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">フィルター名</label>
                    <input type="text" id="filter-name" class="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 dark:text-white placeholder-gray-400" placeholder="例: 午前の重要タスク">
                </div>

                <!-- 3カラム選択エリア -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    <!-- 1. プロジェクト選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700 dark:text-gray-200">プロジェクト</span>
                            <span class="text-xs text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-2 overflow-y-auto max-h-60 custom-scrollbar space-y-1" id="project-select-container">
                            ${projects.length === 0 ? '<div class="text-xs text-gray-400 p-2">プロジェクトがありません</div>' : ''}
                            ${projects.map(p => `
                                <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${p.id}" class="filter-project-checkbox form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">${p.name}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 2. 時間帯選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700 dark:text-gray-200">時間帯</span>
                            <span class="text-xs text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-2 overflow-y-auto max-h-60 custom-scrollbar space-y-1">
                            <!-- 未定（ID: null/unassigned） -->
                            <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                <input type="checkbox" value="null" class="filter-timeblock-checkbox form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                <span class="ml-2 w-3 h-3 rounded-full bg-gray-400"></span>
                                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">未定</span>
                            </label>

                            ${timeBlocks.map(tb => `
                                <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${tb.id}" class="filter-timeblock-checkbox form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 w-3 h-3 rounded-full" style="background-color: ${tb.color}"></span>
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">${tb.name}</span>
                                    <span class="ml-1 text-xs text-gray-400">(${tb.start})</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 3. 所要時間選択 -->
                    <div class="flex flex-col h-full bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div class="p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <span class="font-bold text-sm text-gray-700 dark:text-gray-200">所要時間</span>
                            <span class="text-xs text-gray-400">複数選択可</span>
                        </div>
                        <div class="p-2 overflow-y-auto max-h-60 custom-scrollbar space-y-1">
                            ${durations.map(d => `
                                <label class="flex items-center p-2 rounded hover:bg-white dark:hover:bg-gray-800 cursor-pointer transition-colors">
                                    <input type="checkbox" value="${d}" class="filter-duration-checkbox form-checkbox h-4 w-4 text-purple-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700">
                                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">⏱️ ${d} min</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                </div>

                <div class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <p>※ 各カテゴリ内でチェックを入れると「OR（いずれか）」、カテゴリ間は「AND（かつ）」条件になります。</p>
                    <p>※ 何もチェックしないカテゴリは条件に含まれません（指定なし扱い）。</p>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
                <button id="cancel-filter-btn" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition">キャンセル</button>
                <button id="save-filter-btn" class="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
                    フィルターを作成
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // イベント設定
    const close = () => modalOverlay.remove();
    document.getElementById('close-filter-modal').addEventListener('click', close);
    document.getElementById('cancel-filter-btn').addEventListener('click', close);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) close();
    });

    // 保存処理
    document.getElementById('save-filter-btn').addEventListener('click', async () => {
        const name = document.getElementById('filter-name').value.trim();
        if (!name) {
            showMessageModal("フィルター名を入力してください", 'error');
            return;
        }

        // チェックボックスの値を収集
        const getCheckedValues = (className) => {
            return Array.from(document.querySelectorAll(`.${className}:checked`)).map(cb => cb.value);
        };

        const selectedProjects = getCheckedValues('filter-project-checkbox');
        const selectedTimeBlocks = getCheckedValues('filter-timeblock-checkbox');
        const selectedDurations = getCheckedValues('filter-duration-checkbox');

        // クエリ文字列の生成 (例: "project:A,B timeblock:C duration:30")
        const queryParts = [];
        if (selectedProjects.length > 0) {
            queryParts.push(`project:${selectedProjects.join(',')}`);
        }
        if (selectedTimeBlocks.length > 0) {
            queryParts.push(`timeblock:${selectedTimeBlocks.join(',')}`);
        }
        if (selectedDurations.length > 0) {
            queryParts.push(`duration:${selectedDurations.join(',')}`);
        }

        if (queryParts.length === 0) {
            showMessageModal("少なくとも1つの条件を選択してください", 'error');
            return;
        }

        const query = queryParts.join(' ');

        // フィルター保存 (IDはランダム生成)
        const newFilter = {
            id: 'filter-' + Date.now(),
            name: name,
            query: query,
            type: 'custom'
        };

        try {
            if (typeof addFilter === 'function') {
                await addFilter(newFilter);
            } else {
                console.warn('addFilter function not found in store. Saving to localStorage manually.');
                const filters = JSON.parse(localStorage.getItem('custom_filters') || '[]');
                filters.push(newFilter);
                localStorage.setItem('custom_filters', JSON.stringify(filters));
                document.dispatchEvent(new CustomEvent('filters-updated'));
            }

            showMessageModal("フィルターを作成しました");
            close();
        } catch (e) {
            console.error(e);
            showMessageModal("保存に失敗しました", 'error');
        }
    });
}