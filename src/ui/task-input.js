// @ts-nocheck
import { addTask, addTaskCompatibility } from '../store/store.js';
import { getProjects } from '../store/projects.js';
import { getTimeBlocks } from '../store/timeblocks.js'; // ★追加: 時間帯用
import { createGlassCard } from './components/glass-card.js';
import { showMessageModal } from './components.js';

let isInputExpanded = false; // インライン入力フォームの開閉状態を管理

/**
 * スタンドアロンのタスク入力フォームを描画する (検索ビューやダッシュボード用)
 */
export function renderTaskInput() {
    const projects = getProjects();
    const projectOptions = projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');

    // 入力フォームの中身
    const inputContentHTML = `
        <form id="task-form" class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
                <input 
                    type="text" 
                    id="task-title-input" 
                    class="flex-1 bg-transparent text-lg font-medium placeholder-gray-400 text-gray-800 dark:text-white border-none outline-none focus:ring-0 px-0"
                    placeholder="新しいタスクを追加..." 
                    autocomplete="off"
                >
            </div>
            
            <div class="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                <div class="flex items-center gap-2">
                    <!-- プロジェクト選択 -->
                    <div class="relative">
                        <select id="task-project-input" class="appearance-none bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md py-1.5 pl-2 pr-6 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="">インボックス</option>
                            ${projectOptions}
                        </select>
                        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-400">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    <!-- 期限日選択 -->
                    <div class="relative">
                        <input type="date" id="task-due-date-input" 
                            class="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md py-1 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                    </div>
                </div>

                <button 
                    type="submit" 
                    id="add-task-btn"
                    class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    追加
                </button>
            </div>
        </form>
    `;

    // コンテナID
    const container = document.getElementById('task-input-container');
    if (!container) return;

    // 共通GlassCardでラップして描画
    container.innerHTML = createGlassCard(inputContentHTML, 'p-4 mb-6');

    // イベントリスナー設定
    setupTaskInputEvents();
}

function setupTaskInputEvents() {
    const form = document.getElementById('task-form');
    const titleInput = document.getElementById('task-title-input');
    
    if (!form || !titleInput) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value.trim();
        if (!title) return;

        const projectId = document.getElementById('task-project-input').value || null;
        const dueDate = document.getElementById('task-due-date-input').value || null;

        try {
            await addTask(title, projectId, dueDate);
            
            // フォームリセット
            titleInput.value = '';
            document.getElementById('task-due-date-input').value = '';
            titleInput.focus();
        } catch (error) {
            console.error(error);
            showMessageModal('タスクの追加に失敗しました', 'error');
        }
    });
}

/**
 * インライン入力フォームを描画する (タスクリスト下部用)
 * @param {HTMLElement} container - 親要素
 * @param {string|null} projectId - 現在のプロジェクトID
 * @param {string|null} labelId - 現在のラベルID
 */
export function renderInlineInput(container, projectId, labelId) {
    if (!isInputExpanded) {
        // 閉じた状態: トリガーボタン
        container.innerHTML = `
            <div id="show-input-btn" class="flex items-center text-gray-500 hover:text-red-500 dark:hover:text-red-400 cursor-pointer py-2 px-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group select-none">
                <div class="w-6 h-6 mr-2 rounded-full text-red-500 flex items-center justify-center transition-transform group-hover:scale-110">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <div class="text-sm group-hover:text-red-600 dark:group-hover:text-red-400 font-medium">タスクを追加</div>
            </div>
        `;
        container.querySelector('#show-input-btn').addEventListener('click', () => {
            isInputExpanded = true;
            renderInlineInput(container, projectId, labelId);
        });
    } else {
        // 展開状態: 入力フォーム (Glassmorphism適用)
        
        // 時間帯の選択肢を生成
        const timeBlocks = getTimeBlocks();
        const timeBlockOptions = timeBlocks.map(tb => 
            `<option value="${tb.id}">${tb.start} - ${tb.end}</option>`
        ).join('');

        const formHTML = `
            <input type="text" id="inline-title-input" placeholder="タスク名 (例: 明日14時に会議 #仕事)" 
                     class="w-full text-sm font-semibold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-800 dark:text-gray-100 mb-2">
            
            <textarea id="inline-desc-input" placeholder="詳細メモ" rows="2"
                     class="w-full text-xs bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500 text-gray-600 dark:text-gray-300 mb-3 resize-none"></textarea>
            
            <div class="flex items-center justify-between border-t border-gray-100 dark:border-gray-700/50 pt-3">
                <div class="flex space-x-2">
                    <!-- 期限日ボタン（将来拡張用） -->
                    <button class="flex items-center px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600/50 transition">
                        <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        期限日
                    </button>
                    
                    <!-- 時間帯選択プルダウン -->
                    <div class="relative">
                        <select id="inline-timeblock-select" class="appearance-none pl-2 pr-6 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600/50 transition bg-transparent cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500">
                            <option value="">時間帯 (未定)</option>
                            ${timeBlockOptions}
                        </select>
                       <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500">
                            <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button id="cancel-input-btn" class="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded transition">キャンセル</button>
                    <button id="submit-task-btn" class="px-4 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed">
                        タスクを追加
                    </button>
                </div>
            </div>
        `;

        // 共通GlassCardを使用して描画
        container.innerHTML = createGlassCard(formHTML, 'p-3 animate-fade-in-down');
        
        const titleInput = container.querySelector('#inline-title-input');
        const descInput = container.querySelector('#inline-desc-input');
        const timeBlockSelect = container.querySelector('#inline-timeblock-select');
        const submitBtn = container.querySelector('#submit-task-btn');
        
        // 自動フォーカス
        titleInput.focus();

        // Enterキー送信
        titleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.isComposing) {
                e.preventDefault();
                if (titleInput.value.trim()) submitAction();
            }
        });

        // キャンセル
        container.querySelector('#cancel-input-btn').addEventListener('click', () => {
            isInputExpanded = false;
            renderInlineInput(container, projectId, labelId);
        });

        // 送信処理
        const submitAction = async () => {
            const title = titleInput.value.trim();
            const desc = (descInput && typeof descInput.value === 'string') ? descInput.value.trim() : '';
            const timeBlockId = timeBlockSelect.value;
            
            const taskData = {
                title,
                description: desc,
                dueDate: null, 
                projectId: projectId, 
                labelIds: labelId ? [labelId] : [],
                timeBlockId: timeBlockId || null
            };

            if (!title) return;

            submitBtn.disabled = true;
            submitBtn.textContent = '追加中...';

            try {
                // store.jsのaddTaskCompatibility(またはaddTask)を使用
                if (typeof addTaskCompatibility === 'function') {
                    await addTaskCompatibility(taskData);
                } else {
                    // フォールバック: 通常のaddTaskを使用 (詳細情報の一部が欠落する可能性あり)
                    await addTask(taskData.title, taskData.projectId, null);
                }
                
                // フォームをリセット（連続入力のため閉じない）
                titleInput.value = '';
                descInput.value = '';
                titleInput.focus();
                
                // フィードバック
                submitBtn.textContent = '追加しました';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'タスクを追加';
                }, 1000);
                
            } catch (e) {
                console.error(e);
                if (e.message !== 'Authentication required.') {
                    showMessageModal("タスクの追加に失敗しました", 'error');
                }
                submitBtn.disabled = false;
            }
        };
        submitBtn.addEventListener('click', submitAction);
    }
}