/**
 * 更新日: 2025-12-21
 * 内容: ヘッダー位置のずれを修正。sidebar-structure.js の共通ヘッダーに統合。
 */

import { Project, Task } from '../../../store/schema';
import { openModalDirect } from '../../../store/ui/modal-store';
import { createSidebarItem, showItemContextMenu } from './sidebar-components';
// import { setupDropZone } from './sidebar-drag-drop'; // Removed for @dnd-kit migration

/**
 * プロジェクトセクションのイベント初期化
 * @param {HTMLElement} container - サイドバーのコンテンツコンテナ
 */
export function initSidebarProjects(container: HTMLElement) {
    // 共通ヘッダーで作成された「＋」ボタンを取得してイベントを付与
    const addBtn = document.getElementById('add-project-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModalDirect('project-edit');
        });
    }
}

/**
 * プロジェクトリストの中身を最新データで更新する
 * @param {Array} projects - 表示するプロジェクト一覧
 * @param {Array} allTasks - カウント計算用の全タスク
 */
export function updateSidebarProjects(projects: Project[], allTasks: Task[] = []) {
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = '';

    if (projects.length === 0) {
        list.innerHTML = `<li class="px-6 py-2 text-xs text-gray-400 italic select-none">プロジェクトなし</li>`;
        return;
    }

    projects.forEach(project => {
        // 未完了タスク数をカウント
        const count = allTasks.filter(t => t.projectId === project.id && t.status !== 'completed').length;

        // 汎用アイテムコンポーネントを使用
        // Note: createSidebarItem creates an HTMLElement but is currently in JS
        const item = createSidebarItem(project.name, 'project', project.id || '', { color: project.color }, count);

        // ナビゲーションイベント
        item.onclick = () => {
            document.dispatchEvent(new CustomEvent('route-change', {
                detail: { page: 'project', id: project.id }
            }));
        };

        // 右クリックメニュー
        item.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            showItemContextMenu(e, 'project', project);
        };

        // ドラッグ＆ドロップターゲット設定 (React + @dnd-kitで処理されるため、Vanilla側は削除)
        // setupDropZone(item, 'project', project.id || null);

        list.appendChild(item);
    });
}
