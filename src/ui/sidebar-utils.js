// @ts-nocheck
// @miyter:20251129
// サイドバーの状態管理、ユーティリティ、レイアウト制御

// 内部状態変数（リサイズ、開閉）
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
    // ui-view-managerのgetCurrentFilterに依存
    // ここでは循環参照を避けるため、実装を省略またはApp.js側で取得
    // ★暫定: App.jsから渡される想定
    return { type: 'inbox', id: null }; 
}

export function getCurrentFilterData(allProjects, allLabels) {
    const filter = getCurrentFilter(); // ★実際のgetCurrentFilterロジックを呼び出す
    if (filter.type === 'project') {
        return allProjects.find(p => p.id === filter.id);
    } else if (filter.type === 'label') {
        return allLabels.find(l => l.id === filter.id);
    } else if (['inbox', 'dashboard', 'settings'].includes(filter.type)) {
        return true; 
    }
    return null;
}

// ==========================================================
// UI状態制御 (開閉/リサイズ)
// ==========================================================

// 動的幅クラスを削除する正規表現ヘルパー
const removeDynamicWidthClasses = (element) => {
    // 'w-[...px]' の形式のクラスを全て削除
    element.classList.remove(...Array.from(element.classList).filter(c => c.startsWith('w-[')));
};

export function updateSidebarState(sidebar, mainContent) {
    const storedState = localStorage.getItem('sidebarCollapsed');
    isSidebarCollapsed = storedState === 'true';

    if (isSidebarCollapsed) {
        // 閉じる
        sidebar.classList.add('w-0', 'p-0');
        removeDynamicWidthClasses(sidebar); 
        mainContent.style.marginLeft = '0px';
    } else {
        // 開く
        sidebar.classList.remove('w-0', 'p-0');
        removeDynamicWidthClasses(sidebar);
        sidebar.classList.add(`w-[${sidebarWidth}px]`);
        mainContent.style.marginLeft = `${sidebarWidth}px`; 
    }
}

export function setupResizer(sidebar, mainContent, resizer) {
    if (!resizer) return;
    let isResizing = false;

    // 初期設定
    if (sidebar) {
        const storedWidth = localStorage.getItem('sidebarWidth');
        sidebarWidth = storedWidth ? parseInt(storedWidth, 10) : 280;
        
        removeDynamicWidthClasses(sidebar);
        sidebar.classList.add(`w-[${sidebarWidth}px]`);
        mainContent.style.marginLeft = `${sidebarWidth}px`;
    }

    const startResize = (e) => {
        if (isSidebarCollapsed) return;
        isResizing = true;
        document.body.style.cursor = 'col-resize';
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
        
        removeDynamicWidthClasses(sidebar);
        sidebar.classList.add(`w-[${newWidth}px]`);

        mainContent.style.marginLeft = `${newWidth}px`; 
    };

    const stopResize = () => {
        isResizing = false;
        document.body.style.cursor = '';
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

/**
 * プロジェクトIDからプロジェクト名を取得する
 * @param {string | null} projectId - 取得したいプロジェクトID
 * @param {Array<object>} allProjects - 全プロジェクトのリスト
 * @returns {string} プロジェクト名 ('インボックス' or '未分類'を含む)
 */
export function getProjectName(projectId, allProjects = []) {
    if (!projectId || projectId === 'inbox' || projectId === 'INBOX') return 'インボックス';
    if (!allProjects || !Array.isArray(allProjects)) return '未分類';
    const project = allProjects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}