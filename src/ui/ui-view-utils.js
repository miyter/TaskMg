import { UI_CONFIG, SIDEBAR_TYPE } from './ui-view-constants.js';
import { getTimeBlockById } from '../store/timeblocks.js';

const { CLASSES, HEADER_IDS, DATA_ATTRS } = UI_CONFIG;

/**
 * 更新日: 2025-12-27
 * 内容: showView を完全に null-safe 化。Optional Chaining を導入し classList の参照エラーを封殺。
 */
export function showView(activeView, otherViews) {
    if (Array.isArray(otherViews)) {
        otherViews.forEach(v => {
            // 要素が存在し、かつ classList を持っている場合のみ操作
            v?.classList?.add(CLASSES.HIDDEN);
            v?.classList?.remove(CLASSES.FADE_IN);
        });
    }
    
    if (activeView?.classList) {
        activeView.classList.remove(CLASSES.HIDDEN);
        activeView.classList.add(CLASSES.FADE_IN);
    }
}

/**
 * サイドバーの全ハイライトを解除
 */
export function clearSidebarHighlight() {
    document.querySelectorAll('.sidebar-item-row').forEach(el => {
        el.classList.remove(...(Array.isArray(CLASSES.HIGHLIGHT) ? CLASSES.HIGHLIGHT : [CLASSES.HIGHLIGHT]));
        el.classList.add(...(Array.isArray(CLASSES.NORMAL) ? CLASSES.NORMAL : [CLASSES.NORMAL]));
        
        const icon = el.querySelector('svg, span:not(.truncate)');
        if (icon) {
            const textClasses = Array.from(icon.classList).filter(c => c.startsWith('text-'));
            if (textClasses.length > 0) icon.classList.remove(...textClasses);
            
            const defaultColor = el.getAttribute(DATA_ATTRS.DEFAULT_COLOR);
            if (defaultColor) {
                icon.classList.add(defaultColor);
            }
        }
    });
}

/**
 * サイドバーのハイライトを更新
 */
export function highlightSidebarItem(filter) {
    clearSidebarHighlight();

    const target = getSidebarTarget(filter);
    if (target?.classList) {
        target.classList.remove(...(Array.isArray(CLASSES.NORMAL) ? CLASSES.NORMAL : [CLASSES.NORMAL]));
        target.classList.add(...(Array.isArray(CLASSES.HIGHLIGHT) ? CLASSES.HIGHLIGHT : [CLASSES.HIGHLIGHT]));
        
        const icon = target.querySelector('svg, span:not(.truncate)');
        if (icon) {
            const textClasses = Array.from(icon.classList).filter(c => c.startsWith('text-'));
            if (textClasses.length > 0) icon.classList.remove(...textClasses);
            icon.classList.add('text-white');
        }
    }
}

/**
 * フィルター情報からサイドバーのターゲット要素を取得
 */
function getSidebarTarget(filter) {
    if (!filter) return null;
    const { type, id } = filter;
    
    const navTypes = ['inbox', 'dashboard', 'search', 'settings'];
    if (navTypes.includes(type)) {
        return document.getElementById(`nav-${type}`);
    }

    const typeAttr = type === 'custom' ? SIDEBAR_TYPE.FILTER : type;
    return document.querySelector(`.sidebar-item-row[data-type="${typeAttr}"][data-id="${id}"]`);
}

/**
 * フィルターに応じたヘッダータイトルの更新
 */
export function updateHeaderTitleByFilter(filter, allProjects = [], allLabels = []) {
    const elTitle = document.getElementById(HEADER_IDS.TITLE);
    const elCount = document.getElementById(HEADER_IDS.COUNT);
    if (!elTitle) return;

    let title = 'インボックス';
    const { type, id, name } = filter;

    if (name) {
        title = name;
    } else {
        switch (type) {
            case SIDEBAR_TYPE.PROJECT:
                title = allProjects.find(x => x.id === id)?.name || 'プロジェクト';
                break;
            case SIDEBAR_TYPE.LABEL:
                const l = allLabels.find(x => x.id === id);
                title = l ? `ラベル: ${l.name}` : 'ラベル';
                break;
            case SIDEBAR_TYPE.TIMEBLOCK:
                if (id === 'unassigned') {
                    title = '時間帯: 未定';
                } else {
                    const b = getTimeBlockById(id);
                    title = b ? `時間帯: ${b.start} - ${b.end}` : '時間帯';
                }
                break;
            case SIDEBAR_TYPE.DURATION:
                title = `所要時間: ${id}分`;
                break;
            case 'search':
                title = 'タスク検索';
                break;
            case 'dashboard':
                title = 'ダッシュボード';
                break;
        }
    }

    elTitle.textContent = title;
    if (elCount && ['dashboard', 'search'].includes(type)) {
        elCount.textContent = '';
    }
}

/**
 * 未ログイン時の表示状態をレンダリング
 */
export function renderLoginState() {
    const { VIEW_IDS } = UI_CONFIG;
    Object.values(VIEW_IDS).forEach(id => {
        const el = document.getElementById(id);
        if (!el?.classList) return;
        
        if (id === VIEW_IDS.TASK) {
            el.innerHTML = '';
            const msg = document.createElement('div');
            msg.className = 'p-20 text-center text-gray-400 font-medium';
            msg.textContent = 'ログインしてください';
            el.appendChild(msg);
        } else {
            el.classList.add(CLASSES.HIDDEN);
        }
    });
}