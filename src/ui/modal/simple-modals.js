// @ts-nocheck
// ラベル編集用の簡易モーダル機能
// ※プロジェクト用は project-modal.js に移行済み

import { addLabel, updateLabel } from '../../store/labels.js';
import { showMessageModal } from '../components.js';

// showProjectModal は廃止・削除

/**
 * ラベル編集/新規作成モーダルを開く（現在はpromptを使用）
 * @param {Object|null} label - 編集対象のラベルオブジェクト (nullの場合は新規作成)
 * @param {Array} allLabels - 全ラベルデータ
 */
export function showLabelModal(label = null, allLabels = []) {
    const isNew = label === null;
    const title = isNew ? '新しいラベル名を入力してください' : `ラベル「${label.name}」を編集`;
    const defaultName = isNew ? '' : label.name;
    
    const newName = prompt(title, defaultName);
    if (!newName || newName.trim() === defaultName) return;

    if (isNew) {
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`; 
        addLabel(newName.trim(), randomColor)
            .catch(e => { console.error(e); showMessageModal("作成に失敗しました", 'error'); });
    } else {
        updateLabel(label.id, { name: newName.trim() })
            .catch(e => { console.error(e); showMessageModal("更新に失敗しました", 'error'); });
    }
}