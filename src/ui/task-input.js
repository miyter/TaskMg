// @ts-nocheck
// @miyter:20251221
// タスク入力フォームの制御（スタンドアロン版 & インライン版）

import { addTaskCompatibility } from '../store/store.js';
import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { createGlassCard } from './components/glass-card.js';
import { showMessageModal } from './components.js';

let isInputExpanded = false;

/**
 * スタンドアロン入力フォーム (検索/ダッシュボード用)
 */
export function renderTaskInput() {
    const container = document.getElementById('task-input-container');
    if (!container) return;

    const projects = getProjects();
    const projectOptions = projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    const html = `
        <form id="task-form" class="flex flex-col gap-3">
            <input type="text" id="task-title-input" 
                class="bg-transparent text-lg font-medium placeholder-gray-400 text-gray-800 dark:text-white border-none outline-none focus:ring-0"
                placeholder="新しいタスクを追加..." autocomplete="off">
            
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <div class="flex items-center gap-2">
                    <select id="task-project-input" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs rounded-md py-1.5 px-2">
                        <option value="">インボックス</option>
                        ${projectOptions}
                    </select>
                    <input type="date" id="task-due-date-input" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs rounded-md py-1 px-2">
                </div>
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg transition-all active:scale-95">追加</button>
            </div>
        </form>
    `;

    container.innerHTML = createGlassCard(html, 'p-4 mb-6');
    setupStandaloneEvents();
}

/**
 * インライン入力フォーム (タスクリスト下部)
 */
export function renderInlineInput(container, projectId, labelId) {
    if (!isInputExpanded) {
        container.innerHTML = `
            <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-red-500 cursor-pointer py-2 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group select-none">
                <div class="w-6 h-6 mr-2 rounded-full text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="text-sm font-medium">タスクを追加</div>
            </div>
        `;
        container.querySelector('#show-input-btn').addEventListener('click', () => {
            isInputExpanded = true;
            renderInlineInput(container, projectId, labelId);
        });
        return;
    }

    const timeBlockOptions = getTimeBlocks().map(tb => `<option value="${tb.id}">${tb.start} - ${tb.end}</option>`).join('');

    const html = `
        <div class="flex flex-col gap-2">
            <input type="text" id="inline-title-input" placeholder="タスク名" class="w-full text-sm font-semibold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100">
            <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2" class="w-full text-xs bg-transparent border-none outline-none text-gray-600 dark:text-gray-300 resize-none"></textarea>
            
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <select id="inline-timeblock-select" class="bg-transparent text-xs text-gray-500 border border-gray-200 dark:border-gray-600/50 rounded px-2 py-1">
                    <option value="">時間帯 (未定)</option>
                    ${timeBlockOptions}
                </select>
                <div class="flex gap-2">
                    <button id="cancel-input-btn" class="text-xs text-gray-500 px-3 py-1.5">キャンセル</button>
                    <button id="submit-task-btn" class="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded">タスクを追加</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = createGlassCard(html, 'p-3 animate-fade-in-down');
    setupInlineEvents(container, projectId, labelId);
}

// --- Internal Helpers ---

function setupStandaloneEvents() {
    const form = document.getElementById('task-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title-input').value.trim();
        if (!title) return;

        await handleAddTask({
            title,
            projectId: document.getElementById('task-project-input').value || null,
            dueDate: document.getElementById('task-due-date-input').value || null
        });

        form.reset();
        document.getElementById('task-title-input').focus();
    });
}

function setupInlineEvents(container, projectId, labelId) {
    const titleInput = container.querySelector('#inline-title-input');
    const submitBtn = container.querySelector('#submit-task-btn');

    titleInput.focus();

    container.querySelector('#cancel-input-btn').addEventListener('click', () => {
        isInputExpanded = false;
        renderInlineInput(container, projectId, labelId);
    });

    const submitAction = async () => {
        const title = titleInput.value.trim();
        if (!title) return;

        submitBtn.disabled = true;
        await handleAddTask({
            title,
            description: container.querySelector('#inline-desc-input').value.trim(),
            projectId,
            labelIds: labelId ? [labelId] : [],
            timeBlockId: container.querySelector('#inline-timeblock-select').value || null
        });

        titleInput.value = '';
        container.querySelector('#inline-desc-input').value = '';
        titleInput.focus();
        submitBtn.disabled = false;
    };

    submitBtn.addEventListener('click', submitAction);
    titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) submitAction();
    });
}

async function handleAddTask(data) {
    try {
        await addTaskCompatibility(data);
    } catch (e) {
        console.error(e);
        if (e.message !== 'Authentication required.') {
            showMessageModal("タスクの追加に失敗しました", 'error');
        }
    }
}