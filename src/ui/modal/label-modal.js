// @ts-nocheck
// @miyter:20251221
// ラベル作成・編集モーダルの制御

import { addLabel, updateLabel, deleteLabel } from '../../store/labels.js';
import { showMessageModal } from '../components.js';
import { buildLabelModalHTML } from './label-modal-dom.js';

/**
 * ラベルモーダルを表示
 * @param {Object|null} label - 編集対象のラベル。nullなら新規
 */
export function showLabelModal(label = null) {
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
function setupEvents(overlay, label) {
    const close = () => overlay.remove();
    const nameInput = overlay.querySelector('#modal-label-name');
    const saveBtn = overlay.querySelector('#save-label-btn');
    const deleteBtn = overlay.querySelector('#delete-label-btn');

    overlay.querySelector('#cancel-label-modal-btn')?.addEventListener('click', close);
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    const handleSave = async () => {
        const name = nameInput?.value.trim();
        if (!name) return showMessageModal('名前を入力してください', 'error');

        try {
            if (label) {
                await updateLabel(label.id, { name });
                showMessageModal('ラベルを更新しました');
            } else {
                const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
                await addLabel(name, randomColor);
                showMessageModal('ラベルを作成しました');
            }
            close();
        } catch (err) {
            showMessageModal('保存に失敗しました', 'error');
        }
    };

    saveBtn.onclick = handleSave;
    nameInput.onkeydown = (e) => { if (e.key === 'Enter') handleSave(); };

    if (deleteBtn) {
        deleteBtn.onclick = () => {
            showMessageModal(`ラベル「${label.name}」を削除しますか？`, async () => {
                try {
                    await deleteLabel(label.id);
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
            if (label) nameInput.select();
        }
    });
}