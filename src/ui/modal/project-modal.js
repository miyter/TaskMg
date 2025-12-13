// @ts-nocheck
// プロジェクト作成・編集モーダル制御

import { addProject, updateProject, deleteProject } from '../../store/projects.js';
import { showMessageModal } from '../components.js';
import { buildProjectModalHTML } from './project-modal-dom.js';

/**
 * プロジェクト編集/新規作成モーダルを表示
 * @param {Object|null} project - 編集対象のプロジェクト (nullの場合は新規)
 */
export function showProjectModal(project = null) {
    const modalId = 'project-modal';
    document.getElementById(modalId)?.remove();

    const isNew = !project;

    // オーバーレイ作成
    const modalOverlay = document.createElement('div');
    modalOverlay.id = modalId;
    modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4';

    // HTMLコンテンツ生成 (DOMジェネレーターを利用)
    modalOverlay.innerHTML = buildProjectModalHTML(project);

    document.body.appendChild(modalOverlay);

    // イベント設定
    setupProjectModalEvents(modalOverlay, project, isNew);
}

function setupProjectModalEvents(modalOverlay, project, isNew) {
    const closeModal = () => modalOverlay.remove();

    // 閉じるボタン・キャンセルボタン
    const closeBtn = modalOverlay.querySelector('#close-project-modal');
    const cancelBtn = modalOverlay.querySelector('#cancel-project-btn');
    
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    // フォーム送信（保存）
    const form = modalOverlay.querySelector('#project-form');
    const nameInput = modalOverlay.querySelector('#project-name-input');
    
    // フォーカス設定
    setTimeout(() => nameInput?.focus(), 50);

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput?.value.trim();

        if (!name) return;

        try {
            if (isNew) {
                await addProject(name);
            } else {
                await updateProject(project.id, { name });
            }
            closeModal();
            // ストアの更新通知によりサイドバー等は自動更新される
        } catch (error) {
            console.error(error);
            showMessageModal('保存に失敗しました', 'error');
        }
    });

    // 削除ボタン（編集時のみ）
    const deleteBtn = modalOverlay.querySelector('#delete-project-btn');
    if (deleteBtn) {
        if (isNew) {
            deleteBtn.style.display = 'none'; // 新規時は非表示
        } else {
            deleteBtn.addEventListener('click', () => {
                showMessageModal(`プロジェクト「${project.name}」を削除しますか？\n（関連するタスクの紐付けも解除されます）`, async () => {
                    try {
                        await deleteProject(project.id);
                        closeModal();
                    } catch (error) {
                        console.error(error);
                        showMessageModal('削除に失敗しました', 'error');
                    }
                });
            });
        }
    }
}