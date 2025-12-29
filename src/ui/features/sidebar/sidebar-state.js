
// UI要素のキャッシュをシングルトン的に管理
let UI = {};

export function cacheSidebarElements() {
    UI = {
        container: document.getElementById('sidebar-content'),
        sidebar: document.getElementById('sidebar'),
        resizer: document.getElementById('sidebar-resizer'),
        openBtn: document.getElementById('sidebar-open-btn'),
        closeBtn: document.getElementById('sidebar-close-btn'),
        inbox: document.getElementById('nav-inbox')
    };
    return UI;
}

export function getSidebarUI() {
    return UI;
}
