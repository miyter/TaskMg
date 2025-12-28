/**
 * タスク入力フォーム (スタンドアロンおよびインライン)
 */
import { addTaskCompatibility } from '../store/store.js';
import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { createGlassCard } from './components/glass-card.js';
import { showMessageModal } from './components.js';

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
                    <select id="task-project-input" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs rounded-md py-1.5 px-2 cursor-pointer">
                        <option value="">インボックス</option>
                        ${projectOptions}
                    </select>
                    <input type="date" id="task-due-date-input" class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs rounded-md py-1 px-2 cursor-pointer">
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
/**
 * インライン入力フォーム (タスクリスト下部)
 * @param {HTMLElement} container 
 * @param {string} projectId 
 * @param {string} labelId 
 * @param {Object} options - { onClose: function, forceExpand: boolean }
 */
export function renderInlineInput(container, projectId, labelId, options = {}) {
    const isExpanded = options.forceExpand || container.dataset.expanded === 'true';

    if (!isExpanded) {
        // 固定フッターモードの場合は、ここは空にするか、何もしない制御が必要
        // 既存のリスト末尾ボタンとしての動作を維持しつつ、固定フッターからも呼ばれる
        container.innerHTML = `
            <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-red-500 cursor-pointer py-2 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group select-none">
                <div class="w-6 h-6 mr-2 rounded-full text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="text-sm font-medium">タスクを追加</div>
            </div>
        `;
        container.querySelector('#show-input-btn').onclick = () => {
            container.dataset.expanded = 'true';
            renderInlineInput(container, projectId, labelId, options);
        };
        return;
    }

    const timeBlockOptions = getTimeBlocks().map(tb => `<option value="${tb.id}">${tb.start} - ${tb.end}</option>`).join('');

    const html = `
        <div class="flex flex-col gap-2">
            <input type="text" id="inline-title-input" placeholder="タスク名" class="w-full text-sm font-semibold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100">
            <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2" class="w-full text-xs bg-transparent border-none outline-none text-gray-600 dark:text-gray-300 resize-none"></textarea>
            
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <select id="inline-timeblock-select" class="bg-transparent text-xs text-gray-500 border border-gray-200 dark:border-gray-600/50 rounded px-2 py-1 cursor-pointer">
                    <option value="">時間帯 (未定)</option>
                    ${timeBlockOptions}
                </select>
                <div class="flex gap-2">
                    <button id="cancel-input-btn" class="text-xs text-gray-500 px-3 py-1.5 hover:text-gray-800 transition">キャンセル</button>
                    <button id="submit-task-btn" class="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-sm">タスクを追加</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = createGlassCard(html, 'p-3 animate-fade-in-down');
    setupInlineEvents(container, projectId, labelId, options);
}

/**
 * 画面下部固定のタスク追加バーを描画
 */
export function renderFixedAddTaskBar(footerContainer, inputContainer, projectId, labelId) {
    footerContainer.innerHTML = `
        <div id="fixed-add-task-btn" class="w-full h-full flex items-center px-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
            <div class="w-6 h-6 mr-3 rounded-full text-red-500 bg-red-50 dark:bg-red-900/20 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <span class="text-sm font-medium text-gray-600 dark:text-gray-300">タスクを追加</span>
        </div>
    `;

    footerContainer.querySelector('#fixed-add-task-btn').onclick = () => {
        // フッターを隠す
        footerContainer.classList.add('hidden');

        // フォームを表示
        inputContainer.innerHTML = '';
        inputContainer.classList.remove('hidden');
        renderInlineInput(inputContainer, projectId, labelId, {
            forceExpand: true,
            onClose: () => {
                inputContainer.innerHTML = ''; // フォーム消去
                inputContainer.classList.add('hidden'); // コンテナ隠す
                footerContainer.classList.remove('hidden'); // フッター復帰
            }
        });

        // フォームへスクロール
        setTimeout(() => {
            inputContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };
}

function setupStandaloneEvents() {
    const form = document.getElementById('task-form');
    if (!form) return;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const titleInput = document.getElementById('task-title-input');
        const title = titleInput.value.trim();
        if (!title) return;

        const dateVal = document.getElementById('task-due-date-input').value;
        const dueDate = dateVal ? new Date(dateVal) : null;

        if (dateVal && isNaN(dueDate.getTime())) {
            return showMessageModal({ message: "無効な日付だ", type: 'error' });
        }

        await handleAddTask({
            title,
            projectId: document.getElementById('task-project-input').value || null,
            dueDate
        });

        form.reset();
        titleInput.focus();
    };
}

function setupInlineEvents(container, projectId, labelId, options = {}) {
    const titleInput = container.querySelector('#inline-title-input');
    const submitBtn = container.querySelector('#submit-task-btn');
    const cancelBtn = container.querySelector('#cancel-input-btn');
    const descInput = container.querySelector('#inline-desc-input');
    const tbSelect = container.querySelector('#inline-timeblock-select');

    titleInput.focus();

    const closeForm = () => {
        container.dataset.expanded = 'false';
        if (options.onClose) {
            options.onClose();
        } else {
            // デフォルト動作（リスト内ボタンに戻る）
            renderInlineInput(container, projectId, labelId);
        }
    };

    cancelBtn.onclick = closeForm;

    const submitAction = async () => {
        const title = titleInput.value.trim();
        if (!title) return;

        submitBtn.disabled = true;

        await handleAddTask({
            title,
            description: descInput.value.trim(),
            projectId,
            labelIds: labelId ? [labelId] : [],
            timeBlockId: tbSelect.value || null
        });

        // 連続入力を許可するか、閉じるか？
        // ユーザーフロー的には連続入力したいことが多いが、今回は固定バー復帰ロジックもある。
        // 一旦Todoist風に「フォームは開いたまま（内容はクリア）」にするのが一般的だが、
        // 「固定の追加ボタンバー」の要件からすると、完了したら一旦閉じる方が「バー」の存在意義が出るかも。
        // -> いや、Todoistは追加後もフォーム維持。今回はシンプルに「追加したら閉じてバー復帰」にしてみる（閉じるのが鬱陶しければ後で変更）。
        // -> 待て、閉じてしまうと連続追加が面倒。
        // -> フォーム維持（Inputクリアのみ）にして、キャンセルボタンでのみ閉じるのがUX上正解。

        titleInput.value = '';
        descInput.value = '';
        titleInput.focus();
        submitBtn.disabled = false;

        // onCloseは呼ばない（フォーム維持）
    };

    submitBtn.onclick = submitAction;
    titleInput.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.isComposing) submitAction();
    };
}

async function handleAddTask(data) {
    try {
        await addTaskCompatibility(data);
    } catch (e) {
        console.error(e);
        showMessageModal({
            message: "タスクの追加に失敗した: " + (e.message || "不明なエラー"),
            type: 'error'
        });
    }
}