/**
 * 更新日: 2025-12-21
 * 内容: clearSidebarHighlight のエクスポート追加、定数連携の強化
 */
import { UI_VIEW_CONFIG } from './ui-view-constants.js';
import { getTimeBlockById } from '../store/timeblocks.js';

const { CLASSES, HEADER_IDS, DATA_ATTRS } = UI_VIEW_CONFIG;

/**
 * 指定した要素を表示し、残りを非表示にする
 */
export function showView(activeView, otherViews) {
    otherViews.forEach(v => {
        v.classList.add(CLASSES.HIDDEN);
        v.classList.remove(CLASSES.FADE_IN);
    });
    activeView.classList.remove(CLASSES.HIDDEN);
    activeView.classList.add(CLASSES.FADE_IN);
}

/**
 * サイドバーの全ハイライトを解除
 */
export function clearSidebarHighlight() {
    document.querySelectorAll('.sidebar-item-row').forEach(el => {
        el.classList.remove(...CLASSES.HIGHLIGHT);
        el.classList.add(...CLASSES.NORMAL);
        
        const icon = el.querySelector('svg, span:not(.truncate)');
        if (icon) {
            icon.classList.remove('text-white');
            const defaultColor = el.getAttribute(DATA_ATTRS.DEFAULT_COLOR) || 'text-gray-400';
            icon.classList.add(defaultColor);
        }
    });
}

/**
 * サイドバーのハイライトを更新
 */
export function highlightSidebarItem(filter) {
    clearSidebarHighlight();

    const target = getSidebarTarget(filter);
    if (target) {
        target.classList.remove(...CLASSES.NORMAL);
        target.classList.add(...CLASSES.HIGHLIGHT);
        
        const icon = target.querySelector('svg, span:not(.truncate)');
        if (icon) {
            // グレー系のクラスを確実に除去してから白を適用
            icon.classList.remove('text-gray-400', 'text-gray-500');
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
    
    if (['inbox', 'dashboard', 'search', 'settings'].includes(type)) {
        return document.getElementById(`nav-${type}`);
    }
    if (type === 'custom') {
        return document.querySelector(`.sidebar-item-row[data-type="filter"][data-id="${id}"]`);
    }
    return document.querySelector(`.sidebar-item-row[data-type="${type}"][data-id="${id}"]`);
}

/**
 * フィルターに応じたヘッダータイトルの更新
 */
export function updateHeaderTitleByFilter(filter, allProjects = [], allLabels = []) {
    const elTitle = document.getElementById(HEADER_IDS.TITLE);
    const elCount = document.getElementById(HEADER_IDS.COUNT);
    if (!elTitle) return;

    let title = 'インボックス';
    const { type, id } = filter;

    switch (type) {
        case 'project':
            const p = allProjects.find(x => x.id === id);
            title = p ? p.name : 'プロジェクト';
            break;
        case 'label':
            const l = allLabels.find(x => x.id === id);
            title = l ? `ラベル: ${l.name}` : 'ラベル';
            break;
        case 'timeblock':
            if (id === 'unassigned') {
                title = '時間帯: 未定';
            } else {
                const b = getTimeBlockById(id);
                title = b ? `時間帯: ${b.start} - ${b.end}` : '時間帯';
            }
            break;
        case 'duration':
            title = `所要時間: ${id}分`;
            break;
        case 'search':
            title = 'タスク検索';
            break;
        case 'dashboard':
            title = 'ダッシュボード';
            break;
    }

    elTitle.textContent = title;
    // 特定のビューではカウント表示をクリア
    if (elCount && ['dashboard', 'search'].includes(type)) {
        elCount.textContent = '';
    }
}

/**
 * 未ログイン時の表示状態をレンダリング
 */
export function renderLoginState() {
    const { VIEW_IDS } = UI_VIEW_CONFIG;
    Object.values(VIEW_IDS).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = id === VIEW_IDS.TASK 
            ? `<div class="p-20 text-center text-gray-400 font-medium">ログインしてください</div>` 
            : '';
    });
}