/**
 * ワークスペースモーダルの制御ロジック
 * TypeScript化: 2025-12-29
 */
import { Workspace } from '../../store/schema';
import { addWorkspace, getWorkspaces, setCurrentWorkspaceId, updateWorkspaceName } from '../../store/workspace';
import { showMessageModal } from '../components';
import { buildWorkspaceModalHTML } from './workspace-modal-dom';

/**
 * ワークスペースモーダルを表示
 */
export function showWorkspaceModal(workspaceData: Workspace | null = null) {
    const modalId = 'workspace-modal-root';
    document.getElementById(modalId)?.remove();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.innerHTML = buildWorkspaceModalHTML(workspaceData);
    document.body.appendChild(overlay);

    setupEvents(overlay, workspaceData);
}

/**
 * イベントリスナーの設定
 */
function setupEvents(overlay: HTMLElement, workspaceData: Workspace | null) {
    const saveBtn = overlay.querySelector('#save-workspace-btn') as HTMLButtonElement;
    const nameInput = overlay.querySelector('#modal-workspace-name') as HTMLInputElement;
    const cancelBtn = overlay.querySelector('#cancel-modal-btn') as HTMLButtonElement | null;
    const actualOverlay = overlay.querySelector('#workspace-modal-overlay') as HTMLElement;

    const close = () => {
        document.removeEventListener('keydown', escHandler);
        overlay.remove();
    };

    const escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
    };

    // リスナー登録
    document.addEventListener('keydown', escHandler);

    if (actualOverlay) {
        actualOverlay.onclick = (e) => {
            if (e.target === actualOverlay) close();
        };
    }

    if (cancelBtn) cancelBtn.onclick = close;

    const handleSave = async () => {
        if (saveBtn.disabled) return;

        const name = nameInput?.value.trim();
        if (!name) return showMessageModal({ message: 'ワークスペース名を入力してくれ', type: 'error' });

        // @ts-ignore: getWorkspaces return type check
        const isDuplicate = getWorkspaces().some((ws: Workspace) => ws.name === name && ws.id !== workspaceData?.id);
        if (isDuplicate) return showMessageModal({ message: 'その名前は既に使われているぞ', type: 'error' });

        saveBtn.disabled = true;
        saveBtn.textContent = workspaceData ? '更新中...' : '作成中...';

        try {
            if (workspaceData) {
                await updateWorkspaceName(workspaceData.id!, name);
            } else {
                const newWs = await addWorkspace(name);
                setCurrentWorkspaceId(newWs.id!);
            }
            close();
        } catch (error: any) {
            saveBtn.disabled = false;
            saveBtn.textContent = workspaceData ? '保存' : '作成';
            showMessageModal({ message: `失敗した: ${error.message}`, type: 'error' });
        }
    };

    saveBtn?.addEventListener('click', handleSave);
    nameInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSave();
    });

    requestAnimationFrame(() => {
        if (nameInput) {
            nameInput.focus();
            if (workspaceData) nameInput.select();
        }
    });
}
