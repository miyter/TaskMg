/**
 * ワークスペースモーダルの制御ロジック
 */
import { addWorkspace, updateWorkspaceName, setCurrentWorkspaceId, getWorkspaces } from '../../store/workspace';
import { showMessageModal } from '../components';
import { buildWorkspaceModalHTML } from './workspace-modal-dom.js';

/**
 * ワークスペースモーダルを表示
 */
export function showWorkspaceModal(workspaceData = null) {
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
function setupEvents(overlay, workspaceData) {
    const saveBtn = overlay.querySelector('#save-workspace-btn');
    const nameInput = overlay.querySelector('#modal-workspace-name');
    const cancelBtn = overlay.querySelector('#cancel-modal-btn');
    const actualOverlay = overlay.querySelector('#workspace-modal-overlay');

    const close = () => {
        document.removeEventListener('keydown', escHandler);
        overlay.remove();
    };

    const escHandler = (e) => {
        if (e.key === 'Escape') close();
    };

    // リスナー登録
    document.addEventListener('keydown', escHandler);

    actualOverlay.onclick = (e) => {
        if (e.target === actualOverlay) close();
    };

    if (cancelBtn) cancelBtn.onclick = close;

    const handleSave = async () => {
        if (saveBtn.disabled) return;

        const name = nameInput?.value.trim();
        if (!name) return showMessageModal({ message: 'ワークスペース名を入力してくれ', type: 'error' });

        const isDuplicate = getWorkspaces().some(ws => ws.name === name && ws.id !== workspaceData?.id);
        if (isDuplicate) return showMessageModal({ message: 'その名前は既に使われているぞ', type: 'error' });

        saveBtn.disabled = true;
        saveBtn.textContent = workspaceData ? '更新中...' : '作成中...';

        try {
            if (workspaceData) {
                await updateWorkspaceName(workspaceData.id, name);
            } else {
                const newWs = await addWorkspace(name);
                setCurrentWorkspaceId(newWs.id);
            }
            close();
        } catch (error) {
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