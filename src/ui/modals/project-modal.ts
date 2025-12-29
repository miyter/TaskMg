/**
 * プロジェクト作成・編集モーダル
 * TypeScript化: 2025-12-29
 */
import { addProject, deleteProject, updateProject } from '../../store/projects';
import { Project } from '../../store/schema';
import { getCurrentWorkspaceId } from '../../store/workspace';
import { showMessageModal } from '../components';
import { initializeModal } from './modal-common';
import { buildProjectModalHTML } from './project-modal-dom';

/**
 * プロジェクトモーダルを表示
 */
export function showProjectModal(project: Project | null = null) {
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
function setupEvents(overlay: HTMLElement, project: Project | null, close: () => void) {
    const nameInput = overlay.querySelector('#modal-project-name') as HTMLInputElement | null;
    const saveBtn = overlay.querySelector('#save-project-btn') as HTMLElement;
    const deleteBtn = overlay.querySelector('#delete-project-btn') as HTMLElement;
    const cancelBtn = overlay.querySelector('#cancel-modal-btn') as HTMLElement;

    if (cancelBtn) cancelBtn.onclick = close;

    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal({ message: 'プロジェクト名を入力してくれ', type: 'error' });

        try {
            if (project) {
                await updateProject(project.id!, { name });
            } else {
                const workspaceId = getCurrentWorkspaceId();
                if (!workspaceId) throw new Error("ワークスペースが選択されていないぞ");

                await addProject(name, workspaceId);
                // 成功ポップアップはUX向上のため削除
            }
            close();
        } catch (err: any) {
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
                        await deleteProject(project.id!);
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
