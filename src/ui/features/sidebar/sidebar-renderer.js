/**
 * サイドバーの各項目レンダリング制御
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { countActiveTasks } from './sidebar-utils.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { createSidebarItem, showItemContextMenu } from './sidebar-components.js';
import { getTimeBlocks } from '../../../store/timeblocks.js';
import { showTimeBlockModal } from '../timeblock/timeblock-modal.js';
import { updateSidebarProjects } from './SidebarProjects.js';
import { filterTasks } from '../../../logic/search.js';
import { showMessageModal } from '../../components.js';

/**
 * 更新日: 2025-12-27
 * 内容: サイドバー項目が表示されないバグを修正
 * - renderSidebarItems の早期 return を削除
 * - renderProjects に個別の null ガードを追加
 * - renderLabels の呼び出し漏れを修正
 */

export function updateInboxCount(allTasks) {
    const inboxCountEl = document.getElementById('inbox-count');
    if (!inboxCountEl) return;

    const count = countActiveTasks(allTasks, t => !t.projectId);
    inboxCountEl.textContent = count;
    inboxCountEl.classList.toggle('hidden', count === 0);
}

export function renderProjects(projects, tasks = []) {
    // 自身のリストIDが存在する場合のみ実行
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.PROJECTS);
    if (!list) return;
    updateSidebarProjects(projects, tasks);
}

export function renderLabels(labels = [], tasks = []) {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.LABELS);
    if (!list) return;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    labels.forEach(label => {
        const count = countActiveTasks(tasks, t => t.labelIds?.includes(label.id));
        const item = createSidebarItem(label.name, 'label', label.id, { color: label.color }, count);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'label', id: label.id } }));
        item.oncontextmenu = (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'label', label);
        };
        fragment.appendChild(item);
    });
    list.appendChild(fragment);
}

export function renderTimeBlocks(tasks = []) {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.TIMEBLOCKS);
    if (!list) return;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const blocks = getTimeBlocks();

    blocks.forEach(block => {
        const count = countActiveTasks(tasks, t => String(t.timeBlockId) === String(block.id));
        const displayName = `${block.start} - ${block.end}`;
        const item = createSidebarItem(displayName, 'timeblock', block.id, { color: block.color }, count);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: block.id } }));
        item.oncontextmenu = (e) => {
            e.preventDefault();
            showTimeBlockModal(block);
        };

        setupDropZone(item, 'timeblock', block.id);
        fragment.appendChild(item);
    });

    const unassignedCount = countActiveTasks(tasks, t => !t.timeBlockId || t.timeBlockId === 'null');
    const unassignedItem = createSidebarItem('未定', 'timeblock', 'unassigned', { color: '#a0aec0' }, unassignedCount);
    unassignedItem.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: 'unassigned' } }));
    setupDropZone(unassignedItem, 'timeblock', 'unassigned');
    fragment.appendChild(unassignedItem);

    list.appendChild(fragment);
}

export function renderDurations(tasks = []) {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.DURATIONS);
    if (!list) return;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const iconHtml = '<span class="mr-3 text-sm">⏱️</span>';
    SIDEBAR_CONFIG.DURATIONS.forEach(mins => {
        const count = countActiveTasks(tasks, t => Number(t.duration) === mins);
        const item = createSidebarItem(`${mins} min`, 'duration', mins.toString(), { iconHtml }, count);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'duration', id: mins.toString() } }));
        setupDropZone(item, 'duration', mins.toString());
        fragment.appendChild(item);
    });
    list.appendChild(fragment);
}

export function renderFilters(filters = [], tasks = []) {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.FILTERS);
    if (!list) return;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const iconHtml = `<svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>`;

    filters.forEach(filter => {
        let count = 0;
        try {
            if (typeof filterTasks === 'function') {
                const results = filterTasks(tasks, { savedFilter: filter, showCompleted: false });
                count = results.length;
            }
        } catch (e) {
            console.warn('[Sidebar] Filter count error:', e);
        }

        const item = createSidebarItem(filter.name, 'filter', filter.id, { iconHtml }, count);
        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'custom', id: filter.id } }));
        item.oncontextmenu = (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'filter', filter);
        };
        fragment.appendChild(item);
    });
    list.appendChild(fragment);
}

export function renderSidebarItems(sidebar, allTasks, allProjects, allLabels, allFilters = []) {
    // 以前の早期 return を削除し、各関数が独立して動作するように変更
    renderProjects(allProjects, allTasks);
    renderLabels(allLabels, allTasks); // 呼び出し漏れを修正
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    renderFilters(allFilters, allTasks);
    updateInboxCount(allTasks);
}