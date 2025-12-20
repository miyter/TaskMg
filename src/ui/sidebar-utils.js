// @ts-nocheck
// @miyter:20251221
// サイドバーのUI状態管理（リサイズ・開閉状態）

let sidebarWidth = 280; 

/**
 * サイドバーのリサイズ機能をセットアップ
 */
export function setupResizer(sidebar, mainContent, resizer) {
    if (!resizer || !sidebar) return;

    // 初期幅の復元
    const storedWidth = localStorage.getItem('sidebarWidth');
    sidebarWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
    
    // 閉じている状態でなければ幅を適用
    if (!sidebar.classList.contains('sidebar-closed')) {
        sidebar.style.width = `${sidebarWidth}px`;
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

        sidebarWidth = newWidth;
        sidebar.style.width = `${newWidth}px`;
    };

    const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.cursor = '';
        document.body.classList.remove('select-none');
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        localStorage.setItem('sidebarWidth', sidebarWidth);
    };

    resizer.addEventListener('mousedown', startResize);
}

/**
 * ランダムなカラーを生成（新規プロジェクト等用）
 */
export function getRandomColor() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * プロジェクト名を取得するUIヘルパー
 */
export function getProjectName(projectId, allProjects = []) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}