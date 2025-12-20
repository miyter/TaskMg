// @ts-nocheck
// @miyter:20251221
// プロジェクト一覧セクションのコンポーネント

import { showProjectModal } from '../modal/project-modal.js';
import { createSidebarItem, showItemContextMenu } from '../sidebar-components.js';
import { setupDropZone } from '../sidebar-drag-drop.js';

/**
 * プロジェクトセクションを初期化・DOM生成する
 * @param {HTMLElement} container - サイドバーのコンテンツコンテナ
 */
export function initSidebarProjects(container) {
    const wrapper = document.createElement('div');
    wrapper.id = 'sidebar-projects-section';
    wrapper.className = 'mt-2 mb-2';

    wrapper.innerHTML = `
        <div class="flex items-center justify-between px-4 py-1.5 group hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors rounded-lg mx-2 mb-1 cursor-pointer" id="projects-header-trigger">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex-1 select-none">
                プロジェクト
            </h3>
            <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" title="プロジェクトを追加">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
        </div>
        <ul id="project-list" class="space-y-0.5 pb-2 px-1">
            <!-- 実際のプロジェクト行はupdateSidebarProjectsで挿入される -->
        </ul>
    `;

    const mountPoint = container.querySelector('#projects-mount-point');
    if (mountPoint) {
        mountPoint.replaceWith(wrapper);
    } else {
        container.appendChild(wrapper);
    }

    // イベント: 新規作成
    wrapper.querySelector('#add-project-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectModal();
    });
}

/**
 * プロジェクトリストの中身を最新データで更新する
 * @param {Array} projects - 表示するプロジェクト一覧
 * @param {Array} allTasks - カウント計算用の全タスク
 */
export function updateSidebarProjects(projects, allTasks = []) {
    const list = document.getElementById('project-list');
    if (!list) return;

    list.innerHTML = '';

    if (projects.length === 0) {
        list.innerHTML = `<li class="px-6 py-2 text-xs text-gray-400 italic">プロジェクトなし</li>`;
        return;
    }

    projects.forEach(project => {
        // 未完了タスク数をカウント
        const count = allTasks.filter(t => t.projectId === project.id && t.status !== 'completed').length;
        
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