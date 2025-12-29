import { getProjects } from '../../store/projects';
import { Filter, TimeBlock } from '../../store/schema';
import { addFilter, updateFilter } from '../../store/store';
import { getTimeBlocks } from '../../store/timeblocks';
import { showMessageModal } from '../components';
import { MODAL_CLASSES } from '../core/ui-modal-constants';
import { UI_STYLES } from '../core/ui-style-constants';

const UNASSIGNED_ID = 'none';
const MESSAGES = {
    NAME_REQUIRED: 'フィルター名を入力してくれ',
    CONDITION_REQUIRED: '少なくとも1つの条件を選択してくれ',
    SAVE_ERROR: '保存に失敗したぞ: '
};

interface FilterState {
    project: string[];
    timeblock: string[];
    duration: string[];
    date: string[];
}

/**
 * フィルター作成・編集モーダルを表示
 */
export function showFilterModal(filterToEdit: Filter | null = null) {
    const isEditMode = !!filterToEdit;
    const projects = getProjects();
    const timeBlocks = getTimeBlocks();
    const durations = [30, 45, 60, 75, 90];
    // @ts-ignore
    const dateOptions: { id: string, name: string }[] = [
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
                        ${createSelectionBox('所要時間', durations, state.duration, 'filter-duration-checkbox', (d: any) => `${d} min`)}
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
function parseFilterQuery(query: string): FilterState {
    // @ts-ignore
    const result: FilterState = { project: [], timeblock: [], duration: [], date: [] };
    if (!query) return result;

    query.split(/\s+/).forEach(part => {
        if (!part.includes(':')) return;
        const [key, val] = part.split(':');
        // @ts-ignore
        if (result[key]) {
            const values = val.split(',').map(v => {
                if (key === 'timeblock' && (v === 'null' || v === 'none')) return UNASSIGNED_ID;
                return v;
            });
            // @ts-ignore
            result[key] = [...result[key], ...values];
        }
    });
    return result;
}

function createSelectionBox<T>(title: string, items: T[], initials: string[], className: string, labelFn: (i: T) => string = (i: any) => i.name || String(i)): string {
    const initialSet = new Set(initials.map(String));

    return `
        <div class="flex flex-col h-64 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            <div class="px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-bold text-gray-500">${title}</div>
            <div class="p-2 overflow-y-auto space-y-1 custom-scrollbar">
                ${items.map((item, idx) => {
        // @ts-ignore
        const id = String(item.id !== undefined ? item.id : item);
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

function createTimeBlockBox(blocks: TimeBlock[], initials: string[]): string {
    const items = [...blocks, { id: UNASSIGNED_ID, name: '未定' }] as any[]; // 簡易型アサーション
    return createSelectionBox('時間帯', items, initials, 'filter-timeblock-checkbox', b =>
        b.id === UNASSIGNED_ID ? b.name : `${b.start}-${b.end}`
    );
}

function setupEvents(modal: HTMLElement, filterToEdit: Filter | null) {
    const cleanup = () => {
        document.removeEventListener('keydown', onEsc);
        modal.remove();
    };

    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && cleanup();
    document.addEventListener('keydown', onEsc);

    (modal.querySelector('#close-filter-modal') as HTMLElement).onclick = cleanup;
    (modal.querySelector('#cancel-filter-btn') as HTMLElement).onclick = cleanup;

    // 背景クリックで閉じる処理
    modal.onclick = (e) => {
        if (e.target === modal) cleanup();
    };

    (modal.querySelector('#save-filter-btn') as HTMLElement).onclick = async (e) => {
        e.preventDefault();

        const nameInput = modal.querySelector('#filter-name') as HTMLInputElement;
        const name = nameInput.value.trim();
        if (!name) {
            return showMessageModal({ message: MESSAGES.NAME_REQUIRED, type: 'error' });
        }

        const getVals = (cls: string): string[] => {
            const checkboxes = modal.querySelectorAll(`input.${cls}`) as NodeListOf<HTMLInputElement>;
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
            const data: any = { name, query: queryStr, type: 'custom' };
            if (filterToEdit) {
                await updateFilter(filterToEdit.id!, data);
            } else {
                await addFilter(data);
            }
            document.dispatchEvent(new CustomEvent('filters-updated'));
            cleanup();
        } catch (err: any) {
            console.error(err);
            showMessageModal({ message: MESSAGES.SAVE_ERROR + err.message, type: 'error' });
        }
    };
}
