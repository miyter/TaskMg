/**
 * プロジェクト作成・編集モーダル
 */
import { addProject, updateProject, deleteProject } from '../../store/projects.js';
import { getCurrentWorkspaceId } from '../../store/workspace.js';
import { showMessageModal } from '../components.js';
import { buildProjectModalHTML } from './project-modal-dom.js';
import { initializeModal } from './modal-common.js';

/**
 * プロジェクトモーダルを表示
 */
export function showProjectModal(project = null) {
    const modalId = 'project-modal';
    const htmlContent = buildProjectModalHTML(project);

    const { overlay, close } = initializeModal(modalId, htmlContent, {
        focusSelector: '#modal-project-name',
        selectText: !!project
    });

    setupEvents(overlay, project, close);
}

/**
 * イベントリスナーのセットアップ
 */
function setupEvents(overlay, project, close) {
    const nameInput = overlay.querySelector('#modal-project-name');
    const saveBtn = overlay.querySelector('#save-project-btn');
    const deleteBtn = overlay.querySelector('#delete-project-btn');
    const cancelBtn = overlay.querySelector('#cancel-modal-btn');

    if (cancelBtn) cancelBtn.onclick = close;

    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal({ message: 'プロジェクト名を入力してくれ', type: 'error' });

        try {
            if (project) {
                await updateProject(project.id, { name });
            } else {
                const workspaceId = getCurrentWorkspaceId();
                if (!workspaceId) throw new Error("ワークスペースが選択されていないぞ");

                await addProject(name, workspaceId);
                // 成功ポップアップはUX向上のため削除
            }
            close();
        } catch (err) {
            showMessageModal({ message: '保存に失敗した: ' + err.message, type: 'error' });
        }
    };

    if (saveBtn) saveBtn.onclick = handleSave;
    if (nameInput) {
        nameInput.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.isComposing) handleSave();
        };
    }

    if (deleteBtn && project) {
        deleteBtn.onclick = () => {
            showMessageModal({
                message: `プロジェクト「${project.name}」を削除するか？`,
                type: 'confirm',
                onConfirm: async () => {
                    try {
                        await deleteProject(project.id);
                        close();
                    } catch (err) {
                        showMessageModal({ message: '削除に失敗した', type: 'error' });
                    }
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