// @ts-nocheck
// @miyter:20251221
// サイドバーのHTML構造生成とセクション開閉ロジック

/**
 * セクションヘッダーの共通テンプレート
 */
function createSectionHeader(title, targetId, hasAddButton = false, buttonId = '') {
    const addButton = hasAddButton ? `
        <button id="${buttonId}" class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </button>
    ` : '';

    return `
        <div class="flex items-center justify-between px-3 py-2 group cursor-pointer sidebar-section-header" data-target="${targetId}">
            <div class="flex items-center min-w-0">
                <svg class="w-3 h-3 text-gray-400 mr-2 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">${title}</h3>
            </div>
            ${addButton}
        </div>
    `;
}

/**
 * サイドバーの静的DOM構造を生成
 */
export function buildSidebarHTML() {
    return `
        <div class="mt-2 select-none">
            <!-- 1. 基本項目 -->
            ${createSectionHeader('基本項目', 'basic-list')}
            <ul id="basic-list" class="space-y-0.5 mb-4 pl-1">
                <li>
                    <a href="#" id="nav-dashboard" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                        ダッシュボード
                    </a>
                </li>
                <li>
                    <a href="#" id="nav-inbox" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                        <span class="flex-1">インボックス</span>
                        <span id="inbox-count" class="hidden bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-semibold">0</span>
                    </a>
                </li>
                <li>
                    <a href="#" id="nav-search" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        検索
                    </a>
                </li>
                <li>
                    <a href="#" id="nav-settings" class="sidebar-item-row group flex items-center px-3 py-1.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
                        <svg class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                        設定
                    </a>
                </li>
            </ul>

            <!-- 2. プロジェクト (マウントポイント) -->
            <div id="projects-mount-point"></div>

            <!-- 3. 時間帯 -->
            ${createSectionHeader('時間帯', 'timeblock-list', true, 'edit-timeblocks-btn')}
            <ul id="timeblock-list" class="space-y-0.5 mb-4 pl-1"></ul>

            <!-- 4. 所要時間 -->
            ${createSectionHeader('所要時間', 'duration-list')}
            <ul id="duration-list" class="space-y-0.5 mb-4 pl-1"></ul>

            <!-- 5. フィルター -->
            ${createSectionHeader('フィルター', 'filter-list', true, 'add-filter-btn')}
            <ul id="filter-list" class="space-y-0.5 pl-1"></ul>
        </div>
    `;
}

/**
 * サイドバーの開閉トグル設定
 */
export function setupSidebarToggles() {
    document.querySelectorAll('.sidebar-section-header').forEach(header => {
        const targetId = header.dataset.target;
        const list = document.getElementById(targetId);
        const icon = header.querySelector('svg');
        if (!list || !icon) return;

        // 状態の復元
        const savedState = localStorage.getItem(`sidebar:${targetId}-open`);
        const isOpen = savedState === null ? true : savedState === 'true';

        const updateState = (open) => {
            list.classList.toggle('hidden', !open);
            icon.style.transform = open ? 'rotate(0deg)' : 'rotate(-90deg)';
        };

        updateState(isOpen);

        header.addEventListener('click', (e) => {
            if (e.target.closest('button')) return; // ボタンクリック時は無視
            const newState = list.classList.contains('hidden');
            updateState(newState);
            localStorage.setItem(`sidebar:${targetId}-open`, newState);
        });
    });
}