// @ts-nocheck
// 時間帯設定モーダル

import { getTimeBlocks, saveTimeBlock, deleteTimeBlock, updateTimeBlockOrder } from '../store/timeblocks.js';
import { renderSidebarItems } from './sidebar-renderer.js';
import { showMessageModal } from './components.js';

// モーダル表示関数
export function showTimeBlockModal() {
    const modalId = 'timeblock-modal';
    document.getElementById(modalId)?.remove();

    const blocks = getTimeBlocks();
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';

    modalOverlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">時間帯設定</h3>
                <button id="close-tb-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            
            <div class="p-6 overflow-y-auto flex-1">
                <div class="mb-4">
                    <div id="tb-list" class="space-y-3">
                        <!-- ブロックリストがここに描画される -->
                    </div>
                </div>
                
                <button id="add-tb-btn" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors font-medium text-sm flex items-center justify-center gap-2" ${blocks.length >= 5 ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    新しい時間帯を追加 (最大5個)
                </button>

                <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <span class="w-3 h-3 rounded-full bg-gray-400 mr-2"></span>
                        <span class="font-bold mr-2">未定</span>
                        <span class="text-gray-400 text-xs">どの時間帯にも属さないタスク用のデフォルトゾーンです（削除不可）</span>
                    </div>
                </div>
            </div>

            <div class="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end">
                <button id="close-tb-footer" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all shadow-sm">
                    完了
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // リスト描画
    renderBlockList(blocks);

    // イベント
    document.getElementById('close-tb-modal').addEventListener('click', () => modalOverlay.remove());
    document.getElementById('close-tb-footer').addEventListener('click', () => {
        modalOverlay.remove();
        // 完了時にも念のため発火
        document.dispatchEvent(new CustomEvent('timeblocks-updated'));
    });

    document.getElementById('add-tb-btn').addEventListener('click', () => {
        renderBlockRow(null, document.getElementById('tb-list')); // 新規行追加
        updateAddButtonState();
    });
}

function renderBlockList(blocks) {
    const container = document.getElementById('tb-list');
    container.innerHTML = '';
    blocks.forEach(block => renderBlockRow(block, container));
}

function updateAddButtonState() {
    const btn = document.getElementById('add-tb-btn');
    const currentCount = document.querySelectorAll('.tb-row').length;
    if (currentCount >= 5) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    } else {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    }
}

function renderBlockRow(block, container) {
    const isNew = !block;
    const data = block || { id: '', name: '', start: '09:00', end: '10:00', color: '#808080' };
    
    const row = document.createElement('div');
    row.className = 'tb-row flex items-center gap-3 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-all hover:shadow-md group';
    if (!isNew) row.dataset.id = data.id;

    row.innerHTML = `
        <div class="cursor-move text-gray-400 hover:text-gray-600 p-1 handle">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
        </div>
        
        <div class="relative">
            <input type="color" class="w-8 h-8 rounded cursor-pointer border-0 p-0 overflow-hidden" value="${data.color}">
            <div class="absolute inset-0 pointer-events-none rounded border border-gray-200 dark:border-gray-600"></div>
        </div>

        <div class="flex-1 flex items-center gap-3 pl-2">
            <input type="time" class="tb-start px-3 py-2 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value="${data.start}">
            <span class="text-gray-400 font-bold">～</span>
            <input type="time" class="tb-end px-3 py-2 text-base text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" value="${data.end}">
        </div>

        <div class="flex items-center gap-1">
            <button class="tb-save p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="保存">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </button>
            <button class="tb-delete p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="削除">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>
    `;

    container.appendChild(row);

    // イベント設定
    const startInput = row.querySelector('.tb-start');
    const endInput = row.querySelector('.tb-end');
    const colorInput = row.querySelector('input[type="color"]');
    const saveBtn = row.querySelector('.tb-save');
    const deleteBtn = row.querySelector('.tb-delete');

    // 保存
    saveBtn.addEventListener('click', async () => {
        const start = startInput.value;
        const end = endInput.value;
        const color = colorInput.value;

        // ★修正: 名前は時間帯から自動生成
        const name = `${start}-${end}`;

        if (start >= end) return showMessageModal('終了時間は開始時間より後にしてください', 'error');

        try {
            await saveTimeBlock({ id: isNew ? null : data.id, name, start, end, color });
            row.classList.add('ring-2', 'ring-green-500', 'ring-opacity-50');
            setTimeout(() => row.classList.remove('ring-2', 'ring-green-500', 'ring-opacity-50'), 1000);
            
            // ★追加: 保存成功時にイベント発火
            document.dispatchEvent(new CustomEvent('timeblocks-updated'));

            if (isNew) {
                const blocks = getTimeBlocks();
                renderBlockList(blocks);
                updateAddButtonState();
            }
        } catch (e) {
            showMessageModal(e.message, 'error');
        }
    });

    // 削除
    deleteBtn.addEventListener('click', async () => {
        if (isNew) {
            row.remove();
            updateAddButtonState();
            return;
        }
        
        showMessageModal(`この時間帯設定を削除しますか？`, async () => {
            await deleteTimeBlock(data.id);
            row.remove();
            updateAddButtonState();
            // ★追加: 削除成功時にイベント発火
            document.dispatchEvent(new CustomEvent('timeblocks-updated'));
        });
    });
}