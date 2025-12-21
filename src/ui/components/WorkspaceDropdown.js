// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 断片化していたコードの修復とUI同期の安定化
 */

import { setCurrentWorkspaceId, getCurrentWorkspaceId, getWorkspaces } from '../../store/workspace.js';
import { showSettingsModal } from '../settings.js';
import { showWorkspaceModal } from '../modal/workspace-modal.js';
import { showItemContextMenu } from '../sidebar-components.js';

const CLASSES = {
    MENU_VISIBLE: ['opacity-100', 'visible', 'scale-100', 'pointer-events-auto'],
    MENU_INVISIBLE: ['opacity-0', 'invisible', 'scale-95', 'pointer-events-none']
};

let menuEl = null;
let triggerEl = null;

/**
 * メニューの表示制御
 */
function setMenuVisible(visible) {
    if (!menuEl) return;
    
    if (visible) {
        menuEl.classList.remove(...CLASSES.MENU_INVISIBLE);
        menuEl.classList.add(...CLASSES.MENU_VISIBLE);
        document.addEventListener('click', handleOutsideClick);
    } else {
        menuEl.classList.remove(...CLASSES.MENU_VISIBLE);
        menuEl.classList.add(...CLASSES.MENU_INVISIBLE);
        document.removeEventListener('click', handleOutsideClick);
    }
}

const handleOutsideClick = (e) => {
    if (menuEl && !menuEl.contains(e.target) && !triggerEl.contains(e.target)) {
        setMenuVisible(false);
    }
};

/**
 * ドロップダウンの初期化
 */
export function initWorkspaceDropdown() {
    triggerEl = document.getElementById('workspace-trigger');
    menuEl = document.getElementById('workspace-menu');
    const addBtn = document.getElementById('add-workspace-btn');
    const settingsBtn = document.getElementById('settings-workspace-btn');

    if (!triggerEl || !menuEl) return;

    triggerEl.onclick = (e) => {
        e.stopPropagation();
        const isOpen = menuEl.classList.contains('opacity-100');
        setMenuVisible(!isOpen);
    };

    if (addBtn) addBtn.onclick = () => { setMenuVisible(false); showWorkspaceModal(null); };
    if (settingsBtn) settingsBtn.onclick = () => { setMenuVisible(false); showSettingsModal(); };

    // ワークスペース変更時にUIを即座に再描画
    document.addEventListener('workspace-changed', () => {
        updateWorkspaceDropdownUI(getWorkspaces());
    });
}

/**
 * UIの更新（ラベルとメニューリスト）
 */
export function updateWorkspaceDropdownUI(workspaces) {
    const listContainer = document.getElementById('workspace-list');
    const label = document.getElementById('workspace-label');
    const currentId = getCurrentWorkspaceId();

    if (listContainer) {
        renderWorkspaceMenu(workspaces, listContainer, currentId);
    }
    
    if (label) {
        const currentWs = workspaces.find(w => w.id === currentId);
        label.textContent = currentWs ? currentWs.name : "ワークスペース";
        label.classList.toggle('text-gray-400', !currentWs);
    }
}

/**
 * メニュー項目のレンダリング
 */
function renderWorkspaceMenu(workspaces, container, currentId) {
    container.innerHTML = '';

    workspaces.forEach(ws => {
        const isCurrent = ws.id === currentId;
        const btn = document.createElement('button');
        
        btn.className = `workspace-option w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
            isCurrent 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`;
        
        btn.innerHTML = `
            <span class="truncate pointer-events-none">${ws.name}</span>
            ${isCurrent ? `
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            ` : ''}
        `;
        
        btn.onclick = () => {
            if (!isCurrent) setCurrentWorkspaceId(ws.id);
            setMenuVisible(false);
        };

        btn.oncontextmenu = (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'workspace', ws);
        };
        
        container.appendChild(btn);
    });
}