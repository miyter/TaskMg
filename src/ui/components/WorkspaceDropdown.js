// @ts-nocheck
// ワークスペース切り替えドロップダウンのロジック

import { setCurrentWorkspaceId, getCurrentWorkspaceId } from '../../store/workspace.js';
import { showSettingsModal } from '../settings.js';
import { showWorkspaceModal } from '../modal/workspace-modal.js';
// 右クリックメニュー用関数をインポート
import { showItemContextMenu } from '../sidebar-components.js';

// モジュールスコープでDOM要素や状態を保持
let menuEl = null;
let triggerEl = null;

/**
 * ドロップダウンメニューを閉じる
 */
function closeMenu() {
    if (!menuEl) return;
    menuEl.classList.replace('opacity-100', 'opacity-0');
    menuEl.classList.replace('visible', 'invisible');
    menuEl.classList.replace('scale-100', 'scale-95');
    menuEl.classList.replace('pointer-events-auto', 'pointer-events-none');
    // リスナー解除は document 側で行うためここではクラス操作のみ
}

/**
 * ワークスペースドロップダウンの機能を初期化する
 * 注: データ購読は行わず、イベント設定のみ行う
 */
export function initWorkspaceDropdown() {
    triggerEl = document.getElementById('workspace-trigger');
    menuEl = document.getElementById('workspace-menu');
    const addBtn = document.getElementById('add-workspace-btn');
    const settingsBtn = document.getElementById('settings-workspace-btn');

    if (!triggerEl || !menuEl) return;

    // --- 開閉ロジック ---
    const handleOutsideClick = (e) => {
        if (e && (menuEl.contains(e.target) || triggerEl.contains(e.target)) && !e.target.closest('button.workspace-option')) {
            return;
        }
        closeMenu();
        document.removeEventListener('click', handleOutsideClick);
    };

    const toggleMenu = () => {
        const isOpen = menuEl.classList.contains('opacity-100');
        if (isOpen) {
            closeMenu();
            document.removeEventListener('click', handleOutsideClick);
        } else {
            menuEl.classList.replace('opacity-0', 'opacity-100');
            menuEl.classList.replace('invisible', 'visible');
            menuEl.classList.replace('scale-95', 'scale-100');
            menuEl.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', handleOutsideClick);
        }
    };

    triggerEl.onclick = (e) => {
        e.stopPropagation();
        toggleMenu();
    };

    // --- アクションボタン ---
    if (addBtn) {
        addBtn.onclick = () => {
            closeMenu();
            // 新規作成モードで呼び出し
            showWorkspaceModal(null);
        };
    }

    if (settingsBtn) {
        settingsBtn.onclick = () => {
            closeMenu();
            showSettingsModal();
        };
    }
}

/**
 * 外部からデータを渡してドロップダウンUIを更新する
 * (AppInitializerなどで認証完了後に呼び出す)
 * @param {Array} workspaces 
 */
export function updateWorkspaceDropdownUI(workspaces) {
    const listContainer = document.getElementById('workspace-list');
    const label = document.getElementById('workspace-label');

    if (listContainer) {
        renderWorkspaceMenu(workspaces, listContainer);
    }
    if (label) {
        updateCurrentLabel(workspaces, label);
    }
}

// 内部関数: メニュー項目のレンダリング
function renderWorkspaceMenu(workspaces, container) {
    container.innerHTML = '';
    const currentId = getCurrentWorkspaceId();

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
            ${isCurrent ? '<svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
        `;
        
        // 左クリック: ワークスペース切り替え
        btn.addEventListener('click', () => {
            if (!isCurrent) {
                setCurrentWorkspaceId(ws.id);
            }
            closeMenu();
        });

        // 右クリック: コンテキストメニュー表示 (編集・削除)
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            showItemContextMenu(e, 'workspace', ws);
        });
        
        container.appendChild(btn);
    });
}

// 内部関数: ラベルの更新
function updateCurrentLabel(workspaces, labelEl) {
    const currentId = getCurrentWorkspaceId();
    const currentWs = workspaces.find(w => w.id === currentId);
    
    if (currentWs) {
        labelEl.textContent = currentWs.name;
        labelEl.classList.remove('text-gray-400');
    } else {
        labelEl.textContent = "ワークスペース";
        labelEl.classList.add('text-gray-400');
    }
}