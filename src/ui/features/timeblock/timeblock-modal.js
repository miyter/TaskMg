/**
 * モジュール分割後の統合、コントローラー責務への純化
 * @update 2025-12-28 Added Auto-save, Custom Controls logic
 */
import { getTimeBlocks, saveTimeBlock, deleteTimeBlock } from '../../../store/timeblocks.js';
import { showMessageModal } from '../../components.js';
import { buildModalSkeletonHTML, buildRowHTML } from './timeblock-modal-dom.js';
import { timeToMinutes, checkOverlap, updateAddButtonUI, MAX_BLOCKS } from './timeblock-modal-utils.js';

const DEFAULT_ROW_DATA = { id: null, start: '09:00', end: '10:00', color: '#3B82F6' };

// カラー設定
const PRESET_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']; // Blue, Red, Green, Orange, Purple
const STORAGE_KEY_CUSTOM_COLORS = 'timeblock_custom_colors';

export function showTimeBlockModal(targetBlock = null) {
    const modalId = 'timeblock-modal';
    document.getElementById(modalId)?.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fade-in';
    modal.innerHTML = buildModalSkeletonHTML();

    document.body.appendChild(modal);
    renderList(targetBlock);

    // カラーピッカー初期化
    initColorPicker(modal);
    setupGlobalEvents(modal);
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

    // 削除ボタンのみ個別バインド
    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.onclick = () => handleDelete(row);

    return row;
}

// --- Custom Control Logic ---

function setupGlobalEvents(modal) {
    const addBtn = modal.querySelector('#add-tb-btn');
    const closeBtn = modal.querySelector('#close-tb-modal'); // header close
    const completeBtn = modal.querySelector('#close-tb-footer'); // footer "Complete"

    // Close logic
    const close = () => {
        modal.remove();
        document.removeEventListener('keydown', handleKeydown);
        document.removeEventListener('click', handleOutsideClick);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') close();
    };

    closeBtn.onclick = close;

    completeBtn.onclick = async () => {
        await saveAllAndClose(completeBtn, close);
    };

    // Modal background click
    modal.onclick = (e) => {
        if (e.target === modal) close();
    };

    document.addEventListener('keydown', handleKeydown);

    // Add Button
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

    // Delegated Events for Custom Controls
    setupDelegatedEvents(modal);
}

// Delegated Events for Dropdowns and Color Picker Interactions
function setupDelegatedEvents(modal) {
    let activeDropdown = null;

    // Window click to close dropdowns / pickers
    const handleOutsideClick = (e) => {
        // Handle dropdown closing
        if (activeDropdown && !activeDropdown.contains(e.target)) {
            activeDropdown.querySelector('.tb-select-options').classList.add('hidden');
            activeDropdown = null;
        }

        // Handle color picker closing
        const picker = document.getElementById('tb-color-picker');
        const trigger = e.target.closest('.tb-color-trigger');
        const isPickerClick = picker && picker.contains(e.target);

        // If click is outside trigger and outside picker, hide picker
        if (!trigger && !isPickerClick && picker && !picker.classList.contains('hidden')) {
            picker.classList.add('hidden');
        }
    };

    // Assign to global for cleanup
    window.tbHandleOutsideClick = handleOutsideClick;
    setTimeout(() => document.addEventListener('click', handleOutsideClick), 0);

    modal.addEventListener('click', (e) => {
        // 1. Custom Select Trigger
        const selectTrigger = e.target.closest('.tb-select-trigger');
        if (selectTrigger) {
            const wrapper = selectTrigger.closest('.tb-custom-select');
            const options = wrapper.querySelector('.tb-select-options');

            // Close others
            document.querySelectorAll('.tb-select-options').forEach(el => {
                if (el !== options) el.classList.add('hidden');
            });

            options.classList.toggle('hidden');
            activeDropdown = options.classList.contains('hidden') ? null : wrapper;
            e.stopPropagation();
            return;
        }

        // 2. Custom Select Option
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

        // 3. Color Trigger
        const colorTrigger = e.target.closest('.tb-color-trigger');
        if (colorTrigger) {
            openColorPicker(colorTrigger);
            e.stopPropagation();
        }
    });
}

// --- Color Picker Logic ---

let activeColorTrigger = null;

function getCustomColors() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_COLORS);
        // Default white/gray slots
        return stored ? JSON.parse(stored) : ['#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB'];
    } catch {
        return ['#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB', '#E5E7EB'];
    }
}

function saveCustomColors(colors) {
    localStorage.setItem(STORAGE_KEY_CUSTOM_COLORS, JSON.stringify(colors));
}

function initColorPicker(modal) {
    const picker = document.getElementById('tb-color-picker');
    const presetsContainer = document.getElementById('tb-color-presets');
    const customsContainer = document.getElementById('tb-color-customs');
    const customInput = document.getElementById('tb-custom-color-input');
    const editBtn = document.getElementById('tb-custom-color-edit-btn');

    // Render Presets
    presetsContainer.innerHTML = PRESET_COLORS.map(color => `
        <button class="w-8 h-8 rounded-full shadow-sm hover:scale-110 transition-transform focus:outline-none ring-2 ring-transparent focus:ring-blue-400"
            style="background-color: ${color}" data-color="${color}"></button>
    `).join('');

    // Render Customs
    const renderCustoms = () => {
        const customs = getCustomColors();
        customsContainer.innerHTML = customs.map((color, index) => `
            <button class="custom-color-slot w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm hover:scale-110 transition-transform focus:outline-none ring-2 ring-transparent focus:ring-blue-400 relative overflow-hidden"
                style="background-color: ${color}" data-index="${index}" data-color="${color}">
                <div class="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors"></div>
            </button>
        `).join('');
    };
    renderCustoms();

    // Event Handler for color selection
    picker.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-color]');
        if (btn && !btn.classList.contains('custom-color-slot')) {
            // Preset clicked
            const color = btn.dataset.color;
            applyColor(color);
        } else if (btn && btn.classList.contains('custom-color-slot')) {
            // Custom slot clicked
            activeCustomIndex = parseInt(btn.dataset.index);
            // Visual highlight for slot selection (optional)
            document.querySelectorAll('.custom-color-slot').forEach(b => b.classList.remove('ring-offset-2', 'ring-2', 'ring-blue-500'));
            btn.classList.add('ring-offset-2', 'ring-2', 'ring-blue-500');

            const color = btn.dataset.color;
            if (color !== '#E5E7EB') { // Apply if not default empty
                applyColor(color);
            }
        }
    });

    // Custom Color Edit Logic
    let activeCustomIndex = -1;

    editBtn.onclick = () => {
        if (activeCustomIndex === -1) activeCustomIndex = 0;
        customInput.click();
    };

    customInput.onchange = (e) => {
        if (activeCustomIndex === -1) activeCustomIndex = 0;
        const newColor = e.target.value;
        const customs = getCustomColors();
        customs[activeCustomIndex] = newColor;
        saveCustomColors(customs);
        renderCustoms();
        applyColor(newColor);
    };

    function applyColor(color) {
        if (activeColorTrigger) {
            activeColorTrigger.style.backgroundColor = color;
            activeColorTrigger.dataset.color = color;
            picker.classList.add('hidden');
        }
    }
}

function openColorPicker(triggerBtn) {
    activeColorTrigger = triggerBtn;
    const picker = document.getElementById('tb-color-picker');

    // Position logic
    const rect = triggerBtn.getBoundingClientRect();

    // Find container to calculate relative position
    // The skeleton has .relative on the main wrapper
    const container = document.getElementById('tb-scroll-container').parentElement;
    const containerRect = container.getBoundingClientRect();

    let top = rect.bottom - containerRect.top + 10;
    let left = rect.left - containerRect.left;

    // Boundary check
    if (left + 280 > containerRect.width) {
        left = containerRect.width - 290;
    }

    picker.style.top = `${top}px`;
    picker.style.left = `${left}px`;
    picker.classList.remove('hidden');
}


// --- Save Logic ---

function handleDelete(row) {
    const currentId = row.dataset.id;
    if (!currentId) {
        row.remove();
        updateAddButtonUI(document.getElementById('add-tb-btn'), getTimeBlocks().length);
        return;
    }
    showMessageModal({
        message: '削除しますか？\n（保存ボタンを押すまで確定しません... と言いたいところですが、削除は即時反映されます）',
        type: 'confirm',
        onConfirm: async () => {
            try {
                await deleteTimeBlock(currentId);
                row.remove();
                document.dispatchEvent(new CustomEvent('timeblocks-updated'));
                updateAddButtonUI(document.getElementById('add-tb-btn'), getTimeBlocks().length);
            } catch (e) {
                showMessageModal({ message: "削除に失敗しました", type: 'error' });
            }
        }
    });
}

function getRowValues(row) {
    const startH = row.querySelector('.tb-custom-select[data-type="start-h"]').dataset.value;
    const startM = row.querySelector('.tb-custom-select[data-type="start-m"]').dataset.value;
    const endH = row.querySelector('.tb-custom-select[data-type="end-h"]').dataset.value;
    const endM = row.querySelector('.tb-custom-select[data-type="end-m"]').dataset.value;
    const color = row.querySelector('.tb-color-trigger').dataset.color;

    return {
        id: row.dataset.id || null,
        start: `${startH}:${startM}`,
        end: `${endH}:${endM}`,
        color: color
    };
}

async function saveAllAndClose(btn, closeFn) {
    const rows = Array.from(document.querySelectorAll('.tb-row'));
    const dataList = rows.map(getRowValues);

    // 1. Basic Validation
    for (const data of dataList) {
        const startMin = timeToMinutes(data.start);
        const endMin = timeToMinutes(data.end);

        if (startMin >= endMin) {
            return showMessageModal({ message: `時間設定が不正です: ${data.start} - ${data.end}\n(終了時間は開始時間より後にしてください)`, type: 'error' });
        }
    }

    // 2. Overlap Validation (Internal)
    for (let i = 0; i < dataList.length; i++) {
        const a = dataList[i];
        const aStart = timeToMinutes(a.start);
        const aEnd = timeToMinutes(a.end);

        for (let j = i + 1; j < dataList.length; j++) {
            const b = dataList[j];
            const bStart = timeToMinutes(b.start);
            const bEnd = timeToMinutes(b.end);

            if (Math.max(aStart, bStart) < Math.min(aEnd, bEnd)) {
                return showMessageModal({ message: `時間帯が重複しています:\n${a.start}~${a.end} と ${b.start}~${b.end}`, type: 'error' });
            }
        }
    }

    // Execution
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = '保存中...';

    try {
        const promises = dataList.map(data =>
            saveTimeBlock({ id: data.id, name: `${data.start}-${data.end}`, start: data.start, end: data.end, color: data.color })
        );

        await Promise.all(promises);

        document.dispatchEvent(new CustomEvent('timeblocks-updated'));
        closeFn();

    } catch (e) {
        console.error(e);
        showMessageModal({ message: "保存中にエラーが発生しました", type: 'error' });
    } finally {
        btn.disabled = false;
        btn.textContent = originalText;
    }
}