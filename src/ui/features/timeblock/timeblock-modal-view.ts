import { getTimeBlocks } from '../../../store/timeblocks';
import { buildRowHTML, TimeBlockRowData } from './timeblock-modal-dom';
import { handleDelete } from './timeblock-modal-logic';
import { updateAddButtonUI } from './timeblock-modal-utils';
// @ts-ignore
import Sortable from 'sortablejs';
import { TimeBlock } from '../../../store/schema';

const DEFAULT_ROW_DATA: TimeBlockRowData = { id: null, start: '09:00', end: '10:00', color: '#3B82F6' };

export function renderList(targetBlock: TimeBlock | null = null) {
    const container = document.getElementById('tb-list');
    const addBtn = document.getElementById('add-tb-btn') as HTMLButtonElement;
    if (!container) return;

    container.innerHTML = '';
    const blocks = getTimeBlocks(); // Assuming already sorted by order in store or utility

    const fragment = document.createDocumentFragment();
    blocks.forEach((block: TimeBlock) => fragment.appendChild(createRowElement(block)));
    container.appendChild(fragment);

    updateAddButtonUI(addBtn, blocks.length);

    // Initialize Sortable
    new Sortable(container, {
        animation: 150,
        handle: '.handle', // Drag handle selector
        ghostClass: 'bg-blue-50', // Class name for the drop placeholder
        onEnd: function (evt: any) {
            // Drag ended logic (saving order happens at "Complete" click in logic.js)
        },
    });

    // Scroll to target if specified
    if (targetBlock?.id) {
        requestAnimationFrame(() => {
            const targetRow = container.querySelector(`.tb-row[data-id="${targetBlock.id}"]`);
            if (targetRow) {
                targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetRow.classList.add('bg-blue-50', 'dark:bg-blue-900/20');
            }
        });
    }
}

export function createRowElement(block: TimeBlock | TimeBlockRowData | null = null): HTMLElement {
    const data: TimeBlockRowData = block ? {
        id: block.id || null,
        start: block.start,
        end: block.end,
        color: block.color
    } : { ...DEFAULT_ROW_DATA };

    const row = document.createElement('div');
    row.className = 'tb-row flex items-center gap-4 py-2 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/20 px-2 rounded-lg select-none'; // reduced py and added select-none
    if (data.id) row.dataset.id = data.id;

    row.innerHTML = buildRowHTML(data);

    // Bind delete logic
    const deleteBtn = row.querySelector('.delete-btn') as HTMLElement;
    deleteBtn.onclick = () => handleDelete(row);

    return row;
}

export { DEFAULT_ROW_DATA };
