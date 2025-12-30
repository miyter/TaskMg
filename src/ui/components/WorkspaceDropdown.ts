/**
 * 更新日: 2025-12-21
 * 内容: XSS対策(textContent採用)、冪等性の確保、イベントデータの直接利用によるレースコンディション回避
 * TypeScript化: 2025-12-29
 */
import { Workspace } from '../../store/schema';
import { getCurrentWorkspaceId, setCurrentWorkspaceId } from '../../store/workspace';
import { showItemContextMenu } from '../features/sidebar/sidebar-components';
import { showSettingsModal } from '../settings/settings.js';

const CLASSES = {
    MENU_VISIBLE: ['opacity-100', 'visible', 'scale-100', 'pointer-events-auto'],
    MENU_INVISIBLE: ['opacity-0', 'invisible', 'scale-95', 'pointer-events-none']
};

let menuEl: HTMLElement | null = null;
let triggerEl: HTMLElement | null = null;
let isInitialized = false;

function setMenuVisible(visible: boolean) {
    if (!menuEl) return;

    if (visible) {
        menuEl.classList.remove(...CLASSES.MENU_INVISIBLE);
        menuEl.classList.add(...CLASSES.MENU_VISIBLE);
        document.addEventListener('click', handleOutsideClick, { capture: true });
    } else {
        menuEl.classList.remove(...CLASSES.MENU_VISIBLE);
        menuEl.classList.add(...CLASSES.MENU_INVISIBLE);
        document.removeEventListener('click', handleOutsideClick, { capture: true });
    }
}

const handleOutsideClick = (e: MouseEvent) => {
    if (menuEl && !menuEl.contains(e.target as Node) && triggerEl && !triggerEl.contains(e.target as Node)) {
        setMenuVisible(false);
    }
};

/**
 * ドロップダウンの初期化（冪等性を確保）
 */
export function initWorkspaceDropdown() {
    if (isInitialized) return;

    triggerEl = document.getElementById('workspace-trigger');
    menuEl = document.getElementById('workspace-menu');
    const addBtn = document.getElementById('add-workspace-btn');
    const settingsBtn = document.getElementById('settings-workspace-btn');

    if (!triggerEl || !menuEl) return;

    triggerEl.onclick = (e) => {
        e.stopPropagation();
        const isOpen = menuEl!.classList.contains('opacity-100');
        setMenuVisible(!isOpen);
    };

    if (addBtn) addBtn.onclick = () => { setMenuVisible(false); openWorkspaceEditModal(null); };
    if (settingsBtn) settingsBtn.onclick = () => { setMenuVisible(false); showSettingsModal(); };

    // ワークスペース変更イベントを購読
    document.addEventListener('workspace-changed', (e: any) => {
        const { workspaceId, workspaces } = e.detail;
        updateWorkspaceDropdownUI(workspaces, workspaceId);
    });

    isInitialized = true;
}

/**
 * UIの更新
 * @param {Array} workspaces - 最新のリスト（イベントから渡されたもの）
 * @param {string} currentId - 選択中のID
 */
export function updateWorkspaceDropdownUI(workspaces: Workspace[], currentId: string = getCurrentWorkspaceId() || '') {
    const listContainer = document.getElementById('workspace-list');
    const label = document.getElementById('workspace-label');

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
 * メニュー項目のレンダリング（XSS対策済み）
 */
function renderWorkspaceMenu(workspaces: Workspace[], container: HTMLElement, currentId: string) {
    container.innerHTML = '';

    workspaces.forEach(ws => {
        const isCurrent = ws.id === currentId;
        const btn = document.createElement('button');

        btn.className = `workspace-option w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${isCurrent
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`;

        // テキスト部分はtextContentを使用して安全にセット
        const nameSpan = document.createElement('span');
        nameSpan.className = 'truncate pointer-events-none';
        nameSpan.textContent = ws.name;
        btn.appendChild(nameSpan);

        if (isCurrent) {
            const icon = document.createElement('div');
            icon.innerHTML = `
                <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            `;
            if (icon.firstElementChild) {
                btn.appendChild(icon.firstElementChild);
            }
        }

        btn.onclick = () => {
            if (!isCurrent) setCurrentWorkspaceId(ws.id!);
            setMenuVisible(false);
        };

        btn.oncontextmenu = (e) => {
            e.preventDefault();
            // @ts-ignore
            showItemContextMenu(e, 'workspace', ws);
        };

        container.appendChild(btn);
    });
}
