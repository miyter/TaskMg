// モジュール分割によるリファクタリング (2025-12-29)
import { MOCK_DATA } from './dashboard-data.js';
import { renderHeader, renderTabs } from './components/header.js';
import { renderBackwardView } from './views/backward-view.js';
import { renderWoopView } from './views/woop-view.js';
import { renderOkrView } from './views/okr-view.js';

// 状態管理
let currentTab = 'backward'; // 'backward' | 'woop' | 'okr'

export function renderTargetDashboard(container) {
    if (!container) return;

    // ヘッダー（共通）
    const headerHtml = renderHeader(MOCK_DATA.kgi);

    // タブナビゲーション
    const tabsHtml = renderTabs(currentTab);

    // コンテンツエリア
    let contentHtml = '';
    switch (currentTab) {
        case 'backward':
            contentHtml = renderBackwardView(MOCK_DATA.backward);
            break;
        case 'woop':
            contentHtml = renderWoopView(MOCK_DATA.woop);
            break;
        case 'okr':
            contentHtml = renderOkrView(MOCK_DATA.okr);
            break;
    }

    container.innerHTML = `
        <div class="h-full flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div class="flex-none p-6 pb-0">
                ${headerHtml}
                ${tabsHtml}
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-6">
                ${contentHtml}
            </div>
        </div>
    `;

    // イベントリスナー設定
    setupEventListeners(container);
}

function setupEventListeners(container) {
    // タブ切り替え
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentTab = e.target.dataset.tab;
            renderTargetDashboard(container);
        });
    });
}
