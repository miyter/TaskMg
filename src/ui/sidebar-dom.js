// @ts-nocheck
// @miyter:20251129
// DOM生成・イベントハンドラ・ドロップゾーン管理

import { updateTask } from '../store/store.js';
import { deleteProject } from '../store/projects.js';
import { showMessageModal } from './components.js';
import { showProjectModal } from './task-modal.js';
import { setCurrentFilter } from './ui-view-manager.js';
// 時間帯編集モーダルは sidebar.js 等でイベントリスナー設定時に呼ばれるか、
// renderer.js で右クリック時に呼ばれる想定ですが、ここでの import は不要な場合もあります。
// ただし依存関係として定義しておきます。

// ==========================================================
// サイドバー静的構造生成
// ==========================================================

/**
 * サイドバーの静的なDOM構造を生成する
 * プロジェクト、時間帯、所要時間、フィルターの各セクションを含む
 * @returns {string} サイドバーのHTML文字列
 */
export function buildSidebarHTML() {
    return `
        <nav class="space-y-1">
            <a href="#" id="nav-dashboard" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                ダッシュボード
            </a>
            <a href="#" id="nav-inbox" class="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors drop-target" data-type="inbox">
                <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                <span class="flex-1">インボックス</span>
                <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
            </a>
        </nav>

        <div class="mt-6 select-none">
            <!-- プロジェクトセクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="project-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">プロジェクト</h3>
                </div>
                <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="project-list" class="space-y-0.5 mb-4 pl-1"></ul>

            <!-- 時間帯ブロックセクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="timeblock-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">時間帯 (Time Blocks)</h3>
                </div>
                <!-- 編集ボタン -->
                <button id="edit-timeblocks-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700" title="編集">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </button>
            </div>
            <ul id="timeblock-list" class="space-y-0.5 mb-4 pl-1">
                <!-- 時間帯ブロックがここに描画される -->
            </ul>

            <!-- 所要時間セクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="duration-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">所要時間 (Duration)</h3>
                </div>
            </div>
            <ul id="duration-list" class="space-y-0.5 mb-4 pl-1">
                <!-- 所要時間固定リスト -->
            </ul>

            <!-- フィルターセクション -->
            <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="filter-list">
                <div class="flex items-center min-w-0">
                    <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">フィルター</h3>
                </div>
                <button id="add-filter-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg></button>
            </div>
            <ul id="filter-list" class="space-y-0.5 pl-1"></ul>
        </div>
    `;
}

/**
 * サイドバーの開閉トグル機能を設定する
 */
export function setupSidebarToggles() {
    document.querySelectorAll('.sidebar-section-header').forEach(header => {
        header.addEventListener('click', (e) => {
            // 追加ボタンのクリックなら折りたたみ処理をスキップ
            if (e.target.closest('button')) return;

            const targetId = header.dataset.target;
            const list = document.getElementById(targetId);
            const icon = header.querySelector('svg');

            if (list) {
                list.classList.toggle('hidden');
                
                // アイコンの回転 (開いている時は0度、閉じている時は-90度)
                if (list.classList.contains('hidden')) {
                    icon.style.transform = 'rotate(-90deg)';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });
}

// ==========================================================
// ドロップゾーン設定
// ==========================================================

export function setupDropZone(element, type, value = null) {
    if (!element) return;

    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
    });

    element.addEventListener('dragleave', () => {
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
    });

    element.addEventListener('drop', async (e) => {
        e.preventDefault();
        element.classList.remove('bg-blue-100', 'dark:bg-blue-900', 'ring-2', 'ring-blue-400');
        const taskId = e.dataTransfer.getData('text/plain');

        if (taskId) {
            try {
                if (type === 'inbox') {
                    await updateTask(taskId, { projectId: null });
                    showMessageModal("タスクをインボックスに戻しました");
                } else if (type === 'project' && value) {
                    await updateTask(taskId, { projectId: value });
                    showMessageModal("プロジェクトへ移動しました");
                } 
                // 時間帯へのドロップ
                else if (type === 'timeblock') {
                    // value が null (文字列の'null'や'unassigned') なら未定、それ以外はID
                    const timeBlockId = (value === 'unassigned' || value === null) ? null : value;
                    await updateTask(taskId, { timeBlockId: timeBlockId });
                    showMessageModal(timeBlockId ? "時間帯を設定しました" : "時間帯を未定にしました");
                }
                // 所要時間へのドロップ
                else if (type === 'duration' && value) {
                    const minutes = parseInt(value, 10);
                    await updateTask(taskId, { duration: minutes });
                    showMessageModal(`所要時間を ${minutes}分 に設定しました`);
                }
            } catch (error) {
                console.error("Drop Error:", error);
            }
        }
    });
}

// ==========================================================
// アイテム生成ヘルパー (リストアイテム)
// ==========================================================

/**
 * サイドバーのリストアイテム要素を作成する (汎用)
 * ※ renderer.js 等でHTML文字列を作って渡す方式にも対応可能
 * @param {string} name - アイテム名
 * @param {string} type - 'project' | 'timeblock' | 'duration' etc
 * @param {string} id - ID
 * @param {string} color - 色コード
 * @param {number} count - カウント数
 * @returns {HTMLElement} 作成されたli要素
 */
export function createSidebarItem(name, type, id, color, count) {
    const item = document.createElement('li');
    item.dataset.type = type;
    item.dataset.id = id;
    item.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target';

    let iconHtml = '';
    if (type === 'project') {
        iconHtml = `<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;
    } else {
        const colorStyle = color ? `background-color: ${color};` : 'background-color: #a0aec0;';
        iconHtml = `<span class="w-2.5 h-2.5 rounded-full mr-2.5 flex-shrink-0" style="${colorStyle}"></span>`;
    }

    const countHtml = count > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${count}</span>` : '';

    item.innerHTML = `
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            ${iconHtml}
            <span class="truncate">${name}</span>
        </div>
        <div class="flex items-center">
            ${countHtml}
        </div>
    `;

    return item;
}

// ==========================================================
// コンテキストメニュー (プロジェクト用)
// ==========================================================

/**
 * プロジェクトの右クリックメニューを表示する
 */
export function showItemContextMenu(e, type, itemData, allProjects) {
    // 時間帯の編集はモーダルで行うので、コンテキストメニューはプロジェクトのみ対象
    if (type !== 'project') return;

    document.getElementById('sidebar-context-menu')?.remove();

    const menu = document.createElement('div');
    menu.id = 'sidebar-context-menu';
    menu.className = 'fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-1 z-50 animate-fade-in text-sm min-w-[150px]';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;

    menu.innerHTML = `
        <button id="context-edit-btn" class="flex w-full justify-between items-center px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            編集
        </button>
        <button id="context-delete-btn" class="flex w-full justify-between items-center px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 transition">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            削除
        </button>
    `;

    document.body.appendChild(menu);

    // 編集ボタンのイベント
    document.getElementById('context-edit-btn').addEventListener('click', () => {
        menu.remove();
        showProjectModal(itemData, allProjects);
    });

    // 削除ボタンのイベント
    document.getElementById('context-delete-btn').addEventListener('click', () => {
        menu.remove();
        showMessageModal(`${itemData.name} を削除しますか？\n（関連するタスクのプロジェクト情報も削除されます）`, async () => {
            try {
                await deleteProject(itemData.id);
                setCurrentFilter({ type: 'inbox', id: null });
                showMessageModal(`${itemData.name} を削除しました。`);
            } catch (error) {
                console.error('Delete failed:', error);
                showMessageModal("削除に失敗しました。", 'error');
            }
        });
    });

    // 画面のどこかをクリックしたらメニューを閉じる
    const dismissMenu = (ev) => {
        if (!menu.contains(ev.target)) {
            menu.remove();
            document.removeEventListener('click', dismissMenu);
        }
    };
    setTimeout(() => {
        document.addEventListener('click', dismissMenu);
    }, 0);
}