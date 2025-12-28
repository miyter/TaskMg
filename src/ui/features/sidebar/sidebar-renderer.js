/**
 * サイドバーの各項目レンダリング制御
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { countActiveTasks, getSidebarDensity } from './sidebar-utils.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { createSidebarItem, showItemContextMenu } from './sidebar-components.js';
import { getTimeBlocks } from '../../../store/timeblocks.js';
import { showTimeBlockModal } from '../timeblock/timeblock-modal.js';
import { updateSidebarProjects } from './SidebarProjects.js';
import { filterTasks } from '../../../logic/search.js';
import { showMessageModal } from '../../components.js';

import { getTasks } from '../../../store/store-raw.js';
import { getProjects } from '../../../store/projects-raw.js';
import { getLabels } from '../../../store/labels-raw.js';
import { getFilters } from '../../../store/filters.js';

// ... (renderProjects delegates to updateSidebarProjects which we updated) ...

export function renderTimeBlocks() {
    const list = document.getElementById(SIDEBAR_CONFIG.LIST_IDS.TIMEBLOCKS);
    if (!list) return;
    list.innerHTML = '';

    const fragment = document.createDocumentFragment();
    const blocks = getTimeBlocks().sort((a, b) => (a.order || 0) - (b.order || 0));
    const tasks = getTasks();
    const density = getSidebarDensity();

    blocks.forEach(block => {
        const count = countActiveTasks(tasks, t => String(t.timeBlockId) === String(block.id));
        const displayName = `${block.start} - ${block.end}`;
        const item = createSidebarItem(displayName, 'timeblock', block.id, { color: block.color }, count, density);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: block.id } }));
        item.oncontextmenu = (e) => {
            e.preventDefault();
            showTimeBlockModal(block);
        };

        setupDropZone(item, 'timeblock', block.id);
        fragment.appendChild(item);
    });

    const unassignedCount = countActiveTasks(tasks, t => !t.timeBlockId || t.timeBlockId === 'null');
    const unassignedItem = createSidebarItem('未定', 'timeblock', 'unassigned', { color: '#a0aec0' }, unassignedCount, density);
    unassignedItem.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: 'unassigned' } }));
    setupDropZone(unassignedItem, 'timeblock', 'unassigned');
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
        const count = countActiveTasks(tasks, t => Number(t.duration) === mins);
        const item = createSidebarItem(`${mins} min`, 'duration', mins.toString(), { iconHtml }, count, density);

        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'duration', id: mins.toString() } }));
        setupDropZone(item, 'duration', mins.toString());
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
    const iconHtml = `<svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>`;

    filters.forEach(filter => {
        // ... (filter logic unchanged) ...
        let count = 0;
        try {
            if (typeof filterTasks === 'function') {
                const results = filterTasks(tasks, { savedFilter: filter, showCompleted: false });
                count = results.length;
            }
        } catch (e) {
            console.warn('[Sidebar] Filter count error:', e);
        }

        const item = createSidebarItem(filter.name, 'filter', filter.id, { iconHtml }, count, density);
        item.onclick = () => document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'custom', id: filter.id } }));
        item.oncontextmenu = (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'filter', filter);
        };
        fragment.appendChild(item);
    });
    list.appendChild(fragment);
}

export function renderSidebarItems() {
    renderProjects();
    renderTimeBlocks();
    renderDurations();
    renderFilters();
    updateInboxCount();
}