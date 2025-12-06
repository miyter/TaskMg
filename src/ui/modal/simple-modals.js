// @ts-nocheck
// プロジェクト・ラベル編集用の簡易モーダル機能

import { addProject, updateProject } from '../../store/projects.js';
import { addLabel, updateLabel } from '../../store/labels.js';
import { showMessageModal } from '../components.js';

/**
 * プロジェクト編集/新規作成モーダルを開く（現在はpromptを使用）
 * @param {Object|null} project - 編集対象のプロジェクトオブジェクト (nullの場合は新規作成)
 * @param {Array} allProjects - 全プロジェクトデータ
 */
export function showProjectModal(project = null, allProjects = []) {
    const isNew = project === null;
    const title = isNew ? '新しいプロジェクト名を入力してください' : `プロジェクト「${project.name}」を編集`;
    const defaultName = isNew ? '' : project.name;
    
    const newName = prompt(title, defaultName);
    if (!newName || newName.trim() === defaultName) return;

    if (isNew) {
        addProject(newName.trim())
            .then(() => showMessageModal("プロジェクトを作成しました"))
            .catch(e => { console.error(e); showMessageModal("作成に失敗しました", 'error'); });
    } else {
        updateProject(project.id, { name: newName.trim() })
            .then(() => showMessageModal("プロジェクトを更新しました"))
            .catch(e => { console.error(e); showMessageModal("更新に失敗しました", 'error'); });
    }
}

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
            .then(() => showMessageModal("ラベルを作成しました"))
            .catch(e => { console.error(e); showMessageModal("作成に失敗しました", 'error'); });
    } else {
        updateLabel(label.id, { name: newName.trim() })
            .then(() => showMessageModal("ラベルを更新しました"))
            .catch(e => { console.error(e); showMessageModal("更新に失敗しました", 'error'); });
    }
}