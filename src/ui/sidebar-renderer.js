// @ts-nocheck
// @miyter:20251129

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { setupDropZone, showItemContextMenu } from './sidebar-dom.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { showTimeBlockModal } from './timeblock-modal.js';

// DOM生成ヘルパー
function createListItem(html, type, id, onClick, onContextMenu) {
    const li = document.createElement('li');
    li.className = 'group flex items-center justify-between px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors drop-target';
    li.dataset.type = type;
    li.dataset.id = id;
    li.innerHTML = html;
    
    if (onClick) li.addEventListener('click', onClick);
    if (onContextMenu) li.addEventListener('contextmenu', onContextMenu);
    
    // ドロップゾーン設定
    setupDropZone(li, type, id);
    
    return li;
}

/**
 * プロジェクトリストを描画
 */
export function renderProjects(projects, tasks = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;
        const iconHtml = `<svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`;
        const countHtml = count > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${count}</span>` : '';

        const html = `
            <div class="flex items-center flex-1 min-w-0 pointer-events-none">
                ${iconHtml}
                <span class="truncate">${proj.name}</span>
            </div>
            <div class="flex items-center">${countHtml}</div>
        `;

        const item = createListItem(html, 'project', proj.id, 
            () => {
                setCurrentFilter({ type: 'project', id: proj.id });
                updateView(tasks, projects, []);
            },
            (e) => {
                e.preventDefault();
                showItemContextMenu(e, 'project', proj, projects);
            }
        );
        list.appendChild(item);
    });
}

/**
 * 時間帯ブロックを描画
 */
export function renderTimeBlocks(tasks = []) {
    const list = document.getElementById('timeblock-list');
    if (!list) return;
    list.innerHTML = '';

    const blocks = getTimeBlocks();

    // カスタムブロック
    blocks.forEach(block => {
        // timeBlockId でフィルタリング
        const count = tasks ? tasks.filter(t => t.timeBlockId === block.id && t.status !== 'completed').length : 0;
        
        const html = `
            <div class="flex items-center flex-1 min-w-0 pointer-events-none">
                <span class="w-3 h-3 rounded-full mr-3 flex-shrink-0" style="background-color: ${block.color};"></span>
                <span class="truncate">${block.name}</span>
                <span class="ml-2 text-xs text-gray-400 font-normal">(${block.start}-${block.end})</span>
            </div>
            <div class="flex items-center">
                ${count > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${count}</span>` : ''}
            </div>
        `;

        const item = createListItem(html, 'timeblock', block.id,
            () => {
                // フィルタリング機能は未実装だが、クリック時のアクションとして定義
                console.log('Filter by timeblock:', block.id);
            },
            (e) => {
                e.preventDefault();
                // 右クリックで編集モーダルを開く
                showTimeBlockModal();
            }
        );
        list.appendChild(item);
    });

    // 固定「未定」ブロック
    const unassignedCount = tasks ? tasks.filter(t => t.timeBlockId === null && t.status !== 'completed').length : 0;
    const unassignedHtml = `
        <div class="flex items-center flex-1 min-w-0 pointer-events-none">
            <span class="w-3 h-3 rounded-full mr-3 flex-shrink-0 bg-gray-300 dark:bg-gray-600"></span>
            <span class="truncate text-gray-500 dark:text-gray-400">未定</span>
        </div>
        <div class="flex items-center">
             ${unassignedCount > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${unassignedCount}</span>` : ''}
        </div>
    `;
    // IDは 'unassigned' とする
    const unassignedItem = createListItem(unassignedHtml, 'timeblock', 'unassigned', null, null);
    list.appendChild(unassignedItem);
}

/**
 * 所要時間リストを描画
 */
export function renderDurations(tasks = []) {
    const list = document.getElementById('duration-list');
    if (!list) return;
    list.innerHTML = '';

    const durations = [30, 45, 60, 75, 90];

    durations.forEach(mins => {
        const count = tasks ? tasks.filter(t => t.duration === mins && t.status !== 'completed').length : 0;
        
        const html = `
            <div class="flex items-center flex-1 min-w-0 pointer-events-none">
                <span class="mr-3 text-lg">⏱️</span>
                <span class="truncate">${mins} min</span>
            </div>
            <div class="flex items-center">
                 ${count > 0 ? `<span class="text-xs text-gray-400 font-light mr-2">${count}</span>` : ''}
            </div>
        `;

        const item = createListItem(html, 'duration', mins.toString(), null, null);
        list.appendChild(item);
    });
}

/**
 * 全体の描画
 */
export function renderSidebarItems(sidebar, allTasks, allProjects, allLabels) {
    if (!sidebar) return;
    
    renderProjects(allProjects, allTasks);
    // renderLabels は廃止
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);

    // インボックスカウント更新
    const inboxCountEl = document.getElementById('inbox-count');
    if (inboxCountEl) {
        const count = allTasks ? allTasks.filter(t => !t.projectId && t.status !== 'completed').length : 0;
        inboxCountEl.textContent = count;
        if (count > 0) inboxCountEl.classList.remove('hidden');
        else inboxCountEl.classList.add('hidden');
    }
}