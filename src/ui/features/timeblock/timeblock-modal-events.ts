import { closeColorPicker, openColorPicker } from './timeblock-modal-color-picker';
import { saveAllAndClose } from './timeblock-modal-logic';
import { MAX_BLOCKS, updateAddButtonUI } from './timeblock-modal-utils';
import { createRowElement } from './timeblock-modal-view';

let activeDropdown: HTMLElement | null = null;
let handleOutsideClick: ((e: MouseEvent) => void) | null = null;

export function setupEvents(modal: HTMLElement) {
    const addBtn = modal.querySelector('#add-tb-btn') as HTMLButtonElement;
    const closeBtn = modal.querySelector('#close-tb-modal') as HTMLElement;
    const completeBtn = modal.querySelector('#close-tb-footer') as HTMLButtonElement;

    // Define outside click handler properly within scope
    handleOutsideClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // 1. Close Custom Selects
        if (activeDropdown && !activeDropdown.contains(target)) {
            const opts = activeDropdown.querySelector('.tb-select-options');
            if (opts) opts.classList.add('hidden');
            activeDropdown = null;
        }

        // 2. Close Color Picker
        const picker = document.getElementById('tb-color-picker');
        const trigger = target.closest('.tb-color-trigger');
        const isPickerClick = picker && picker.contains(target);

        if (!trigger && !isPickerClick && picker && !picker.classList.contains('hidden')) {
            closeColorPicker();
        }
    };

    // Attach with small delay to prevent immediate triggering
    setTimeout(() => {
        if (handleOutsideClick) document.addEventListener('click', handleOutsideClick);
    }, 0);

    // --- Close Handling ---
    const close = () => {
        modal.remove();
        document.removeEventListener('keydown', handleKeydown);
        if (handleOutsideClick) document.removeEventListener('click', handleOutsideClick);
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
    };

    closeBtn.onclick = close;
    completeBtn.onclick = async () => await saveAllAndClose(completeBtn, close);
    modal.onclick = (e) => { if (e.target === modal) close(); };

    document.addEventListener('keydown', handleKeydown);

    // --- Add Button ---
    addBtn.onclick = () => {
        const container = document.getElementById('tb-list');
        if (!container) return;
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

function setupDelegatedEvents(modal: HTMLElement) {
    modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // A. Custom Select Trigger
        const selectTrigger = target.closest('.tb-select-trigger');
        if (selectTrigger) {
            const wrapper = selectTrigger.closest('.tb-custom-select') as HTMLElement;
            const options = wrapper.querySelector('.tb-select-options') as HTMLElement;

            document.querySelectorAll('.tb-select-options').forEach(el => {
                if (el !== options) el.classList.add('hidden');
            });

            options.classList.toggle('hidden');
            activeDropdown = options.classList.contains('hidden') ? null : wrapper;
            e.stopPropagation();
            return;
        }

        // B. Custom Select Option
        const option = target.closest('.tb-select-option') as HTMLElement;
        if (option) {
            const wrapper = option.closest('.tb-custom-select') as HTMLElement;
            const val = option.dataset.value!;

            wrapper.dataset.value = val;
            wrapper.querySelector('.value-display')!.textContent = val;

            wrapper.querySelectorAll('.tb-select-option').forEach(opt => {
                const optEl = opt as HTMLElement;
                if (optEl.dataset.value === val) optEl.classList.add('bg-blue-50/50', 'font-bold');
                else optEl.classList.remove('bg-blue-50/50', 'font-bold');
            });

            (wrapper.querySelector('.tb-select-options') as HTMLElement).classList.add('hidden');
            activeDropdown = null;
            e.stopPropagation();
            return;
        }

        // C. Color Trigger
        const colorTrigger = target.closest('.tb-color-trigger');
        if (colorTrigger) {
            openColorPicker(colorTrigger as HTMLElement);
            e.stopPropagation();
        }
    });
}
