// @ts-nocheck
// ビュー表示のヘルパー関数（ハイライト、ヘッダー更新など）

import { getTimeBlockById } from '../store/timeblocks.js';

/**
 * 指定した要素を表示し、残りを非表示にする。
 * ★修正: exportを追加してビルドエラーを解消
 */
export function showView(show, hides) {
    hides.forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('animate-fade-in');
    });

    show.classList.remove('hidden');
}

/**
 * サイドバーの選択項目をハイライトする
 * @param {object} filter - 現在のフィルター設定
 */
export function highlightSidebarItem(filter) {
    // 1. 全てのハイライトを解除
    document.querySelectorAll('.sidebar-item-row').forEach(el => {
        el.classList.remove('bg-blue-600', 'dark:bg-blue-600', 'text-white', 'dark:text-white', 'hover:bg-blue-700', 'dark:hover:bg-blue-700');
        el.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
        
        const icon = el.querySelector('svg, span');
        if (icon) {
            icon.classList.remove('text-white', 'dark:text-white');
            if (el.id.startsWith('nav-') || el.dataset.type === 'project') {
                 icon.classList.add('text-gray-400'); 
            }
        }
    });

    let targetItem = null;

    if (filter.type === 'inbox' || filter.type === 'dashboard' || filter.type === 'search' || filter.type === 'settings') {
        targetItem = document.getElementById(`nav-${filter.type}`);
    } else if (filter.type === 'project' || filter.type === 'timeblock' || filter.type === 'duration') {
        const selector = `.sidebar-item-row[data-type="${filter.type}"][data-id="${filter.id}"]`;
        targetItem = document.querySelector(selector);
    } else if (filter.type === 'custom') {
        const selector = `.sidebar-item-row[data-type="filter"][data-id="${filter.id}"]`;
        targetItem = document.querySelector(selector);
    }
    
    if (targetItem) {
        applyHighlightClasses(targetItem);
    }
}

function applyHighlightClasses(el) {
    el.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-800');
    el.classList.add('bg-blue-600', 'dark:bg-blue-600', 'text-white', 'dark:text-white', 'hover:bg-blue-700', 'dark:hover:bg-blue-700');
    
    const icon = el.querySelector('svg, span');
    if (icon) {
        icon.classList.remove('text-gray-400');
        icon.classList.add('text-white', 'dark:text-white');
    }
}

/**
 * ヘッダータイトルを更新する
 */
export function updateHeaderTitle(text) {
    const el = document.getElementById('header-title');
    if (el) el.textContent = text;
    // タブタイトルは固定のため更新しない
    // document.title = `${text} | TaskMg`;
}

/**
 * 現在のフィルターに基づいてヘッダータイトルを更新する
 */
export function updateHeaderTitleByFilter(filter, allProjects, allLabels) {
    if (filter.type === 'project') {
        const p = allProjects.find(x => x.id === filter.id);
        updateHeaderTitle(p ? p.name : '不明なプロジェクト');
    } else if (filter.type === 'label') {
        const l = allLabels.find(x => x.id === filter.id);
        updateHeaderTitle(l ? l.name : '不明なラベル');
    } else if (filter.type === 'timeblock') {
        if (filter.id === 'unassigned') {
            updateHeaderTitle('時間帯: 未定');
        } else {
            const block = getTimeBlockById(filter.id);
            updateHeaderTitle(block ? `時間帯: ${block.start} - ${block.end}` : '時間帯: 不明');
        }
    } else if (filter.type === 'duration') {
        updateHeaderTitle(`所要時間: ${filter.id}分`);
    } else {
        updateHeaderTitle('インボックス');
    }
}

export function renderLoginState() {
    const v = document.getElementById('task-view');
    const d = document.getElementById('dashboard-view');
    const s = document.getElementById('settings-view');

    if (v) v.innerHTML = `<div class="p-10 text-center text-gray-400">ログインしてください</div>`;
    if (d) d.innerHTML = '';
    if (s) s.innerHTML = '';
}