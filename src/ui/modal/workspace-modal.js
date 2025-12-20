// @ts-nocheck
// @miyter:20251221
// ワークスペース作成・編集モーダル制御

import { addWorkspace, updateWorkspaceName, setCurrentWorkspaceId } from '../../store/workspace.js';
import { showMessageModal } from '../components.js';
import { buildWorkspaceModalHTML } from './workspace-modal-dom.js';

/**
 * ワークスペースモーダルを表示
 */
export function showWorkspaceModal(workspaceData = null) {
    const modalId = 'workspace-modal';
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
    const close = () => overlay.remove();
    const nameInput = overlay.querySelector('#modal-workspace-name');
    const saveBtn = overlay.querySelector('#save-workspace-btn');

    // 閉じる操作
    overlay.querySelector('#cancel-modal-btn')?.addEventListener('click', close);
    overlay.onclick = (e) => { if (e.target === overlay.firstElementChild) close(); };

    // 保存処理
    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal('名前を入力してください', 'error');

        try {
            if (workspaceData) {
                await updateWorkspaceName(workspaceData.id, name);
                showMessageModal(`変更しました`);
            } else {
                const newWs = await addWorkspace(name);
                setCurrentWorkspaceId(newWs.id);
                showMessageModal(`作成しました`);
            }
            close();
        } catch (error) {
            showMessageModal(`失敗しました`, 'error');
        }
    };

    saveBtn?.addEventListener('click', handleSave);
    nameInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSave();
    });

    // 初期フォーカス
    requestAnimationFrame(() => {
        if (nameInput) {
            nameInput.focus();
            if (workspaceData) nameInput.select();
        }
    });
}