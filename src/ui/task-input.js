/**
 * タスク入力フォーム (スタンドアロンおよびインライン)
 */
import { addTaskCompatibility } from '../store/store.js';
import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { createGlassCard } from './components/glass-card.js';
import { showMessageModal } from './components.js';
import { UI_STYLES } from './core/ui-style-constants.js';

/**
 * スタンドアロン入力フォーム (検索/ダッシュボード用)
 */
export function renderTaskInput() {
    const container = document.getElementById('task-input-container');
    if (!container) return;

    const projects = getProjects();
    const html = buildStandaloneFormHTML(projects);

    container.innerHTML = createGlassCard(html, 'p-4 mb-6');
    setupStandaloneEvents();
}

/**
 * インライン入力フォーム (タスクリスト下部)
 */
export function renderInlineInput(container, projectId, labelId, options = {}) {
    const isExpanded = options.forceExpand || container.dataset.expanded === 'true';

    if (!isExpanded) {
        container.innerHTML = buildInlineButtonHTML();
        container.querySelector('#show-input-btn').onclick = () => {
            container.dataset.expanded = 'true';
            renderInlineInput(container, projectId, labelId, options);
        };
        return;
    }

    const timeBlocks = getTimeBlocks();
    const html = buildInlineFormHTML(timeBlocks);

    container.innerHTML = createGlassCard(html, 'p-3 animate-fade-in-down');
    setupInlineEvents(container, projectId, labelId, options);
}

/**
 * 画面下部固定のタスク追加バーを描画（ボタンのみ）
 */
export function renderFixedAddTaskBar(footerContainer, inputContainer, projectId, labelId) {
    footerContainer.innerHTML = buildFixedButtonHTML();

    // ボタンクリックでタスクモーダルを開く
    footerContainer.querySelector('#fixed-add-task-btn').onclick = () => {
        // タスクモーダルを開く（新規作成モード）
        import('./modals/task-modal.js').then(({ showTaskModal }) => {
            showTaskModal(null, {
                projectId: projectId || null,
                labelIds: labelId ? [labelId] : []
            });
        });
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

/**
 * --- Helper Functions (HTML Generators) ---
 */

function buildStandaloneFormHTML(projects) {
    const projectOptions = projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    return `
        <form id="task-form" class="flex flex-col gap-3">
            <input type="text" id="task-title-input" 
                class="${UI_STYLES.INPUT.GLASSCARD_TITLE}"
                placeholder="新しいタスクを追加..." autocomplete="off">
            
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <div class="flex items-center gap-2">
                    <select id="task-project-input" class="${UI_STYLES.SELECT.DEFAULT}">
                        <option value="">インボックス</option>
                        ${projectOptions}
                    </select>
                    <input type="date" id="task-due-date-input" class="${UI_STYLES.SELECT.DEFAULT.replace('py-1.5', 'py-1')}">
                </div>
                <button type="submit" class="${UI_STYLES.BUTTON.PRIMARY}">追加</button>
            </div>
        </form>
    `;
}

function buildInlineButtonHTML() {
    return `
        <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer py-2 px-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition group select-none">
            <div class="w-6 h-6 mr-2 rounded-full text-indigo-500 dark:text-indigo-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </div>
            <div class="text-sm font-medium">タスクを追加</div>
        </div>
    `;
}

function buildInlineFormHTML(timeBlocks) {
    const timeBlockOptions = timeBlocks.map(tb => `<option value="${tb.id}">${tb.start} - ${tb.end}</option>`).join('');
    return `
        <div class="flex flex-col gap-2">
            <input type="text" id="inline-title-input" placeholder="タスク名" class="${UI_STYLES.INPUT.MINIMAL_TEXT}">
            <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2" class="${UI_STYLES.INPUT.MINIMAL_TEXTAREA}"></textarea>
            
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <select id="inline-timeblock-select" class="${UI_STYLES.SELECT.TRANSPARENT}">
                    <option value="">時間帯 (未定)</option>
                    ${timeBlockOptions}
                </select>
                <div class="flex gap-2">
                    <button id="cancel-input-btn" class="${UI_STYLES.BUTTON.CANCEL}">キャンセル</button>
                    <button id="submit-task-btn" class="${UI_STYLES.BUTTON.PRIMARY}">タスクを追加</button>
                </div>
            </div>
        </div>
    `;
}

function buildFixedButtonHTML() {
    return `
        <button id="fixed-add-task-btn" class="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all active:scale-95">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span class="font-bold text-sm">タスクを追加</span>
        </button>
    `;
}