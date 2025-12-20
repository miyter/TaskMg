// @ts-nocheck
// @miyter:20251221
// ビューの表示状態操作（表示切り替え、ハイライト、タイトル更新）

import { getTimeBlockById } from '../store/timeblocks.js';

const HIGHLIGHT_CLASSES = ['bg-blue-600', 'dark:bg-blue-600', 'text-white', 'dark:text-white'];
const NORMAL_CLASSES = ['text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800'];

/**
 * 指定した要素を表示し、残りを非表示にする
 */
export function showView(activeView, otherViews) {
    otherViews.forEach(v => {
        v.classList.add('hidden');
        v.classList.remove('animate-fade-in');
    });
    activeView.classList.remove('hidden');
    activeView.classList.add('animate-fade-in');
}

/**
 * サイドバーのハイライトを更新
 */
export function highlightSidebarItem(filter) {
    // 1. 全てのリセット
    document.querySelectorAll('.sidebar-item-row').forEach(el => {
        el.classList.remove(...HIGHLIGHT_CLASSES);
        el.classList.add(...NORMAL_CLASSES);
        
        const icon = el.querySelector('svg, span:not(.truncate)');
        if (icon) {
            icon.classList.remove('text-white');
            // デフォルトのアイコン色（グレー）を復元
            if (el.id?.startsWith('nav-') || el.dataset.type === 'project') {
                icon.classList.add('text-gray-400');
            }
        }
    });

    // 2. ターゲットの特定と適用
    const target = getSidebarTarget(filter);
    if (target) {
        target.classList.remove(...NORMAL_CLASSES);
        target.classList.add(...HIGHLIGHT_CLASSES);
        
        const icon = target.querySelector('svg, span:not(.truncate)');
        if (icon) {
            icon.classList.remove('text-gray-400');
            icon.classList.add('text-white');
        }
    }
}

/**
 * フィルター情報からサイドバーの要素を取得する内部ヘルパー
 */
function getSidebarTarget({ type, id }) {
    if (['inbox', 'dashboard', 'search', 'settings'].includes(type)) {
        return document.getElementById(`nav-${type}`);
    }
    // カスタムフィルター
    if (type === 'custom') {
        return document.querySelector(`.sidebar-item-row[data-type="filter"][data-id="${id}"]`);
    }
    // プロジェクト、ラベル、時間帯、所要時間
    return document.querySelector(`.sidebar-item-row[data-type="${type}"][data-id="${id}"]`);
}

/**
 * ヘッダータイトルを更新
 */
export function updateHeaderTitle(text) {
    const el = document.getElementById('header-title');
    if (el) el.textContent = text;
}

/**
 * フィルターに応じた動的なタイトル更新
 * @param {Object} filter - 現在のフィルター
 * @param {Array} allProjects - 全プロジェクト
 * @param {Array} allLabels - 全ラベル ★追加
 */
export function updateHeaderTitleByFilter(filter, allProjects, allLabels = []) {
    const { type, id } = filter;

    switch (type) {
        case 'project':
            const p = allProjects.find(x => x.id === id);
            updateHeaderTitle(p ? p.name : 'プロジェクト');
            break;
        case 'label': // ★追加: ラベルフィルタ時のタイトル対応
            const l = allLabels.find(x => x.id === id);
            updateHeaderTitle(l ? `ラベル: ${l.name}` : 'ラベル');
            break;
        case 'timeblock':
            if (id === 'unassigned') {
                updateHeaderTitle('時間帯: 未定');
            } else {
                const b = getTimeBlockById(id);
                updateHeaderTitle(b ? `時間帯: ${b.start} - ${b.end}` : '時間帯');
            }
            break;
        case 'duration':
            updateHeaderTitle(`所要時間: ${id}分`);
            break;
        case 'search':
            updateHeaderTitle('タスク検索');
            break;
        case 'dashboard':
            updateHeaderTitle('ダッシュボード');
            break;
        case 'settings':
            updateHeaderTitle('設定');
            break;
        case 'inbox':
        default:
            updateHeaderTitle('インボックス');
            break;
    }
}

/**
 * 未ログイン時の表示
 */
export function renderLoginState() {
    const viewIds = ['task-view', 'dashboard-view', 'settings-view', 'search-view'];
    viewIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = id === 'task-view' 
            ? `<div class="p-20 text-center text-gray-400 font-medium">ログインしてください</div>` 
            : '';
    });
}