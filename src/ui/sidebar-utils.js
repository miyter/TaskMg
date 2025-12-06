// @ts-nocheck
// @miyter:20251129
// サイドバーの状態管理、ユーティリティ

// 内部状態変数
let isSidebarCollapsed = false;
let sidebarWidth = 280; 
let labelMap = {};

// ==========================================================
// 状態/マップ管理
// ==========================================================

export function setLabelMap(labels) {
    labelMap = {};
    labels.forEach(l => labelMap[l.id] = l);
}

export function getLabelDetails(labelId) {
    return labelMap[labelId];
}

export function getCurrentFilter() {
    // 暫定: App.jsから渡される想定
    return { type: 'inbox', id: null }; 
}

export function getCurrentFilterData(allProjects, allLabels) {
    // 簡易実装
    return null;
}

// ==========================================================
// UI状態制御 (開閉/リサイズ)
// ==========================================================

export function updateSidebarState(sidebar, mainContent) {
    const storedState = localStorage.getItem('sidebarCollapsed');
    isSidebarCollapsed = storedState === 'true';

    if (isSidebarCollapsed) {
        // 閉じる: 幅を0にして非表示に
        sidebar.style.width = '0px';
        sidebar.style.padding = '0px';
        sidebar.classList.add('invisible'); // 中身も見えなくする
    } else {
        // 開く: 保存された幅に戻す
        sidebar.style.width = `${sidebarWidth}px`;
        sidebar.style.padding = ''; // paddingをリセット
        sidebar.classList.remove('invisible');
    }
    // ★削除: mainContent.style.marginLeft の操作は不要（Flexboxが自動調整するため）
}

export function setupResizer(sidebar, mainContent, resizer) {
    if (!resizer) return;
    let isResizing = false;

    // 初期化
    if (sidebar) {
        const storedWidth = localStorage.getItem('sidebarWidth');
        sidebarWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
        
        if (!isSidebarCollapsed) {
            sidebar.style.width = `${sidebarWidth}px`;
        }
    }

    const startResize = (e) => {
        if (isSidebarCollapsed) return;
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.classList.add('select-none'); // ドラッグ中の選択防止
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
        
        // ★削除: mainContent.style.marginLeft の操作は不要
    };

    const stopResize = () => {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.classList.remove('select-none');
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        localStorage.setItem('sidebarWidth', sidebarWidth);
    };

    resizer.addEventListener('mousedown', startResize);
}

// ==========================================================
// ユーティリティ
// ==========================================================

export function getRandomColor() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function getProjectName(projectId, allProjects = []) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    if (!allProjects || !Array.isArray(allProjects)) return '未分類';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}