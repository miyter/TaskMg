/**
 * 更新日: 2025-12-21
 * 内容: モジュール分割後の統合、コントローラー責務への純化
 */
import { getTimeBlocks, saveTimeBlock, deleteTimeBlock } from '../store/timeblocks.js';
import { showMessageModal } from './components.js';
import { buildModalSkeletonHTML, buildRowHTML } from './timeblock-modal-dom.js';
import { timeToMinutes, checkOverlap, updateAddButtonUI, MAX_BLOCKS } from './timeblock-modal-utils.js';

export function showTimeBlockModal(targetBlock = null) {
    const modalId = 'timeblock-modal';
    document.getElementById(modalId)?.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] p-4 animate-fade-in';
    modal.innerHTML = buildModalSkeletonHTML();

    document.body.appendChild(modal);
    renderList(targetBlock);
    setupGlobalEvents(modal);
}

function renderList(targetBlock) {
    const container = document.getElementById('tb-list');
    const addBtn = document.getElementById('add-tb-btn');
    if (!container) return;

    container.innerHTML = '';
    const blocks = getTimeBlocks();
    blocks.forEach(block => container.appendChild(createRowElement(block)));
    
    updateAddButtonUI(addBtn, blocks.length);

    if (targetBlock?.id) {
        const targetRow = container.querySelector(`.tb-row[data-id="${targetBlock.id}"]`);
        if (targetRow) {
            setTimeout(() => {
                targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetRow.classList.add('bg-blue-50', 'dark:bg-blue-900/20', 'ring-2', 'ring-blue-400', 'ring-inset', 'rounded-lg');
                setTimeout(() => targetRow.classList.remove('ring-2', 'ring-blue-400', 'ring-inset'), 2000);
            }, 100);
        }
    }
}

function createRowElement(block = null) {
    const data = block || { id: null, start: '09:00', end: '10:00', color: '#3B82F6' };
    const row = document.createElement('div');
    row.className = 'tb-row flex items-center gap-4 py-4 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/20 px-2 rounded-lg';
    if (data.id) row.dataset.id = data.id;

    row.innerHTML = buildRowHTML(data);
    setupRowEvents(row);
    return row;
}

function setupRowEvents(row) {
    const getVal = (cls) => row.querySelector(cls).value;
    const saveBtn = row.querySelector('.save-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    saveBtn.onclick = async () => {
        const start = `${getVal('.start-h')}:${getVal('.start-m')}`;
        const end = `${getVal('.end-h')}:${getVal('.end-m')}`;
        const color = getVal('input[type="color"]');
        const currentId = row.dataset.id || null;

        const startMin = timeToMinutes(start);
        const endMin = timeToMinutes(end);

        if (startMin >= endMin) return showMessageModal({ message: '終了時間は開始時間より後にしてください', type: 'error' });
        if (checkOverlap(currentId, startMin, endMin)) return showMessageModal({ message: '他の時間帯と重複しています。', type: 'error' });

        saveBtn.disabled = true;
        try {
            const saved = await saveTimeBlock({ id: currentId, name: `${start}-${end}`, start, end, color });
            if (saved?.id) row.dataset.id = saved.id;
            row.classList.add('bg-green-50', 'dark:bg-green-900/20');
            setTimeout(() => row.classList.remove('bg-green-50', 'dark:bg-green-900/20'), 1000);
            document.dispatchEvent(new CustomEvent('timeblocks-updated'));
            updateAddButtonUI(document.getElementById('add-tb-btn'), document.querySelectorAll('.tb-row').length);
        } catch (e) {
            showMessageModal({ message: e.message || "保存に失敗しました", type: 'error' });
        } finally {
            saveBtn.disabled = false;
        }
    };

    deleteBtn.onclick = () => {
        const currentId = row.dataset.id;
        if (!currentId) {
            row.remove();
            updateAddButtonUI(document.getElementById('add-tb-btn'), document.querySelectorAll('.tb-row').length);
            return;
        }
        showMessageModal({
            message: '削除しますか？関連タスクは「未定」になります。',
            type: 'confirm',
            onConfirm: async () => {
                try {
                    await deleteTimeBlock(currentId);
                    row.remove();
                    document.dispatchEvent(new CustomEvent('timeblocks-updated'));
                    updateAddButtonUI(document.getElementById('add-tb-btn'), document.querySelectorAll('.tb-row').length);
                } catch (e) {
                    showMessageModal({ message: "削除に失敗しました", type: 'error' });
                }
            }
        });
    };
}

function setupGlobalEvents(modal) {
    const close = () => modal.remove();
    modal.querySelector('#close-tb-modal').onclick = close;
    modal.querySelector('#close-tb-footer').onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            close();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);

    modal.querySelector('#add-tb-btn').onclick = () => {
        const container = document.getElementById('tb-list');
        if (document.querySelectorAll('.tb-row').length < MAX_BLOCKS) {
            const newRow = createRowElement();
            container.appendChild(newRow);
            updateAddButtonUI(document.getElementById('add-tb-btn'), document.querySelectorAll('.tb-row').length);
            newRow.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => newRow.querySelector('select')?.focus(), 100);
        }
    };
}