import { getProjects } from '../../store/projects.js';
import { getTimeBlocks } from '../../store/timeblocks.js';
import { addFilter, updateFilter } from '../../store/store.js';
import { showMessageModal } from '../components.js';
import { MODAL_CLASSES } from '../core/ui-modal-constants.js';
import { UI_STYLES } from '../core/ui-style-constants.js';

const UNASSIGNED_ID = 'none';
const MESSAGES = {
    NAME_REQUIRED: 'フィルター名を入力してくれ',
    CONDITION_REQUIRED: '少なくとも1つの条件を選択してくれ',
    SAVE_ERROR: '保存に失敗したぞ: '
};

/**
 * フィルター作成・編集モーダルを表示
 */
export function showFilterModal(filterToEdit = null) {
    const isEditMode = !!filterToEdit;
    const projects = getProjects();
    const timeBlocks = getTimeBlocks();
    const durations = [30, 45, 60, 75, 90];
    const dateOptions = [
        { id: 'today', name: '今日' },
        { id: 'tomorrow', name: '明日' },
        { id: 'week', name: '今週' },
        { id: 'next-week', name: '来週' }
    ];

    const state = parseFilterQuery(filterToEdit?.query || '');
    const modal = document.createElement('div');
    modal.id = 'filter-creation-modal';
    modal.className = UI_STYLES.MODAL.CONTAINER;

    modal.innerHTML = `
        <div class="${UI_STYLES.MODAL.DIALOG} ${UI_STYLES.MODAL.WIDTH.DEFAULT}" role="dialog" aria-modal="true">
            <div class="${MODAL_CLASSES.HEADER}">
                <h3 class="${MODAL_CLASSES.TITLE}">${isEditMode ? 'フィルター編集' : 'フィルター作成'}</h3>
                <button id="close-filter-modal" class="${MODAL_CLASSES.CLOSE_BUTTON}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div class="${MODAL_CLASSES.BODY}">
                <div class="space-y-6">
                    <div>
                        <label for="filter-name" class="${UI_STYLES.TEXT.LABEL}">フィルター名</label>
                        <input type="text" id="filter-name" value="${filterToEdit?.name || ''}" 
                               class="${UI_STYLES.INPUT.DEFAULT}" placeholder="例: 今週の重要タスク">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        ${createSelectionBox('プロジェクト', projects, state.project, 'filter-project-checkbox')}
                        ${createTimeBlockBox(timeBlocks, state.timeblock)}
                        ${createSelectionBox('所要時間', durations, state.duration, 'filter-duration-checkbox', d => `${d} min`)}
                        ${createSelectionBox('日付', dateOptions, state.date, 'filter-date-checkbox')}
                    </div>
                </div>
            </div>
            <div class="${MODAL_CLASSES.FOOTER}">
                <button id="cancel-filter-btn" class="${UI_STYLES.BUTTON.SECONDARY} mr-auto">キャンセル</button>
                <button id="save-filter-btn" class="${UI_STYLES.BUTTON.PRIMARY}">
                    ${isEditMode ? '変更を保存' : '作成'}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupEvents(modal, filterToEdit);
}

/**
 * クエリ文字列をモーダルの状態に変換
 */
function parseFilterQuery(query) {
    const result = { project: [], timeblock: [], duration: [], date: [] };
    if (!query) return result;

    query.split(/\s+/).forEach(part => {
        if (!part.includes(':')) return;
        const [key, val] = part.split(':');
        if (result[key]) {
            const values = val.split(',').map(v => {
                if (key === 'timeblock' && (v === 'null' || v === 'none')) return UNASSIGNED_ID;
                return v;
            });
            result[key] = [...result[key], ...values];
        }
    });
    return result;
}

function createSelectionBox(title, items, initials, className, labelFn = (i) => i.name || i) {
    const initialSet = new Set(initials.map(String));
    
    return `
        <div class="flex flex-col h-64 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500">${title}</div>
            <div class="p-2 overflow-y-auto space-y-1 custom-scrollbar">
                ${items.map((item, idx) => {
                    const id = String(item.id || item);
                    const isChecked = initialSet.has(id);
                    const checkboxId = `cb-${className}-${idx}-${id}`;
                    return `
                        <div class="flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                            <input type="checkbox" id="${checkboxId}" name="${className}" value="${id}" ${isChecked ? 'checked' : ''} 
                                   class="${className} ${MODAL_CLASSES.CHECKBOX} cursor-pointer">
                            <label for="${checkboxId}" class="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate cursor-pointer flex-1 py-0.5">
                                ${labelFn(item)}
                            </label>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function createTimeBlockBox(blocks, initials) {
    const items = [...blocks, { id: UNASSIGNED_ID, name: '未定' }];
    return createSelectionBox('時間帯', items, initials, 'filter-timeblock-checkbox', b =>
        b.id === UNASSIGNED_ID ? b.name : `${b.start}-${b.end}`
    );
}

function setupEvents(modal, filterToEdit) {
    const cleanup = () => {
        document.removeEventListener('keydown', onEsc);
        modal.remove();
    };

    const onEsc = (e) => e.key === 'Escape' && cleanup();
    document.addEventListener('keydown', onEsc);

    modal.querySelector('#close-filter-modal').onclick = cleanup;
    modal.querySelector('#cancel-filter-btn').onclick = cleanup;
    
    // 背景クリックで閉じる処理（バブル防止のため target 判定を厳密に）
    modal.onclick = (e) => {
        if (e.target === modal) cleanup();
    };

    modal.querySelector('#save-filter-btn').onclick = async (e) => {
        e.preventDefault(); // 念のためデフォルト動作防止
        
        const nameInput = modal.querySelector('#filter-name');
        const name = nameInput.value.trim();
        if (!name) {
            return showMessageModal({ message: MESSAGES.NAME_REQUIRED, type: 'error' });
        }

        const getVals = (cls) => {
            // querySelectorAll で確実に現在の DOM 状態を取得
            const checkboxes = modal.querySelectorAll(`input.${cls}`);
            return Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
        };

        const queryMap = {
            project: getVals('filter-project-checkbox'),
            timeblock: getVals('filter-timeblock-checkbox').map(v => v === UNASSIGNED_ID ? 'null' : v),
            duration: getVals('filter-duration-checkbox'),
            date: getVals('filter-date-checkbox')
        };

        const queryParts = Object.entries(queryMap)
            .filter(([_, v]) => v.length > 0)
            .map(([k, v]) => `${k}:${v.join(',')}`);

        if (queryParts.length === 0) {
            return showMessageModal({ message: MESSAGES.CONDITION_REQUIRED, type: 'error' });
        }

        const queryStr = queryParts.join(' ');

        try {
            const data = { name, query: queryStr, type: 'custom' };
            if (filterToEdit) {
                await updateFilter(filterToEdit.id, data);
            } else {
                await addFilter(data);
            }
            document.dispatchEvent(new CustomEvent('filters-updated'));
            cleanup();
        } catch (err) {
            console.error(err);
            showMessageModal({ message: MESSAGES.SAVE_ERROR + err.message, type: 'error' });
        }
    };
}