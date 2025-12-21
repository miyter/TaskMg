// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: Grokのレビューに基づくバグ修正（クリック判定、Escキー対応、保存中無効化）
 */

import { addWorkspace, updateWorkspaceName, setCurrentWorkspaceId, getWorkspaces } from '../../store/workspace.js';
import { showMessageModal } from '../components.js';
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

    // 閉じる処理（メモリリーク防止のためリスナー管理）
    const close = () => {
        document.removeEventListener('keydown', escHandler);
        overlay.remove();
    };

    const escHandler = (e) => {
        if (e.key === 'Escape') close();
    };

    // 1. Escキー対応
    document.addEventListener('keydown', escHandler);

    // 2. 背景クリック判定（カード部分ではなく背景のみ）
    actualOverlay.onclick = (e) => {
        if (e.target === actualOverlay) close();
    };

    if (cancelBtn) cancelBtn.onclick = close;

    // 3. 保存処理（バリデーションと連打防止）
    const handleSave = async () => {
        if (saveBtn.disabled) return;

        const name = nameInput?.value.trim();
        if (!name) return showMessageModal('ワークスペース名を入力してください', 'error');

        // 名前重複チェック（簡易）
        const isDuplicate = getWorkspaces().some(ws => ws.name === name && ws.id !== workspaceData?.id);
        if (isDuplicate) return showMessageModal('その名前のワークスペースは既に存在します', 'error');

        saveBtn.disabled = true;
        saveBtn.textContent = workspaceData ? '更新中...' : '作成中...';

        try {
            if (workspaceData) {
                await updateWorkspaceName(workspaceData.id, name);
                // 成功ポップアップは出さない方針
            } else {
                const newWs = await addWorkspace(name);
                setCurrentWorkspaceId(newWs.id);
            }
            close();
        } catch (error) {
            saveBtn.disabled = false;
            saveBtn.textContent = workspaceData ? '保存' : '作成';
            showMessageModal(`失敗しました: ${error.message}`, 'error');
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