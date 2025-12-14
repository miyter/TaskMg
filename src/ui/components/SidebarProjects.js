// @ts-nocheck
// プロジェクト一覧セクションのコンポーネント

import { showProjectModal } from '../modal/project-modal.js';
// 既存のレンダラーロジックを再利用（リストアイテムの生成など複雑な処理はここにあるため）
import { renderProjects } from '../sidebar-renderer.js';

/**
 * プロジェクトセクションを初期化・DOM生成する
 * @param {HTMLElement} container - サイドバーのコンテンツコンテナ
 */
export function initSidebarProjects(container) {
    // コンポーネントのラッパー作成
    const wrapper = document.createElement('div');
    wrapper.id = 'sidebar-projects-section';
    wrapper.className = 'mt-2 mb-2'; // マージン調整

    // HTML構造
    wrapper.innerHTML = `
        <div class="flex items-center justify-between px-4 py-1.5 group hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors rounded-lg mx-2 mb-1 cursor-pointer" id="projects-header-trigger">
            <h3 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex-1 select-none">
                プロジェクト
            </h3>
            <button id="add-project-btn" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" title="プロジェクトを追加">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
        </div>
        
        <!-- プロジェクトリストコンテナ (renderProjectsがここを操作する) -->
        <div id="project-list" class="space-y-0.5 pb-2">
            <!-- ローディング中や空の状態はレンダラーが処理 -->
        </div>
    `;

    // マウントポイントを探して置換、なければ末尾に追加
    // (sidebar-dom.js で <div id="projects-mount-point"></div> を用意する想定)
    const mountPoint = container.querySelector('#projects-mount-point');
    if (mountPoint) {
        mountPoint.replaceWith(wrapper);
    } else {
        container.appendChild(wrapper);
    }

    // イベント設定: プロジェクト追加
    const addBtn = wrapper.querySelector('#add-project-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // ヘッダーのクリックイベント等を防ぐ
            showProjectModal();
        });
    }

    // ヘッダー全体のクリックイベント（例: 開閉トグルや追加など、将来的な拡張用）
    const header = wrapper.querySelector('#projects-header-trigger');
    if (header) {
        header.addEventListener('click', (e) => {
            // 現状は追加ボタン以外クリックしても何もしないが、
            // 将来的にアコーディオン開閉を入れるならここ
        });
    }
}

/**
 * プロジェクトリストを更新する
 * @param {Array} projects 
 * @param {Array} allTasks 
 */
export function updateSidebarProjects(projects, allTasks) {
    // 既存のレンダラー関数に委譲
    // renderProjectsは内部で document.getElementById('project-list') を探して更新する仕様
    renderProjects(projects, allTasks);
}