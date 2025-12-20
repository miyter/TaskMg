// @ts-nocheck
// @miyter:20251221
// 時間帯設定モーダル

import { getTimeBlocks, saveTimeBlock, deleteTimeBlock } from '../store/timeblocks.js';
import { showMessageModal } from './components.js';

const MAX_BLOCKS = 5;

/**
 * 時間帯設定モーダルを表示
 */
export function showTimeBlockModal() {
    const modalId = 'timeblock-modal';
    document.getElementById(modalId)?.remove();

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in';

    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <!-- ヘッダー -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">時間帯設定</h3>
                <button id="close-tb-modal" class="text-gray-400 hover:text-gray-600 transition">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <!-- ボディ -->
            <div class="p-6 overflow-y-auto flex-1 space-y-6">
                <div id="tb-list" class="divide-y divide-gray-100 dark:divide-gray-700"></div>
                
                <button id="add-tb-btn" class="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all font-medium text-sm flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    新しい時間帯を追加 (最大${MAX_BLOCKS}個)
                </button>

                <div class="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-800 flex items-center text-sm text-gray-500">
                    <span class="w-3 h-3 rounded-full bg-gray-400 mr-3"></span>
                    <span class="font-bold mr-2 text-gray-700 dark:text-gray-300">未定</span>
                    <span class="text-xs">デフォルトのゾーンです（削除不可）</span>
                </div>
            </div>

            <!-- フッター -->
            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 flex justify-end">
                <button id="close-tb-footer" class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all active:scale-95">完了</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    renderList();
    setupGlobalEvents(modal);
}

/**
 * ブロックリストの再描画
 */
function renderList() {
    const container = document.getElementById('tb-list');
    if (!container) return;

    container.innerHTML = '';
    const blocks = getTimeBlocks();
    blocks.forEach(block => container.appendChild(createRowElement(block)));
    
    updateAddButtonState(blocks.length);
}

/**
 * 行要素の生成
 */
function createRowElement(block = null) {
    const isNew = !block;
    const data = block || { id: null, start: '09:00', end: '10:00', color: '#3B82F6' };
    const [sH, sM] = data.start.split(':');
    const [eH, eM] = data.end.split(':');

    const row = document.createElement('div');
    row.className = 'tb-row flex items-center gap-4 py-4 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/20';
    if (data.id) row.dataset.id = data.id;

    const timeOptions = (selected, range) => range.map(v => {
        const val = String(v).padStart(2, '0');
        return `<option value="${val}" ${val === selected ? 'selected' : ''}>${val}</option>`;
    }).join('');

    row.innerHTML = `
        <div class="flex-shrink-0 relative">
            <input type="color" class="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent" value="${data.color}">
            <div class="absolute inset-0 pointer-events-none rounded border border-gray-200 dark:border-gray-600"></div>
        </div>

        <div class="flex-1 flex items-center gap-2">
            <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                <select class="start-h bg-transparent outline-none text-sm">${timeOptions(sH, Array.from({length: 24}, (_, i) => i))}</select>
                <span class="text-gray-400">:</span>
                <select class="start-m bg-transparent outline-none text-sm">${timeOptions(sM, ['00','15','30','45'])}</select>
            </div>
            <span class="text-gray-300 font-bold">~</span>
            <div class="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700">
                <select class="end-h bg-transparent outline-none text-sm">${timeOptions(eH, Array.from({length: 24}, (_, i) => i))}</select>
                <span class="text-gray-400">:</span>
                <select class="end-m bg-transparent outline-none text-sm">${timeOptions(eM, ['00','15','30','45'])}</select>
            </div>
        </div>

        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button class="save-btn p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg" title="保存">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button class="delete-btn p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg" title="削除">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;

    setupRowEvents(row, data, isNew);
    return row;
}

function setupRowEvents(row, initialData, isNew) {
    const getVal = (cls) => row.querySelector(cls).value;
    const saveBtn = row.querySelector('.save-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    saveBtn.onclick = async () => {
        const start = `${getVal('.start-h')}:${getVal('.start-m')}`;
        const end = `${getVal('.end-h')}:${getVal('.end-m')}`;
        const color = getVal('input[type="color"]');

        if (start >= end) return showMessageModal('終了時間は開始時間より後にしてください', 'error');

        try {
            await saveTimeBlock({ id: initialData.id, name: `${start}-${end}`, start, end, color });
            row.classList.add('bg-green-50/50', 'dark:bg-green-900/10');
            setTimeout(() => row.classList.remove('bg-green-50/50', 'dark:bg-green-900/10'), 1000);
            
            document.dispatchEvent(new CustomEvent('timeblocks-updated'));
            if (isNew) renderList(); 
        } catch (e) {
            showMessageModal(e.message, 'error');
        }
    };

    deleteBtn.onclick = () => {
        if (isNew && !initialData.id) {
            row.remove();
            updateAddButtonState(document.querySelectorAll('.tb-row').length);
            return;
        }

        showMessageModal('この時間帯を削除しますか？', async () => {
            try {
                await deleteTimeBlock(initialData.id);
                row.remove();
                updateAddButtonState(document.querySelectorAll('.tb-row').length);
                document.dispatchEvent(new CustomEvent('timeblocks-updated'));
            } catch (e) {
                showMessageModal("削除に失敗しました", 'error');
            }
        });
    };
}

function setupGlobalEvents(modal) {
    const close = () => modal.remove();
    modal.querySelector('#close-tb-modal').onclick = close;
    modal.querySelector('#close-tb-footer').onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };

    modal.querySelector('#add-tb-btn').onclick = () => {
        const container = document.getElementById('tb-list');
        if (document.querySelectorAll('.tb-row').length < MAX_BLOCKS) {
            container.appendChild(createRowElement());
            updateAddButtonState(document.querySelectorAll('.tb-row').length);
        }
    };
}

function updateAddButtonState(count) {
    const btn = document.getElementById('add-tb-btn');
    if (!btn) return;
    const disabled = count >= MAX_BLOCKS;
    btn.disabled = disabled;
    btn.classList.toggle('opacity-50', disabled);
    btn.classList.toggle('cursor-not-allowed', disabled);
}