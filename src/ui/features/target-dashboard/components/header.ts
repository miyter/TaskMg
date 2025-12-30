export interface KGIStatus {
    title: string;
    progress: number;
    status: 'good' | 'warning' | 'danger';
    daysLeft: number;
}

export function renderHeader(kgi: KGIStatus, currentTab: string): string {
    const statusColors: Record<string, string> = {
        good: 'text-emerald-500',
        warning: 'text-amber-500',
        danger: 'text-red-500'
    };
    const progressColor: Record<string, string> = {
        good: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-red-500'
    };

    const statusColor = statusColors[kgi.status] || 'text-gray-500';
    const barColor = progressColor[kgi.status] || 'bg-gray-500';

    const tabs = [
        { id: 'backward', label: 'Backward Map', icon: '🗺️' },
        { id: 'woop', label: 'WOOP Board', icon: '✨' },
        { id: 'okr', label: 'OKR Tree', icon: '🎯' }
    ];

    return `
        <!-- コンパクトヘッダー: 1行レイアウト + タブ統合 -->
        <div id="dashboard-header" class="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 mx-4 mt-4">
            <!-- メインヘッダー行 -->
            <div class="px-6 py-4 flex items-center justify-between gap-6">
                <!-- 左: 目標タイトル（省略可能） -->
                <div class="flex-1 min-w-0">
                    <h1 id="header-title" class="font-bold text-gray-900 dark:text-white truncate transition-all duration-300">
                        ${kgi.title}
                    </h1>
                </div>

                <!-- 中央: 進捗バー -->
                <div class="flex-1 max-w-md">
                    <div class="flex items-center gap-3">
                        <div class="flex-1">
                            <div class="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div style="width:${kgi.progress}%" class="h-full ${barColor} transition-all duration-1000 ease-out rounded-full"></div>
                            </div>
                        </div>
                        <span class="font-black ${statusColor} tabular-nums text-sm whitespace-nowrap">
                            ${kgi.progress}%
                        </span>
                    </div>
                </div>

                <!-- 右: 残り日数 + タブ + トグル -->
                <div class="flex items-center gap-6 flex-shrink-0">
                    <!-- 残り日数 -->
                    <div class="text-center">
                        <div class="text-xs text-gray-500 dark:text-gray-400">残り</div>
                        <div class="font-black ${statusColor} tabular-nums">
                            ${kgi.daysLeft}<span class="text-xs font-medium ml-0.5 text-gray-400">日</span>
                        </div>
                    </div>

                    <!-- タブ（コンパクト版） -->
                    <div class="flex gap-1 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-lg">
                        ${tabs.map(tab => `
                            <button 
                                class="tab-btn group px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currentTab === tab.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}"
                                data-tab="${tab.id}"
                                title="${tab.label}">
                                <span class="hidden sm:inline">${tab.label}</span>
                                <span class="sm:hidden">${tab.icon}</span>
                            </button>
                        `).join('')}
                    </div>

                    <!-- トグルボタン -->
                    <button id="header-toggle" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="ヘッダーを折りたたむ">
                        <svg id="toggle-icon" class="w-4 h-4 text-gray-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// タブレンダリング関数は不要になったため削除
export function renderTabs(currentTab: string): string {
    // 後方互換性のため空文字列を返す
    return '';
}
