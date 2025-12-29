import { saveAllAndClose } from './timeblock-modal-logic.js';
import { updateAddButtonUI, MAX_BLOCKS } from './timeblock-modal-utils.js';
import { createRowElement } from './timeblock-modal-view.js';
import { openColorPicker, closeColorPicker } from './timeblock-modal-color-picker.js';

let activeDropdown = null;
let handleOutsideClick = null;

export function setupEvents(modal) {
    const addBtn = modal.querySelector('#add-tb-btn');
    const closeBtn = modal.querySelector('#close-tb-modal');
    const completeBtn = modal.querySelector('#close-tb-footer');

    // Define outside click handler properly within scope
    handleOutsideClick = (e) => {
        // 1. Close Custom Selects
        if (activeDropdown && !activeDropdown.contains(e.target)) {
            const opts = activeDropdown.querySelector('.tb-select-options');
            if (opts) opts.classList.add('hidden');
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

    // Attach with small delay to prevent immediate triggering
    setTimeout(() => document.addEventListener('click', handleOutsideClick), 0);

    // --- Close Handling ---
    const close = () => {
        modal.remove();
        document.removeEventListener('keydown', handleKeydown);
        if (handleOutsideClick) document.removeEventListener('click', handleOutsideClick);
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
    modal.addEventListener('click', (e) => {
        // A. Custom Select Trigger
        const selectTrigger = e.target.closest('.tb-select-trigger');
        if (selectTrigger) {
            const wrapper = selectTrigger.closest('.tb-custom-select');
            const options = wrapper.querySelector('.tb-select-options');

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

            wrapper.dataset.value = val;
            wrapper.querySelector('.value-display').textContent = val;

            wrapper.querySelectorAll('.tb-select-option').forEach(opt => {
                if (opt.dataset.value === val) opt.classList.add('bg-blue-50/50', 'font-bold');
                else opt.classList.remove('bg-blue-50/50', 'font-bold');
            });

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
