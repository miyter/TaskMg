/**
 * サイドバー関連のユーティリティ
 */
import { SIDEBAR_CONFIG } from './sidebar-constants.js';
import { getProjects } from '../store/projects.js';

export const isDesktop = () => window.innerWidth >= SIDEBAR_CONFIG.BREAKPOINT_MD;

export const getStoredBool = (key, defaultValue = true) => {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true';
};

export const isSidebarCompact = () => getStoredBool(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, false);

export const countActiveTasks = (tasks, predicate) => {
    if (!Array.isArray(tasks)) return 0;
    return tasks.filter(t => t.status !== 'completed' && predicate(t)).length;
};

/**
 * リサイズ機能のセットアップ（堅牢化）
 */
export function setupResizer(sidebar, resizer) {
    if (!resizer || !sidebar) return;

    const savedWidth = localStorage.getItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH);
    const initialWidth = savedWidth ? parseInt(savedWidth, 10) : SIDEBAR_CONFIG.DEFAULT_WIDTH;
    
    if (!sidebar.classList.contains(SIDEBAR_CONFIG.CLASSES.CLOSED)) {
        sidebar.style.width = `${initialWidth}px`;
    }

    let isResizing = false;

    const resize = (e) => {
        if (!isResizing) return;
        const { MIN_WIDTH, MAX_WIDTH } = SIDEBAR_CONFIG;
        const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, e.clientX));
        sidebar.style.width = `${newWidth}px`;
    };

    const stopResize = () => {
        if (!isResizing) return;
        isResizing = false;
        document.body.style.cursor = '';
        document.body.classList.remove('select-none');
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
        
        const finalWidth = parseInt(sidebar.style.width, 10);
        if (!isNaN(finalWidth)) {
            localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.WIDTH, finalWidth);
        }
    };

    const startResize = (e) => {
        if (sidebar.classList.contains(SIDEBAR_CONFIG.CLASSES.CLOSED)) return;
        isResizing = true;
        document.body.style.cursor = 'col-resize';
        document.body.classList.add('select-none');
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
        e.preventDefault();
    };

    // 既存のリスナーを一度クリアしたいが、無名関数ではないので上書きに頼る
    resizer.onmousedown = startResize;
}

export function getRandomColor() {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function getProjectName(projectId, allProjects = null) {
    if (!projectId || projectId.toLowerCase() === 'inbox') return 'インボックス';
    const projects = allProjects || getProjects();
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '未分類';
}