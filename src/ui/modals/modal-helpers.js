/**
 * モーダルおよびコンテキストメニューの共通ヘルパー
 */
import { updateTask } from '../../store/store';
import { showMessageModal } from '../../ui/components';

const INBOX_LABEL = '📥 インボックス';

/**
 * Dateオブジェクトを YYYY-MM-DD 形式に変換（Firebase Timestamp対応）
 */
export function formatDateForInput(date) {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * タスクの移動用コンテキストメニューを表示
 */
export function showTaskMoveMenu(task, allProjects, x, y) {
    document.getElementById('task-move-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'task-move-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[200px] max-h-[300px] overflow-y-auto custom-scrollbar';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    const header = `<div class="px-3 py-1.5 font-bold text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-700 mb-1">タスクの移動先</div>`;

    const isInbox = !task.projectId;
    const inboxItem = createMenuItem(INBOX_LABEL, null, isInbox);

    const projectItems = allProjects.length > 0
        ? allProjects.map(p => createMenuItem(p.name, p.id, task.projectId === p.id)).join('')
        : `<div class="px-3 py-2 text-gray-400 italic text-xs text-center">プロジェクトなし</div>`;

    menu.innerHTML = header + inboxItem + projectItems;
    document.body.appendChild(menu);

    menu.onclick = async (e) => {
        const btn = e.target.closest('button[data-project-id]');
        if (!btn) return;

        const rawId = btn.dataset.projectId;
        const newProjectId = rawId === 'null' ? null : rawId;

        if (newProjectId !== task.projectId) {
            try {
                await updateTask(task.id, { projectId: newProjectId });
                const name = newProjectId ? allProjects.find(p => p.id === newProjectId)?.name : 'インボックス';
                showMessageModal({ message: `「${name}」へ移動したぞ`, type: 'success' });
            } catch (err) {
                showMessageModal({ message: "移動に失敗した", type: "error" });
            }
        }
        menu.remove();
    };

    const close = (e) => {
        if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener('click', close);
        }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
}

function createMenuItem(name, id, isActive) {
    const activeClass = isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-200';
    return `
        <button data-project-id="${id || 'null'}" 
            class="flex w-full justify-between items-center px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${activeClass}">
            <span class="truncate mr-2">${name}</span>
            ${isActive ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>' : ''}
        </button>
    `;
}