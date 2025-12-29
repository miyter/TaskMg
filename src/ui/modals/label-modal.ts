/**
 * ラベル作成・編集モーダルの制御
 * TypeScript化: 2025-12-29
 */

import { addLabel, deleteLabel, updateLabel } from '../../store/labels';
import { Label } from '../../store/schema';
import { showMessageModal } from '../components';
import { buildLabelModalHTML } from './label-modal-dom';

/**
 * ラベルモーダルを表示
 * @param {Label|null} label - 編集対象のラベル。nullなら新規
 */
export function showLabelModal(label: Label | null = null) {
    const modalId = 'label-modal';
    document.getElementById(modalId)?.remove();

    const overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.innerHTML = buildLabelModalHTML(label);
    document.body.appendChild(overlay);

    setupEvents(overlay, label);
}

/**
 * イベントリスナーのセットアップ
 */
function setupEvents(overlay: HTMLElement, label: Label | null) {
    const close = () => overlay.remove();
    const nameInput = overlay.querySelector('#modal-label-name') as HTMLInputElement | null;
    const saveBtn = overlay.querySelector('#save-label-btn');
    const deleteBtn = overlay.querySelector('#delete-label-btn') as HTMLElement;

    overlay.querySelector('#cancel-label-modal-btn')?.addEventListener('click', close);
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal('名前を入力してください', 'error'); // components.ts の改修により文字列もOK

        try {
            if (label) {
                await updateLabel(label.id!, { name });
                showMessageModal('ラベルを更新しました');
            } else {
                const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
                await addLabel(name, randomColor);
                showMessageModal('ラベルを作成しました');
            }
            close();
        } catch (err) {
            showMessageModal('保存に失敗しました', 'error');
        }
    };

    if (saveBtn) (saveBtn as HTMLElement).onclick = handleSave;
    if (nameInput) nameInput.onkeydown = (e) => { if (e.key === 'Enter') handleSave(); };

    if (deleteBtn && label) {
        deleteBtn.onclick = () => {
            showMessageModal({
                message: `ラベル「${label.name}」を削除しますか？`,
                type: 'confirm',
                onConfirm: async () => {
                    try {
                        await deleteLabel(label.id!);
                        close();
                    } catch (err) {
                        showMessageModal('削除に失敗しました', 'error');
                    }
                }
            });
        };
    }

    requestAnimationFrame(() => {
        if (nameInput) {
            nameInput.focus();
            if (label) nameInput.select();
        }
    });
}
