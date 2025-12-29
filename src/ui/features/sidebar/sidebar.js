/**
 * サイドバーの初期化および統合管理モジュール
 * 機能ごとのロジックは以下のモジュールに分割されています：
 * - sidebar-state.js: DOM要素のキャッシュ管理
 * - sidebar-view.js: 表示制御、密度設定、ハンバーガーメニュー
 * - sidebar-events.js: クリック、右クリックイベントのハンドリング
 */
import { setupResizer, getSidebarDensity } from './sidebar-utils.js';
import { buildSidebarHTML, setupSidebarToggles, setupSectionDragAndDrop } from './sidebar-structure.js';
import { setupDropZone } from './sidebar-drag-drop.js';
import { initSidebarProjects, updateSidebarProjects } from './SidebarProjects.js';
import { renderSidebarItems, updateInboxCount } from './sidebar-renderer.js';

import { APP_EVENTS } from '../../../core/event-constants';

// 分割したモジュールのインポート
import { cacheSidebarElements } from './sidebar-state.js';
import {
    initializeSidebarToggles,
    updateSidebarVisibility,
    applyDensityMode,
    setupDensityModeListener
} from './sidebar-view.js';
import { setupSidebarEvents } from './sidebar-events.js';

// 外部公開用エイリアス
export { updateSidebarProjects as renderProjects, updateInboxCount };

// イベントハンドラキャッシュ
let refreshSidebarHandler = null;
let resizeHandler = null;

/**
 * サイドバー初期化
 */
export function initSidebar() {
    // 初回キャッシュ
    let UI = cacheSidebarElements();
    if (!UI.container) return;

    // HTML構築
    UI.container.innerHTML = buildSidebarHTML();

    // HTML更新後に再キャッシュ（重要）
    UI = cacheSidebarElements();

    // ユーティリティセットアップ
    setupResizer(UI.sidebar, UI.resizer);
    setupSidebarEvents(); // イベントリスナー登録
    setupSidebarToggles(); // セクションアコーディオンのセットアップ
    setupSectionDragAndDrop();
    setupDataEventListeners();

    if (UI.inbox) setupDropZone(UI.inbox, 'inbox');

    // プロジェクト一覧の初期化
    initSidebarProjects(UI.container);

    // リサイズ監視（既存があれば解除）
    if (resizeHandler) window.removeEventListener('resize', resizeHandler);
    resizeHandler = () => updateSidebarVisibility();
    window.addEventListener('resize', resizeHandler);

    // 初期表示状態の適用
    updateSidebarVisibility();

    // 密度設定の適用
    const density = getSidebarDensity();
    applyDensityMode(density);
    setupDensityModeListener();

    // ハンバーガーメニューの初期化（DOM待機ロジック付き）
    initializeSidebarToggles();

    // 初回描画を強制実行
    if (refreshSidebarHandler) refreshSidebarHandler();
}

/**
 * データ更新イベントの監視（クリーンアップ付き）
 */
function setupDataEventListeners() {
    const updateEvents = [
        APP_EVENTS.TIMEBLOCKS_UPDATED, APP_EVENTS.PROJECTS_UPDATED, APP_EVENTS.LABELS_UPDATED,
        APP_EVENTS.FILTERS_UPDATED, APP_EVENTS.TASKS_UPDATED
    ];

    if (refreshSidebarHandler) {
        updateEvents.forEach(ev => document.removeEventListener(ev, refreshSidebarHandler));
    }

    refreshSidebarHandler = () => {
        renderSidebarItems();

        // 動的アイテム描画後に密度設定を再適用
        const density = getSidebarDensity();
        applyDensityMode(density);
    };

    updateEvents.forEach(ev => document.addEventListener(ev, refreshSidebarHandler));
}
