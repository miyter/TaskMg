// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: ヘッダー位置のずれを修正。sidebar-structure.js の共通ヘッダーに統合。
 */

import { showProjectModal } from '../../modals/project-modal.js';
import { createSidebarItem, showItemContextMenu } from './sidebar-components.js';
import { setupDropZone } from './sidebar-drag-drop.js';

// import { getTasks } from '../../../store/index.js'; // 循環参照回避のため削除

/**
 * プロジェクトセクションのイベント初期化
 * @param {HTMLElement} container - サイドバーのコンテンツコンテナ
 */
export function initSidebarProjects(container) {
    // 共通ヘッダーで作成された「＋」ボタンを取得してイベントを付与
    const addBtn = document.getElementById('add-project-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showProjectModal();
        });
    }
}

/**
 * プロジェクトリストの中身を最新データで更新する
 * @param {Array} projects - 表示するプロジェクト一覧
 * @param {Array} allTasks - カウント計算用の全タスク
 */
export function updateSidebarProjects(projects, allTasks = []) {
    // const allTasks = getTasks(); // 呼び出し元から受け取る
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = '';

    if (projects.length === 0) {
        list.innerHTML = `<li class="px-6 py-2 text-xs text-gray-400 italic select-none">プロジェクトなし</li>`;
        return;
    }

    projects.forEach(project => {
        // 未完了タスク数をカウント
        const count = allTasks.filter(t => t.projectId === project.id && !t.completed).length;

        // 汎用アイテムコンポーネントを使用
        const item = createSidebarItem(project.name, 'project', project.id, project.color, count);

        // ナビゲーションイベント
        item.onclick = () => {
            document.dispatchEvent(new CustomEvent('route-change', {
                detail: { page: 'project', id: project.id }
            }));
        };

        // 右クリックメニュー
        item.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(e, 'project', project);
        };

        // ドラッグ＆ドロップターゲット設定
        setupDropZone(item, 'project', project.id);

        list.appendChild(item);
    });
}