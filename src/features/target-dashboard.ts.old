// モジュール分割によるリファクタリング (2025-12-29)
import { renderHeader } from './components/header';
import { MOCK_DATA } from './dashboard-data';
import { renderBackwardView } from './views/backward-view';
import { renderOkrView } from './views/okr-view';
import { renderWoopView } from './views/woop-view';

// 状態管理
let currentTab = 'backward'; // 'backward' | 'woop' | 'okr'
let isHeaderCollapsed = false;

export function renderTargetDashboard(container: HTMLElement | null) {
    if (!container) return;

    // ヘッダー（タブ統合版）
    const headerHtml = renderHeader(MOCK_DATA.kgi, currentTab);

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
            ${headerHtml}
            <div class="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                ${contentHtml}
            </div>
        </div>
    `;

    // イベントリスナー設定
    setupEventListeners(container);
}

function setupEventListeners(container: HTMLElement) {
    // タブ切り替え
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            currentTab = (target.closest('.tab-btn') as HTMLElement).dataset.tab || 'backward';
            renderTargetDashboard(container);
        });
    });

    // ヘッダートグル
    const toggleBtn = container.querySelector('#header-toggle');
    const header = container.querySelector('#dashboard-header');
    const title = container.querySelector('#header-title');
    const toggleIcon = container.querySelector('#toggle-icon') as HTMLElement;

    if (toggleBtn && header && title && toggleIcon) {
        toggleBtn.addEventListener('click', () => {
            isHeaderCollapsed = !isHeaderCollapsed;

            if (isHeaderCollapsed) {
                // 折りたたみ状態
                header.classList.add('py-2');
                header.classList.remove('py-4');
                title.classList.add('text-sm', 'opacity-50');
                title.classList.remove('text-base');
                toggleIcon.style.transform = 'rotate(180deg)';
            } else {
                // 展開状態
                header.classList.remove('py-2');
                header.classList.add('py-4');
                title.classList.remove('text-sm', 'opacity-50');
                title.classList.add('text-base');
                toggleIcon.style.transform = 'rotate(0deg)';
            }
        });
    }
}
