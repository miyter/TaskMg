/**
 * 時間帯設定モーダルのコントローラー
 * @module timeblock-modal
 */
import { getTimeBlocks } from '../../../store/timeblocks.js';
import { buildModalSkeletonHTML, buildRowHTML } from './timeblock-modal-dom.js';
import { updateAddButtonUI, MAX_BLOCKS } from './timeblock-modal-utils.js';
import { initColorPicker, openColorPicker, closeColorPicker } from './timeblock-modal-color-picker.js';
import { saveAllAndClose, handleDelete } from './timeblock-modal-logic.js';

const DEFAULT_ROW_DATA = { id: null, start: '09:00', end: '10:00', color: '#3B82F6' };

export function showTimeBlockModal(targetBlock = null) {
    const modalId = 'timeblock-modal';
    document.getElementById(modalId)?.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fade-in';
    modal.innerHTML = buildModalSkeletonHTML();

    document.body.appendChild(modal);
    renderList(targetBlock);

    // Feature initialization
    initColorPicker(modal);
    setupEvents(modal);
}

function renderList(targetBlock) {
    const container = document.getElementById('tb-list');
    const addBtn = document.getElementById('add-tb-btn');
    if (!container) return;

    container.innerHTML = '';
    const blocks = getTimeBlocks();

    const fragment = document.createDocumentFragment();
    blocks.forEach(block => fragment.appendChild(createRowElement(block)));
    container.appendChild(fragment);

    updateAddButtonUI(addBtn, blocks.length);

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

function createRowElement(block = null) {
    const data = block || { ...DEFAULT_ROW_DATA };
    const row = document.createElement('div');
    row.className = 'tb-row flex items-center gap-4 py-4 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/20 px-2 rounded-lg';
    if (data.id) row.dataset.id = data.id;

    row.innerHTML = buildRowHTML(data);

    // Bind delete logic
    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.onclick = () => handleDelete(row);

    return row;
}

function setupEvents(modal) {
    const addBtn = modal.querySelector('#add-tb-btn');
    const closeBtn = modal.querySelector('#close-tb-modal');
    const completeBtn = modal.querySelector('#close-tb-footer');

    // --- Close Handling ---
    const close = () => {
        modal.remove();
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', handleOutsideClick);
        // Clear global handler if attached
        if (window.tbHandleOutsideClick) {
            window.tbHandleOutsideClick = null;
        }
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') close();
    };

    closeBtn.onclick = close;
    completeBtn.onclick = async () => await saveAllAndClose(completeBtn, close);
    modal.onclick = (e) => { if (e.target === modal) close(); };

    document.addEventListener('keydown', handleKeydown);

    // --- Add Button ---
    addBtn.onclick = () => {
        const container = document.getElementById('tb-list');
        const currentCount = container.querySelectorAll('.tb-row').length;
        if (currentCount < MAX_BLOCKS) {
            const newRow = createRowElement();
            container.appendChild(newRow);
            updateAddButtonUI(addBtn, currentCount + 1);
            newRow.scrollIntoView({ behavior: 'smooth' });
        }
    };

    setupDelegatedEvents(modal);
}

function setupDelegatedEvents(modal) {
    let activeDropdown = null;

    // Global outside click handler (for closing dropdowns and pickers)
    const handleOutsideClick = (e) => {
        // 1. Close Custom Selects
        if (activeDropdown && !activeDropdown.contains(e.target)) {
            activeDropdown.querySelector('.tb-select-options').classList.add('hidden');
            activeDropdown = null;
        }

        // 2. Close Color Picker
        const picker = document.getElementById('tb-color-picker');
        const trigger = e.target.closest('.tb-color-trigger');
        const isPickerClick = picker && picker.contains(e.target);

        if (!trigger && !isPickerClick && picker && !picker.classList.contains('hidden')) {
            closeColorPicker();
        }
    };

    // Avoid immediate trigger
    setTimeout(() => document.addEventListener('click', handleOutsideClick), 0);

    // Modal internal clicks (Delegate)
    modal.addEventListener('click', (e) => {
        // A. Custom Select Trigger
        const selectTrigger = e.target.closest('.tb-select-trigger');
        if (selectTrigger) {
            const wrapper = selectTrigger.closest('.tb-custom-select');
            const options = wrapper.querySelector('.tb-select-options');

            // Close other open options
            document.querySelectorAll('.tb-select-options').forEach(el => {
                if (el !== options) el.classList.add('hidden');
            });

            options.classList.toggle('hidden');
            activeDropdown = options.classList.contains('hidden') ? null : wrapper;
            e.stopPropagation();
            return;
        }

        // B. Custom Select Option
        const option = e.target.closest('.tb-select-option');
        if (option) {
            const wrapper = option.closest('.tb-custom-select');
            const val = option.dataset.value;

            // Update UI
            wrapper.dataset.value = val;
            wrapper.querySelector('.value-display').textContent = val;

            // Highlight selected
            wrapper.querySelectorAll('.tb-select-option').forEach(opt => {
                if (opt.dataset.value === val) opt.classList.add('bg-blue-50/50', 'font-bold');
                else opt.classList.remove('bg-blue-50/50', 'font-bold');
            });

            // Close
            wrapper.querySelector('.tb-select-options').classList.add('hidden');
            activeDropdown = null;
            e.stopPropagation();
            return;
        }

        // C. Color Trigger
        const colorTrigger = e.target.closest('.tb-color-trigger');
        if (colorTrigger) {
            openColorPicker(colorTrigger);
            e.stopPropagation();
        }
    });
}