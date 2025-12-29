// @miyter:20251229
// �^�X�N�̉E�N���b�N���j���[����

import { deleteTask, updateTask } from '../../store/store';
import { showMessageModal } from '../components';
import { getStartOfDay } from '../../utils/date';
import { updateUI } from '../core/DataSyncManager.js';
import { selectionState } from '../state/ui-state.js';

// ... (existing imports)

/**
 * �ėp�I�ȃR���e�L�X�g���j���[�\��
 * @param {Object|null} task - �Ώۃ^�X�N (null�̏ꍇ�̓��X�g�S�̂̃��j���[)
 * @param {number} x - �\���ʒuX
 * @param {number} y - �\���ʒuY
 */

// ... (existing code)

function triggerSortChange(value) {
    // �����̃\�[�g�h���b�v�_�E���̃I�v�V������N���b�N���邱�ƂŁA
    // ���x���̍X�V�ƃf�[�^�X�V�̗�����g���K�[����
    const options = document.querySelectorAll('.sort-option');
    const target = Array.from(options).find(opt => opt.dataset.value === value);

    if (target) {
        target.click();
    } else {
        // �I�v�V������������Ȃ��ꍇ�̃t�H�[���o�b�N (���ڍX�V)
        const sortTrigger = document.getElementById('sort-trigger');
        if (sortTrigger) {
            sortTrigger.dataset.value = value;
            updateUI();
        }
    }
}

export function showTaskContextMenu(task, x, y) {
    document.getElementById('task-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'task-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-[100] animate-fade-in text-sm min-w-[200px] font-sans user-select-none text-gray-700 dark:text-gray-200';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const closeAndExec = (cb) => {
        menu.remove();
        if (cb) cb();
    };

    const isSelectionMode = selectionState.isSelectionMode;
    // �^�X�NID���I�����Ă��邩�`�F�b�N�Btask��null�Ȃ�I�����Ă��Ȃ�����
    const isTargetSelected = task && selectionState.selectedIds.has(task.id);
    // �I�𒆂̌���
    const selectedCount = selectionState.selectedIds.size;

    // �ꊇ���샂�[�h���ǂ���
    const isBulk = isSelectionMode && isTargetSelected && selectedCount > 0;

    // ����Ώۂ����݂��邩 (�P��^�X�N �܂��� �����I��)
    const hasTarget = !!task || isBulk;

    // ���ʃX�^�C��
    const itemClass = "w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center justify-between group relative";
    const disabledClass = "opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent";

    const chevronSvg = `<svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>`;

    // ���j���[HTML�\�z
    let html = '';

    // 1. ���t�ύX (�T�u���j���[)
    html += `
        <div class="${itemClass} ${!hasTarget ? disabledClass : ''}">
            <span>���t�ύX</span>
            ${chevronSvg}
            ${hasTarget ? `
            <div class="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover:block min-w-[120px]">
                <button id="ctx-date-today" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">����</button>
                <button id="ctx-date-tomorrow" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">����</button>
                <button id="ctx-date-next-week" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">���T</button>
            </div>
            ` : ''}
        </div>
    `;

    // 2. �폜
    html += `
        <button id="ctx-delete" class="${itemClass} ${!hasTarget ? disabledClass : ''} text-red-600 dark:text-red-400">
            <span>�폜</span>
        </button>
    `;

    // �Z�p���[�^
    html += `<div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>`;

    // 3. �^�X�N�ǉ�
    html += `
        <button id="ctx-add-task" class="${itemClass}">
            <span>�^�X�N�ǉ�</span>
        </button>
    `;

    // 4. ���ёւ� (�T�u���j���[)
    html += `
        <div class="${itemClass}">
            <span>���ёւ�</span>
            ${chevronSvg}
            <div class="absolute left-full top-0 ml-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 hidden group-hover:block min-w-[120px]">
                <button id="ctx-sort-name" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">���O��</button>
                <button id="ctx-sort-date" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">���t��</button>
                <button id="ctx-sort-created" class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">�쐬����</button>
            </div>
        </div>
    `;

    // 5. �����I��
    html += `
        <button id="ctx-multi-select" class="${itemClass}">
            <span class="flex items-center">
                �����I��
                ${isSelectionMode ? '<svg class="w-4 h-4 ml-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
            </span>
        </button>
    `;

    menu.innerHTML = html;
    document.body.appendChild(menu);

    // --- ���W�b�N���� ---

    // �Ώۃ^�X�N���X�g�̓��� (�ꊇ or �P��)
    const getTargetIds = () => {
        if (isBulk) return Array.from(selectionState.selectedIds);
        if (task) return [task.id];
        return [];
    };

    const handleUpdate = async (updates) => {
        const ids = getTargetIds();
        if (ids.length === 0) return;

        closeAndExec(async () => {
            const promises = ids.map(id => updateTask(id, updates));
            await Promise.all(promises);
        });
    };

    // 1. ���t�ύX�n���h��
    if (hasTarget) {
        menu.querySelector('#ctx-date-today')?.addEventListener('click', () => {
            handleUpdate({ dueDate: getStartOfDay(new Date()) });
        });
        menu.querySelector('#ctx-date-tomorrow')?.addEventListener('click', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + 1);
            handleUpdate({ dueDate: d });
        });
        menu.querySelector('#ctx-date-next-week')?.addEventListener('click', () => {
            const d = getStartOfDay(new Date()); d.setDate(d.getDate() + (8 - d.getDay()));
            handleUpdate({ dueDate: d });
        });

        // 2. �폜�n���h��
        menu.querySelector('#ctx-delete')?.addEventListener('click', () => {
            const ids = getTargetIds();
            const msg = ids.length > 1 ? `${ids.length}���̃^�X�N��폜���܂����H` : '�폜���܂����H';

            closeAndExec(() => {
                showMessageModal(msg, async () => {
                    const promises = ids.map(id => deleteTask(id));
                    await Promise.all(promises);
                    if (isBulk) toggleSelectionMode(false);
                });
            });
        });
    }

    // 3. �^�X�N�ǉ�
    menu.querySelector('#ctx-add-task')?.addEventListener('click', () => {
        closeAndExec(() => {
            const input = document.getElementById('task-input-fld');
            if (input) input.focus();
        });
    });

    // 4. ���ёւ�
    menu.querySelector('#ctx-sort-name')?.addEventListener('click', () => closeAndExec(() => triggerSortChange('title_asc')));
    menu.querySelector('#ctx-sort-date')?.addEventListener('click', () => closeAndExec(() => triggerSortChange('dueDate_asc')));
    menu.querySelector('#ctx-sort-created')?.addEventListener('click', () => closeAndExec(() => triggerSortChange('createdAt_desc')));

    // 5. �����I��
    menu.querySelector('#ctx-multi-select')?.addEventListener('click', () => {
        closeAndExec(() => {
            toggleSelectionMode(!isSelectionMode);
        });
    });

    // ���鏈��
    const dismissMenu = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    // �����N���b�N�C�x���g�����΂���̂�h��
    setTimeout(() => document.addEventListener('click', dismissMenu), 0);
}

