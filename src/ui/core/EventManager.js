// @ts-nocheck
// グローバルイベントリスナーの管理

import { auth } from '../../core/firebase.js';
import { setCurrentFilter } from '../ui-view-manager.js';
import { startAllSubscriptions, stopDataSync, updateUI } from './DataSyncManager.js';

/**
 * グローバルイベントリスナーを設定する
 */
export function setupGlobalEventListeners() {
    // ワークスペース切り替えイベント
    document.addEventListener('workspace-changed', (e) => {
        const newWorkspaceId = e.detail.workspaceId;
        console.log('Workspace changed to:', newWorkspaceId);
        
        const headerTitle = document.getElementById('header-title');
        if (headerTitle) headerTitle.textContent = '読み込み中...';
        
        if (auth && auth.currentUser) {
            stopDataSync(false); // workspaceの購読は維持
            startAllSubscriptions();
            updateUI();
        }
    });

    // サイドバーからのルーティング変更イベント
    document.addEventListener('route-change', (e) => {
        setCurrentFilter({ type: e.detail.page, id: e.detail.id });
        
        localStorage.setItem('lastPage', JSON.stringify({ 
            page: e.detail.page, 
            id: e.detail.id || null 
        }));

        updateUI();
    });
    
    document.getElementById('search-input')?.addEventListener('input', updateUI);
    
    document.getElementById('toggle-completed-btn')?.addEventListener('click', (e) => {
        e.currentTarget.classList.toggle('text-blue-500');
        updateUI();
    });
    
    setupCustomSortDropdown();
}

/**
 * カスタムソートドロップダウンのイベントロジックを設定する
 */
function setupCustomSortDropdown() {
    const trigger = document.getElementById('sort-trigger');
    const menu = document.getElementById('sort-menu');
    const label = document.getElementById('sort-label');
    const options = document.querySelectorAll('.sort-option');

    if (!trigger || !menu || !label) return;
    
    const closeMenu = (e) => {
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) {
            return;
        }
        toggleMenu(false);
    };
    
    const toggleMenu = (open) => {
        if (open) {
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu); 
        } else {
            menu.classList.replace('opacity-100', 'opacity-0');
            menu.classList.replace('visible', 'invisible');
            menu.classList.replace('scale-100', 'scale-95');
            menu.classList.replace('pointer-events-auto', 'pointer-events-none');
            document.removeEventListener('click', closeMenu);
        }
    };

    trigger.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const isOpen = menu.classList.contains('opacity-100');
        toggleMenu(!isOpen);
    });
    
    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const value = option.dataset.value;
            const text = option.textContent;
            label.textContent = text;
            trigger.dataset.value = value;
            updateUI(); 
            toggleMenu(false);
        });
    });

    if (!trigger.dataset.value) {
        trigger.dataset.value = 'createdAt_desc';
        label.textContent = "作成日(新しい順)";
    }
}