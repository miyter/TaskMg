// @ts-nocheck
// ワークスペース作成・編集モーダル制御

import { addWorkspace, updateWorkspaceName, setCurrentWorkspaceId } from '../../store/workspace.js';
import { showMessageModal } from '../components.js';
import { buildWorkspaceModalHTML } from './workspace-modal-dom.js';

/**
 * ワークスペースモーダルを表示（新規作成または編集）
 * @param {Object|null} workspaceData - 編集対象のワークスペースデータ。nullなら新規作成
 */
export function showWorkspaceModal(workspaceData = null) {
    const modalId = 'workspace-modal';
    document.getElementById(modalId)?.remove();

    // オーバーレイ作成
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';

    // HTMLコンテンツ生成 (編集データを渡す)
    modalOverlay.innerHTML = buildWorkspaceModalHTML(workspaceData);

    document.body.appendChild(modalOverlay);

    // イベント設定
    setupWorkspaceModalEvents(modalOverlay, workspaceData);
}

function setupWorkspaceModalEvents(modalOverlay, workspaceData) {
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
            if (workspaceData) {
                // 編集モード
                await updateWorkspaceName(workspaceData.id, name);
                showMessageModal(`ワークスペース名を「${name}」に変更しました`);
            } else {
                // 新規作成モード
                const newWs = await addWorkspace(name);
                // 作成成功したら自動でそのワークスペースに切り替え
                setCurrentWorkspaceId(newWs.id);
                showMessageModal(`ワークスペース「${name}」を作成しました`);
            }
            
            closeModal();
        } catch (error) {
            console.error(error);
            const action = workspaceData ? '更新' : '作成';
            showMessageModal(`ワークスペースの${action}に失敗しました`, 'error');
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
    setTimeout(() => {
        if (nameInput) {
            nameInput.focus();
            if (workspaceData) {
                nameInput.select(); // 編集時は全選択
            }
        }
    }, 50);
}