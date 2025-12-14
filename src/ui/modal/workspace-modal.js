// @ts-nocheck
// ワークスペース作成モーダル制御

import { addWorkspace, setCurrentWorkspaceId } from '../../store/workspace.js';
import { showMessageModal } from '../components.js';
import { buildWorkspaceModalHTML } from './workspace-modal-dom.js';

/**
 * ワークスペース新規作成モーダルを表示
 */
export function showWorkspaceModal() {
    const modalId = 'workspace-modal';
    document.getElementById(modalId)?.remove();

    // オーバーレイ作成
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';

    // HTMLコンテンツ生成
    modalOverlay.innerHTML = buildWorkspaceModalHTML();

    document.body.appendChild(modalOverlay);

    // イベント設定
    setupWorkspaceModalEvents(modalOverlay);
}

function setupWorkspaceModalEvents(modalOverlay) {
    const closeModal = () => modalOverlay.remove();

    const cancelBtn = modalOverlay.querySelector('#cancel-modal-btn');
    const saveBtn = modalOverlay.querySelector('#save-workspace-btn');
    const nameInput = modalOverlay.querySelector('#modal-workspace-name');

    // キャンセルボタン
    cancelBtn?.addEventListener('click', closeModal);

    // 保存処理
    saveBtn?.addEventListener('click', async () => {
        const name = nameInput?.value.trim();

        if (!name) {
            showMessageModal('ワークスペース名を入力してください', 'error');
            return;
        }

        try {
            const newWs = await addWorkspace(name);
            // 作成成功したら自動でそのワークスペースに切り替え
            setCurrentWorkspaceId(newWs.id);
            
            closeModal();
            showMessageModal(`ワークスペース「${name}」を作成しました`);
        } catch (error) {
            console.error(error);
            showMessageModal('ワークスペースの作成に失敗しました', 'error');
        }
    });

    // Enterキーで保存
    nameInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveBtn?.click();
        }
    });

    // 入力欄にフォーカス
    setTimeout(() => nameInput?.focus(), 50);
}