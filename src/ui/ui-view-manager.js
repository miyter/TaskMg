// @ts-nocheck
// ビューの表示制御とヘッダー更新ロジック

import { renderDashboard } from './dashboard.js';
import { renderTaskView } from './task-view.js';
import { initSettings } from './settings.js';
import { filterTasks } from '../logic/search.js';
import { 
    buildDashboardViewHTML, 
    buildSettingsViewHTML, 
    renderKPIItem 
} from './ui-dom-utils.js';

let currentFilter = { type: 'inbox', id: null };

/**
 * 現在のフィルター設定を更新する。
 * @param {object} filter - 新しいフィルター設定
 */
export function setCurrentFilter(filter) {
    currentFilter = filter;
}

/**
 * 現在のフィルター設定を取得する。
 * @returns {object}
 */
export function getCurrentFilter() {
    return currentFilter;
}

/**
 * ビューを切り替えて描画を行う。
 * @param {Array} allTasks - 全タスクデータ
 * @param {Array} allProjects - 全プロジェクトデータ
 * @param {Array} allLabels - 全ラベルデータ
 */
export function updateView(allTasks, allProjects, allLabels) { // allProjectsを受け取る
    const taskView = document.getElementById('task-view');
    const dashboardView = document.getElementById('dashboard-view');
    const settingsView = document.getElementById('settings-view');

    if (!taskView || !dashboardView || !settingsView) return;

    const searchKeyword = document.getElementById('search-input')?.value || '';
    const toggleButton = document.getElementById('toggle-completed-btn');
    const showCompleted = toggleButton?.classList.contains('text-blue-500') || false;
    
    // --- ビュー切り替えロジック ---
    if (currentFilter.type === 'dashboard') {
        showView(dashboardView, [taskView, settingsView]);
        
        // DashboardのDOMを生成してからChart関数を呼び出す
        dashboardView.innerHTML = buildDashboardViewHTML(renderKPIItem);
        renderDashboard(allTasks, allProjects);
        
        updateHeaderTitle('ダッシュボード');
        return;
    }
    
    if (currentFilter.type === 'settings') {
        showView(settingsView, [taskView, dashboardView]);

        // SettingsのDOMを生成してからinitSettingsを呼び出す
        settingsView.innerHTML = buildSettingsViewHTML();
        initSettings(); 
        
        updateHeaderTitle('設定');
        return;
    }

    // タスクビュー表示
    showView(taskView, [dashboardView, settingsView]);

    const filteredTasks = filterTasks(allTasks, {
        projectId: currentFilter.type === 'project' ? currentFilter.id : null, 
        labelId: currentFilter.type === 'label' ? currentFilter.id : null,     
        keyword: searchKeyword,
        showCompleted: showCompleted
    });

    // ★修正: renderTaskViewにallProjectsを追加
    renderTaskView(
        filteredTasks, 
        allProjects, // ★追加: プロジェクトデータを渡す
        currentFilter.type === 'project' ? currentFilter.id : null, 
        currentFilter.type === 'label' ? currentFilter.id : null
    );
    
    updateHeaderTitleByFilter(allProjects, allLabels);
}

/**
 * 指定した要素を表示し、残りを非表示にする。
 */
function showView(show, hides) {
    show.classList.remove('hidden');
    hides.forEach(el => el.classList.add('hidden'));
}

/**
 * ヘッダータイトルを更新する。
 */
function updateHeaderTitle(text) {
    const el = document.getElementById('header-title');
    if (el) el.textContent = text;
}

/**
 * 現在のフィルターに基づいてヘッダータイトルを更新する。
 */
function updateHeaderTitleByFilter(allProjects, allLabels) {
    if (currentFilter.type === 'project') {
        const p = allProjects.find(x => x.id === currentFilter.id);
        updateHeaderTitle(p ? p.name : '不明なプロジェクト');
    } else if (currentFilter.type === 'label') {
        const l = allLabels.find(x => x.id === currentFilter.id);
        updateHeaderTitle(l ? l.name : '不明なラベル');
    } else {
        updateHeaderTitle('インボックス');
    }
}

/**
 * ログインが必要な旨を画面に表示する。
 */
export function renderLoginState() {
    const v = document.getElementById('task-view');
    const d = document.getElementById('dashboard-view');
    const s = document.getElementById('settings-view');

    if (v) v.innerHTML = `<div class="p-10 text-center text-gray-400">ログインしてください</div>`;
    if (d) d.innerHTML = '';
    if (s) s.innerHTML = '';
}