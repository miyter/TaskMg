// @ts-nocheck
// @miyter:20251129

import { updateView, setCurrentFilter } from './ui-view-manager.js';
// 分割されたモジュールからインポート
import { setupDropZone } from './sidebar-drag-drop.js';
import { createSidebarItem, showItemContextMenu } from './sidebar-components.js';
import { getTimeBlocks } from '../store/timeblocks.js';
import { showTimeBlockModal } from './timeblock-modal.js';

/**
 * プロジェクトリストを描画
 */
export function renderProjects(projects, tasks = []) {
    const list = document.getElementById('project-list');
    if (!list) return;
    list.innerHTML = '';

    projects.forEach(proj => {
        // 未完了タスクをカウント
        const count = tasks ? tasks.filter(t => t.projectId === proj.id && t.status !== 'completed').length : 0;

        // リストアイテム生成
        const item = createSidebarItem(proj.name, 'project', proj.id, null, count);
        
        // クリックイベント: フィルタリング
        item.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'project', id: proj.id } }));
        });
        
        // 右クリックイベント: コンテキストメニュー
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'project', proj, projects);
        });
        
        // ドロップゾーン設定
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

    // カスタムブロック
    blocks.forEach(block => {
        // タスク数をカウント
        const count = tasks ? tasks.filter(t => 
            String(t.timeBlockId) === String(block.id) && t.status !== 'completed'
        ).length : 0;
        
        const item = createSidebarItem(block.name, 'timeblock', block.id, block.color, count);
        
        // 時間帯の補足情報 (開始-終了) を名前の後ろに追加
        const nameSpan = item.querySelector('.truncate');
        if (nameSpan) {
             nameSpan.innerHTML = `${block.name} <span class="text-xs text-gray-400 font-normal ml-1">(${block.start}-${block.end})</span>`;
        }

        // クリックイベント: フィルタリング
        item.addEventListener('click', () => {
             document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'timeblock', id: block.id } }));
        });
        
        // 右クリックイベント: 編集モーダル
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showTimeBlockModal();
        });

        setupDropZone(item, 'timeblock', block.id);
        list.appendChild(item);
    });

    // 固定「未定」ブロック
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
        // タスク数をカウント
        const count = tasks ? tasks.filter(t => Number(t.duration) === mins && t.status !== 'completed').length : 0;
        
        // createSidebarItemは色アイコン(丸)を生成してしまうため、アイコン部分を時計マークに差し替える
        const item = createSidebarItem(`${mins} min`, 'duration', mins.toString(), null, count);
        
        const firstDiv = item.firstElementChild;
        if (firstDiv) {
            // 色アイコン(span)を削除
            const colorSpan = firstDiv.querySelector('span[class*="w-2.5"]');
            if (colorSpan) colorSpan.remove();
            
            // 時計アイコン挿入
            const clockIcon = document.createElement('span');
            clockIcon.className = 'mr-3 text-lg';
            clockIcon.textContent = '⏱️';
            firstDiv.insertBefore(clockIcon, firstDiv.firstChild);
        }

        // クリックイベント
        item.addEventListener('click', () => {
             document.dispatchEvent(new CustomEvent('route-change', { detail: { page: 'duration', id: mins.toString() } }));
        });

        setupDropZone(item, 'duration', mins.toString());
        list.appendChild(item);
    });
}

/**
 * 全体の描画
 */
export function renderSidebarItems(sidebar, allTasks, allProjects, allLabels) {
    if (!sidebar) return;
    
    renderProjects(allProjects, allTasks);
    // renderLabels は廃止済み
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