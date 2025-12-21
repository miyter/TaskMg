// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: ストア連携によるヘルパー強化、変数のカプセル化
 */

import { getProjects } from '../store/projects.js';

// 幅管理用のクロージャ
const SidebarState = (() => {
    let width = 280;
    return {
        getWidth: () => width,
        setWidth: (w) => { width = w; }
    };
})();

/**
 * サイドバーのリサイズ機能をセットアップ
 */
export function setupResizer(sidebar, mainContent, resizer) {
    if (!resizer || !sidebar) return;

    // 初期幅の復元
    const storedWidth = localStorage.getItem('sidebarWidth');
    const initialWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
    SidebarState.setWidth(initialWidth);
    
    // 閉じている状態でなければ幅を適用
    if (!sidebar.classList.contains('sidebar-closed')) {
        sidebar.style.width = `${initialWidth}px`;
    }

    let isResizing = false;

    const startResize = (e) => {
        if (sidebar.classList.contains('sidebar-closed')) return;
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.classList.add('select-none');
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    };

    const resize = (e) => {
        if (!isResizing) return;
        let newWidth = e.clientX;
        const minWidth = 150;
        const maxWidth = 500;

        if (newWidth < minWidth) newWidth = minWidth;
        if (newWidth > maxWidth) newWidth = maxWidth;

        SidebarState.setWidth(newWidth);
        sidebar.style.width = `${newWidth}px`;
    };

    const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.cursor = '';
        document.body.classList.remove('select-none');
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        localStorage.setItem('sidebarWidth', SidebarState.getWidth());
    };

    resizer.addEventListener('mousedown', startResize);
}

/**
 * ランダムなカラーを生成
 */
export function getRandomColor() {
    const colors = [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6',
        '#EC4899', '#14B8A6', '#06B6D4', '#0EA5E9', '#8B5CF6', '#A78BFA',
        '#F472B6', '#FB923C', '#A3E635', '#22D3EE'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * プロジェクト名を取得するUIヘルパー (ストア自動連携)
 */
export function getProjectName(projectId, allProjects = null) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    
    // 引数で渡されなければストアから取得
    const projects = allProjects || getProjects();
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}