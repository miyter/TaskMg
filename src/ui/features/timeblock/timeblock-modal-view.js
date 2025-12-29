import { getTimeBlocks } from '../../../store/timeblocks.js';
import { buildRowHTML } from './timeblock-modal-dom.js';
import { updateAddButtonUI } from './timeblock-modal-utils.js';
import { handleDelete } from './timeblock-modal-logic.js';
import Sortable from 'sortablejs';

const DEFAULT_ROW_DATA = { id: null, start: '09:00', end: '10:00', color: '#3B82F6' };

export function renderList(targetBlock) {
    const container = document.getElementById('tb-list');
    const addBtn = document.getElementById('add-tb-btn');
    if (!container) return;

    container.innerHTML = '';
    const blocks = getTimeBlocks(); // Assuming already sorted by order in store or utility

    const fragment = document.createDocumentFragment();
    blocks.forEach(block => fragment.appendChild(createRowElement(block)));
    container.appendChild(fragment);

    updateAddButtonUI(addBtn, blocks.length);

    // Initialize Sortable
    new Sortable(container, {
        animation: 150,
        handle: '.handle', // Drag handle selector
        ghostClass: 'bg-blue-50', // Class name for the drop placeholder
        onEnd: function (evt) {
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

export function createRowElement(block = null) {
    const data = block || { ...DEFAULT_ROW_DATA };
    const row = document.createElement('div');
    row.className = 'tb-row flex items-center gap-4 py-2 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/20 px-2 rounded-lg select-none'; // reduced py and added select-none
    if (data.id) row.dataset.id = data.id;

    row.innerHTML = buildRowHTML(data);

    // Bind delete logic
    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.onclick = () => handleDelete(row);

    return row;
}

export { DEFAULT_ROW_DATA };
