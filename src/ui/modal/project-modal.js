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

    // DOM要素の取得 (IDをDOM定義に合わせて修正)
    // ×ボタンはDOMから削除されたため取得不要
    const cancelBtn = modalOverlay.querySelector('#cancel-modal-btn');
    const saveBtn = modalOverlay.querySelector('#save-project-btn');
    const nameInput = modalOverlay.querySelector('#modal-project-name');
    const deleteBtn = modalOverlay.querySelector('#delete-project-btn');

    // キャンセルボタンで閉じる
    cancelBtn?.addEventListener('click', closeModal);

    // 保存処理（ボタンクリックで実行）
    saveBtn?.addEventListener('click', async () => {
        const name = nameInput?.value.trim();

        if (!name) {
            showMessageModal('プロジェクト名を入力してください', 'error');
            return;
        }

        try {
            if (isNew) {
                await addProject(name);
            } else {
                await updateProject(project.id, { name });
            }
            closeModal();
            // ストア更新通知によりサイドバー等は自動更新される
        } catch (error) {
            console.error(error);
            showMessageModal('保存に失敗しました', 'error');
        }
    });

    // Enterキーで保存
    nameInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveBtn?.click();
        }
    });

    // 削除ボタン（編集時のみ存在）
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            showMessageModal(`プロジェクト「${project.name}」を削除しますか？\n（関連するタスクの紐付けも解除されます）`, async () => {
                try {
                    await deleteProject(project.id);
                    closeModal();
                    // 必要であればインボックスへ遷移するなどの処理を追加可能
                } catch (error) {
                    console.error(error);
                    showMessageModal('削除に失敗しました', 'error');
                }
            });
        });
    }

    // 入力欄にフォーカス
    setTimeout(() => nameInput?.focus(), 50);
}