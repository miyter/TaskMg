// @ts-nocheck
// @miyter:20251221
// サイドバーの各パーツを描画する純粋なレンダラー

import { setupDropZone } from './sidebar-drag-drop.js';
import { createSidebarItem, showItemContextMenu } from './sidebar-components.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { showTimeBlockModal } from './timeblock-modal.js';
import { updateSidebarProjects } from './components/SidebarProjects.js';

/**
 * インボックスのカウント更新
 */
export function updateInboxCount(allTasks) {
    const inboxCountEl = document.getElementById('inbox-count');
    if (!inboxCountEl) return;
    
    const count = allTasks.filter(t => !t.projectId && t.status !== 'completed').length;
    inboxCountEl.textContent = count;
    inboxCountEl.classList.toggle('hidden', count === 0);
}

/**
 * プロジェクトリスト描画 (SidebarProjectsコンポーネントへ委譲)
 */
export function renderProjects(projects, tasks = []) {
    updateSidebarProjects(projects, tasks);
}

/**
 * ラベルリストを描画
 */
export function renderLabels(labels = [], tasks = []) {
    const list = document.getElementById('label-list');
    if (!list) return;
    list.innerHTML = '';

    labels.forEach(label => {
        const count = tasks.filter(t => t.labelIds?.includes(label.id) && t.status !== 'completed').length;
        const item = createSidebarItem(label.name, 'label', label.id, label.color, count);
        
        item.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'label', id: label.id } }));
        });
        
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'label', label);
        });

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

    blocks.forEach(block => {
        const count = tasks.filter(t => 
            String(t.timeBlockId) === String(block.id) && t.status !== 'completed'
        ).length;
        
        const displayName = `${block.start} - ${block.end}`;
        const item = createSidebarItem(displayName, 'timeblock', block.id, block.color, count);
        
        item.addEventListener('click', () => {
             document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: block.id } }));
        });
        
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showTimeBlockModal();
        });

        setupDropZone(item, 'timeblock', block.id);
        list.appendChild(item);
    });

    const unassignedCount = tasks.filter(t => (t.timeBlockId === null || t.timeBlockId === 'null') && t.status !== 'completed').length;
    const unassignedItem = createSidebarItem('未定', 'timeblock', 'unassigned', '#a0aec0', unassignedCount);
    
    unassignedItem.addEventListener('click', () => {
        document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: 'unassigned' } }));
    });
    
    setupDropZone(unassignedItem, 'timeblock', 'unassigned');
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
        const count = tasks.filter(t => Number(t.duration) === mins && t.status !== 'completed').length;
        const item = createSidebarItem(`${mins} min`, 'duration', mins.toString(), null, count);
        
        const content = item.firstElementChild;
        if (content) {
            const dot = content.querySelector('span[class*="w-2.5"]');
            if (dot) dot.remove();
            
            const icon = document.createElement('span');
            icon.className = 'mr-3 text-sm'; 
            icon.textContent = '⏱️';
            content.insertBefore(icon, content.firstChild);
        }

        item.addEventListener('click', () => {
             document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'duration', id: mins.toString() } }));
        });

        setupDropZone(item, 'duration', mins.toString());
        list.appendChild(item);
    });
}

/**
 * カスタムフィルターを描画
 */
export function renderFilters(filters = []) {
    const list = document.getElementById('filter-list');
    if (!list) return;
    list.innerHTML = '';

    filters.forEach(filter => {
        const item = createSidebarItem(filter.name, 'filter', filter.id, null, 0);
        
        const content = item.firstElementChild;
        if (content) {
            const dot = content.querySelector('span[class*="w-2.5"]');
            if (dot) dot.remove();
            
            const iconHtml = `<svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>`;
            content.insertAdjacentHTML('afterbegin', iconHtml);
        }

        item.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'custom', id: filter.id } }));
        });

        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'filter', filter);
        });

        list.appendChild(item);
    });
}

/**
 * サイドバー全体の描画
 */
export function renderSidebarItems(sidebar, allTasks, allProjects, allLabels, allFilters = []) {
    if (!document.getElementById('project-list')) return;
    
    renderProjects(allProjects, allTasks);
    renderLabels(allLabels, allTasks);
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    renderFilters(allFilters);
    updateInboxCount(allTasks);
}