/**
 * サイドバーの各項目レンダリング制御
 */
import { getProcessedTasks } from '../../../logic/search';
import { getTimeBlocks } from '../../../store/timeblocks';
import { openModalDirect } from '../../../store/ui/modal-store';
import { createSidebarItem, showItemContextMenu } from './sidebar-components';
import { SIDEBAR_CONFIG } from './sidebar-constants';
// import { setupDropZone } from './sidebar-drag-drop'; // Removed for @dnd-kit migration
import { countActiveTasks, getSidebarDensity } from './sidebar-utils';
import { updateSidebarProjects } from './SidebarProjects';

import { getProjects } from '../../../store/projects-raw';
import { getTasks } from '../../../store/store-raw';
// import { getLabels } from '../../../store/labels-raw'; // Unused in JS code
import { getFilters } from '../../../store/filters';
import { Task, TimeBlock } from '../../../store/schema';

/**
 * 更新日: 2025-12-27
 * 内容: サイドバー項目が表示されないバグを修正
 * - renderSidebarItems の早期 return を削除
 * - renderProjects に個別の null ガードを追加
 * - renderLabels の呼び出し漏れを修正
 */

export function updateInboxCount() {
    const inboxCountEl = document.getElementById('inbox-count');
    if (!inboxCountEl) return;

    const allTasks = getTasks();
    const count = countActiveTasks(allTasks, (t: Task) => !t.projectId || t.projectId === 'null' || t.projectId === 'unassigned');
    inboxCountEl.textContent = String(count);
    inboxCountEl.classList.toggle('hidden', count === 0);
}

export function renderProjects() {
    // 自身のリストIDが存在する場合のみ実行
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.PROJECTS);
    if (!list) return;

    // SidebarProjects側の循環参照を避けるため、ここで取得して渡す
    const projects = getProjects();
    const tasks = getTasks();
    updateSidebarProjects(projects, tasks);
}

// export function renderLabels() { ... } // Removed

export function renderTimeBlocks() {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.TIMEBLOCKS);
    if (!list) return;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const blocks = getTimeBlocks().sort((a: TimeBlock, b: TimeBlock) => (a.order || 0) - (b.order || 0));
    const tasks = getTasks();
    const density = getSidebarDensity();

    blocks.forEach((block: TimeBlock) => {
        // 修正: 厳密な比較と型変換
        const count = countActiveTasks(tasks, (t: Task) => {
            // タスクのtimeBlockIdが 'null' 文字列として保存されているケースへの対応
            const tid = t.timeBlockId === 'null' ? null : t.timeBlockId;
            const bid = block.id;
            return tid === bid;
        });
        const displayName = `${block.start} - ${block.end} `;
        // block.id should be string, but schema says optional. Assuming it has id when retrieved.
        const blockId = block.id || '';
        const item = createSidebarItem(displayName, 'timeblock', blockId, { color: block.color }, count, density);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: blockId } }));
        item.oncontextmenu = (e) => {
            e.preventDefault();
            openModalDirect('timeblock-edit');
        };

        // setupDropZone(item, 'timeblock', blockId); // Removed for @dnd-kit migration
        fragment.appendChild(item);
    });

    const unassignedCount = countActiveTasks(tasks, (t: Task) => !t.timeBlockId || t.timeBlockId === 'null' || t.timeBlockId === 'unassigned');
    const unassignedItem = createSidebarItem('未定', 'timeblock', 'unassigned', { color: '#a0aec0' }, unassignedCount, density);
    unassignedItem.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: 'unassigned' } }));
    // setupDropZone(unassignedItem, 'timeblock', 'unassigned'); // Removed for @dnd-kit migration
    fragment.appendChild(unassignedItem);

    list.appendChild(fragment);
}

export function renderDurations() {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.DURATIONS);
    if (!list) return;
    list.innerHTML = '';

    const tasks = getTasks();
    const density = getSidebarDensity();

    const fragment = document.createDocumentFragment();
    const iconHtml = '<span class="mr-3 text-sm">⏱️</span>';
    SIDEBAR_CONFIG.DURATIONS.forEach(mins => {
        const count = countActiveTasks(tasks, (t: Task) => Number(t.duration) === mins);
        const item = createSidebarItem(`${mins} min`, 'duration', mins.toString(), { iconHtml }, count, density);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'duration', id: mins.toString() } }));
        // setupDropZone(item, 'duration', mins.toString()); // Removed for @dnd-kit migration
        fragment.appendChild(item);
    });
    list.appendChild(fragment);
}

export function renderFilters() {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.FILTERS);
    if (!list) return;
    list.innerHTML = '';

    const filters = getFilters();
    const tasks = getTasks();
    const density = getSidebarDensity();

    const fragment = document.createDocumentFragment();
    const iconHtml = `< svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill = "none" stroke = "currentColor" viewBox = "0 0 24 24" > <path stroke - linecap="round" stroke - linejoin="round" stroke - width="2" d = "M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" > </path></svg > `;

    filters.forEach(filter => {
        let count = 0;
        try {
            if (typeof getProcessedTasks === 'function') {
                const results = getProcessedTasks(tasks, { savedFilter: filter, showCompleted: false });
                count = results.length;
            }
        } catch (e) {
            console.warn('[Sidebar] Filter count error:', e);
        }

        // filter.id should be present
        const filterId = filter.id || '';
        const item = createSidebarItem(filter.name, 'filter', filterId, { iconHtml }, count, density);
        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'custom', id: filterId } }));
        item.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault();
            showItemContextMenu(e, 'filter', filter);
        };
        fragment.appendChild(item);
    });
    list.appendChild(fragment);
}

export function renderSidebarItems() {
    // データは各レンダラー内で同期的に取得する方式に変更
    renderProjects();
    // renderLabels(); // Removed
    renderTimeBlocks();
    renderDurations();
    renderFilters();
    updateInboxCount();
}
