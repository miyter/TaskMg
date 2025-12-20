// @ts-nocheck
// @miyter:20251221
// プロジェクト作成・編集モーダルの制御

import { addProject, updateProject, deleteProject } from '../../store/projects.js';
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

    // 閉じる操作
    overlay.querySelector('#cancel-modal-btn')?.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    // 保存処理
    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal('プロジェクト名を入力してください', 'error');

        try {
            if (project) {
                await updateProject(project.id, { name });
                showMessageModal('変更を保存しました');
            } else {
                await addProject(name);
                showMessageModal('プロジェクトを作成しました');
            }
            close();
        } catch (err) {
            showMessageModal('保存に失敗しました', 'error');
        }
    };

    saveBtn.onclick = handleSave;
    nameInput.onkeydown = (e) => { if (e.key === 'Enter') handleSave(); };

    // 削除処理
    if (deleteBtn) {
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

    // 初期フォーカス
    requestAnimationFrame(() => {
        if (nameInput) {
            nameInput.focus();
            if (project) nameInput.select();
        }
    });
}