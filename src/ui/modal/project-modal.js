// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: プロジェクト作成時に workspaceId を付与し、成功ポップアップを削除
 */

import { addProject, updateProject, deleteProject } from '../../store/projects.js';
import { getCurrentWorkspaceId } from '../../store/workspace.js';
import { showMessageModal } from '../components.js';
import { buildProjectModalHTML } from './project-modal-dom.js';

/**
 * プロジェクトモーダルを表示
 */
export function showProjectModal(project = null) {
    const modalId = 'project-modal';
    document.getElementById(modalId)?.remove();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.innerHTML = buildProjectModalHTML(project);
    document.body.appendChild(overlay);

    setupEvents(overlay, project);
}

/**
 * イベントリスナーのセットアップ
 */
function setupEvents(overlay, project) {
    const close = () => overlay.remove();
    const nameInput = overlay.querySelector('#modal-project-name');
    const saveBtn = overlay.querySelector('#save-project-btn');
    const deleteBtn = overlay.querySelector('#delete-project-btn');
    const cancelBtn = overlay.querySelector('#cancel-modal-btn');

    if (cancelBtn) cancelBtn.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal('プロジェクト名を入力してください', 'error');

        try {
            if (project) {
                await updateProject(project.id, { name });
            } else {
                // 現在のワークスペースIDを取得してプロジェクトを作成
                const workspaceId = getCurrentWorkspaceId();
                if (!workspaceId) throw new Error("ワークスペースが選択されていません");
                
                await addProject(name, workspaceId);
                // 「プロジェクトを作成しました」のポップアップは削除
            }
            close();
        } catch (err) {
            showMessageModal('保存に失敗しました: ' + err.message, 'error');
        }
    };

    if (saveBtn) saveBtn.onclick = handleSave;
    if (nameInput) {
        nameInput.onkeydown = (e) => { if (e.key === 'Enter') handleSave(); };
    }

    if (deleteBtn && project) {
        deleteBtn.onclick = () => {
            showMessageModal(`プロジェクト「${project.name}」を削除しますか？`, async () => {
                try {
                    await deleteProject(project.id);
                    close();
                } catch (err) {
                    showMessageModal('削除に失敗しました', 'error');
                }
            });
        };
    }

    requestAnimationFrame(() => {
        if (nameInput) {
            nameInput.focus();
            if (project) nameInput.select();
        }
    });
}