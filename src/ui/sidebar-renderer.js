// @ts-nocheck
// サイドバーのレンダリングロジック

import { updateView, setCurrentFilter } from './ui-view-manager.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { createSidebarItem, showItemContextMenu } from './sidebar-components.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { showTimeBlockModal } from './timeblock-modal.js';
import { showMessageModal } from './components.js';

/**
 * インボックスのタスク数を更新する
 * @param {Array} allTasks - 全タスクデータ
 */
export function updateInboxCount(allTasks) {
    const inboxCountEl = document.getElementById('inbox-count');
    if (inboxCountEl) {
        const count = allTasks ? allTasks.filter(t => !t.projectId && t.status !== 'completed').length : 0;
        inboxCountEl.textContent = count;
        if (count > 0) inboxCountEl.classList.remove('hidden');
        else inboxCountEl.classList.add('hidden');
    }
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
        const item = createSidebarItem(proj.name, 'project', proj.id, null, count);
        
        item.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'project', id: proj.id } }));
        });
        
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'project', proj, { allProjects: projects });
        });
        
        setupDropZone(item, 'project', proj.id);
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
        const count = tasks ? tasks.filter(t => 
            String(t.timeBlockId) === String(block.id) && t.status !== 'completed'
        ).length : 0;
        
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

    const unassignedCount = tasks ? tasks.filter(t => (t.timeBlockId === null || t.timeBlockId === 'null') && t.status !== 'completed').length : 0;
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
        const count = tasks ? tasks.filter(t => Number(t.duration) === mins && t.status !== 'completed').length : 0;
        const item = createSidebarItem(`${mins} min`, 'duration', mins.toString(), null, count);
        
        const firstDiv = item.firstElementChild;
        if (firstDiv) {
            const colorSpan = firstDiv.querySelector('span[class*="w-2.5"]');
            if (colorSpan) colorSpan.remove();
            
            const clockIcon = document.createElement('span');
            clockIcon.className = 'mr-3 text-sm'; 
            clockIcon.textContent = '⏱️';
            firstDiv.insertBefore(clockIcon, firstDiv.firstChild);
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
        
        // アイコンを漏斗マークに差し替え
        const firstDiv = item.firstElementChild;
        if (firstDiv) {
            const colorSpan = firstDiv.querySelector('span[class*="w-2.5"]');
            if (colorSpan) colorSpan.remove();
            
            const iconHtml = `<svg class="mr-3 h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>`;
            firstDiv.insertAdjacentHTML('afterbegin', iconHtml);
        }

        item.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'custom', id: filter.id } }));
        });

        // 右クリックでコンテキストメニュー
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'filter', filter);
        });

        list.appendChild(item);
    });
}

/**
 * 全体の描画
 */
export function renderSidebarItems(sidebar, allTasks, allProjects, allLabels, allFilters = []) {
    if (!sidebar) return;
    
    renderProjects(allProjects, allTasks);
    renderTimeBlocks(allTasks);
    renderDurations(allTasks);
    renderFilters(allFilters);

    updateInboxCount(allTasks);
}