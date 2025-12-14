// @ts-nocheck
// ワークスペース切り替えドロップダウンのロジック

import { subscribeToWorkspaces, setCurrentWorkspaceId, getCurrentWorkspaceId } from '../../store/workspace.js';
import { showSettingsModal } from '../settings.js';
import { showWorkspaceModal } from '../modal/workspace-modal.js';

/**
 * ワークスペースドロップダウンの機能を初期化する
 */
export function initWorkspaceDropdown() {
    const trigger = document.getElementById('workspace-trigger');
    const menu = document.getElementById('workspace-menu');
    const label = document.getElementById('workspace-label');
    const listContainer = document.getElementById('workspace-list');
    const addBtn = document.getElementById('add-workspace-btn');
    const settingsBtn = document.getElementById('settings-workspace-btn');

    if (!trigger || !menu) return;

    // --- 開閉ロジック ---
    const closeMenu = (e) => {
        // メニュー内クリック、トリガークリックの場合は無視（ただし項目クリックは別途閉じる）
        if (e && (menu.contains(e.target) || trigger.contains(e.target)) && !e.target.closest('button.workspace-option')) {
            return;
        }
        menu.classList.replace('opacity-100', 'opacity-0');
        menu.classList.replace('visible', 'invisible');
        menu.classList.replace('scale-100', 'scale-95');
        menu.classList.replace('pointer-events-auto', 'pointer-events-none');
        document.removeEventListener('click', closeMenu);
    };

    const toggleMenu = () => {
        const isOpen = menu.classList.contains('opacity-100');
        if (isOpen) {
            closeMenu();
        } else {
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu);
        }
    };

    // 既存のリスナー重複を防ぐため、クローンして置換（簡易的なリセット）
    // ※アプリの構造上、頻繁にinitが呼ばれるなら考慮必要だが、今回はrenderLayout後の一回想定
    trigger.onclick = (e) => {
        e.stopPropagation();
        toggleMenu();
    };

    // --- ワークスペースデータの購読 ---
    subscribeToWorkspaces((workspaces) => {
        renderWorkspaceMenu(workspaces, listContainer, closeMenu);
        updateCurrentLabel(workspaces, label);
    });

    // --- アクションボタン ---
    if (addBtn) {
        addBtn.onclick = () => {
            closeMenu();
            // フルモーダルを表示
            showWorkspaceModal();
        };
    }

    if (settingsBtn) {
        settingsBtn.onclick = () => {
            closeMenu();
            showSettingsModal();
        };
    }
}

// 内部関数: メニュー項目のレンダリング
function renderWorkspaceMenu(workspaces, container, closeMenuCallback) {
    if (!container) return;
    container.innerHTML = '';

    const currentId = getCurrentWorkspaceId();

    workspaces.forEach(ws => {
        const isCurrent = ws.id === currentId;
        const btn = document.createElement('button');
        
        // スタイル適用 (現在選択中は強調)
        btn.className = `workspace-option w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${
            isCurrent 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`;
        
        btn.innerHTML = `
            <span class="truncate">${ws.name}</span>
            ${isCurrent ? '<svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' : ''}
        `;
        
        // クリックで切り替え
        btn.addEventListener('click', () => {
            if (!isCurrent) {
                setCurrentWorkspaceId(ws.id);
            }
            if (closeMenuCallback) closeMenuCallback();
        });
        
        container.appendChild(btn);
    });
}

// 内部関数: ラベルの更新
function updateCurrentLabel(workspaces, labelEl) {
    if (!labelEl) return;
    
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