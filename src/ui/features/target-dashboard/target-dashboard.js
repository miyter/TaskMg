// 状態管理
let currentTab = 'backward'; // 'backward' | 'woop' | 'okr'

// モックデータ (実際の運用ではStoreから取得)
const MOCK_DATA = {
    kgi: {
        title: "2025年3月31日までに、月間アクティブユーザー1万人を達成する",
        progress: 65,
        daysLeft: 42,
        status: 'good' // 'good' | 'warning' | 'danger'
    },
    backward: {
        milestones: [
            { date: '2025-03-31', title: 'GOAL: 10,000 MAU達成', type: 'goal', completed: false },
            { date: '2025-02-28', title: 'ベータ版100人配布完了', type: 'milestone', completed: false },
            { date: '2025-02-15', title: 'コア機能実装完了', type: 'milestone', completed: true },
            { date: 'Today', title: '現在地', type: 'current', completed: true },
            { date: '2025-01-10', title: '競合分析完了', type: 'action', completed: true }
        ]
    },
    woop: {
        wish: "毎日30分、英語の勉強をする",
        outcome: "字幕なしで海外ドラマを楽しめるようになり、自信がつく",
        obstacles: [
            { id: 1, text: "仕事で疲れてSNSを見てしまう", plan: "すぐにテキストを開く", overcomeCount: 5 },
            { id: 2, text: "急な残業が入る", plan: "朝15分、夜15分に分割する", overcomeCount: 2 }
        ]
    },
    okr: {
        objective: "世界中のエンジニアに愛される開発ツールを作る",
        keyResults: [
            { id: 1, text: "GitHubスター数 1,000到達", current: 650, target: 1000, confidence: 'high' },
            { id: 2, text: "週間ダウンロード数 500回", current: 320, target: 500, confidence: 'medium' },
            { id: 3, text: "ユーザー継続率 40%維持", current: 35, target: 40, confidence: 'low' }
        ]
    }
};

export function renderTargetDashboard(container) {
    if (!container) return;

    // ヘッダー（共通）
    const headerHtml = renderHeader(MOCK_DATA.kgi);

    // タブナビゲーション
    const tabsHtml = renderTabs();

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

function renderHeader(kgi) {
    const statusColors = {
        good: 'text-emerald-500',
        warning: 'text-amber-500',
        danger: 'text-red-500'
    };
    const progressColor = {
        good: 'bg-emerald-500',
        warning: 'bg-amber-500',
        danger: 'bg-red-500'
    };

    const statusColor = statusColors[kgi.status];
    const barColor = progressColor[kgi.status];

    return `
        <div class="mb-8">
            <div class="flex justify-between items-end mb-2">
                <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight max-w-4xl">
                    ${kgi.title}
                </h1>
                <div class="text-right flex-shrink-0 ml-6">
                    <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">残り日数</div>
                    <div class="text-4xl font-black ${statusColor} tabular-nums">${kgi.daysLeft}<span class="text-base font-medium ml-1 text-gray-400">Days</span></div>
                </div>
            </div>
            
            <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between">
                    <div>
                        <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${kgi.status === 'good' ? 'text-emerald-600 bg-emerald-200' : 'text-amber-600 bg-amber-200'}">
                            Current Progress
                        </span>
                    </div>
                    <div class="text-right">
                        <span class="text-2xl font-bold inline-block ${statusColor}">
                            ${kgi.progress}%
                        </span>
                    </div>
                </div>
                <div class="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                    <div style="width:${kgi.progress}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${barColor} transition-all duration-1000 ease-out"></div>
                </div>
            </div>
        </div>
    `;
}

function renderTabs() {
    const tabs = [
        { id: 'backward', label: 'Backward Map' },
        { id: 'woop', label: 'WOOP Board' },
        { id: 'okr', label: 'OKR Tree' }
    ];

    return `
        <div class="flex space-x-1 bg-gray-200 dark:bg-gray-800 p-1 rounded-xl inline-flex mb-6">
            ${tabs.map(tab => `
                <button 
                    class="tab-btn px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${currentTab === tab.id ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
                    data-tab="${tab.id}">
                    ${tab.label}
                </button>
            `).join('')}
        </div>
    `;
}

// A. Backward Design Mode (垂直タイムライン)
function renderBackwardView(data) {
    return `
        <div class="max-w-3xl mx-auto relative pl-8 pb-12">
            <!-- Vertical Line -->
            <div class="absolute left-3.5 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-700"></div>

            ${data.milestones.map((item, index) => {
        const isGoal = item.type === 'goal';
        const isCurrent = item.type === 'current';
        const isCompleted = item.completed;

        let icon = '';
        let contentClass = '';

        if (isGoal) {
            icon = `<div class="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center text-lg shadow-lg ring-4 ring-yellow-100 dark:ring-yellow-900 z-10">🏆</div>`;
            contentClass = "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
        } else if (isCurrent) {
            icon = `<div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg ring-4 ring-blue-100 dark:ring-blue-900 z-10 animate-pulse">Now</div>`;
            contentClass = "border-blue-500 border-2 shadow-lg scale-105";
        } else if (isCompleted) {
            icon = `<div class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm shadow z-10">✓</div>`;
            contentClass = "bg-gray-50 dark:bg-gray-800 opacity-70";
        } else {
            icon = `<div class="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 z-10"></div>`;
            contentClass = "bg-white dark:bg-gray-800";
        }

        return `
                    <div class="relative flex items-center mb-8 animate-fade-in" style="animation-delay: ${index * 100}ms">
                        <div class="absolute left-[-1.125rem] w-8 flex justify-center">
                            ${icon}
                        </div>
                        <div class="ml-6 flex-1 p-5 rounded-xl border ${isCurrent ? 'border-2 border-blue-500' : 'border-gray-200 dark:border-gray-700'} ${contentClass} shadow-sm transition-transform hover:scale-[1.02]">
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-xs font-bold uppercase tracking-wider ${isCurrent ? 'text-blue-600' : 'text-gray-500'}">${item.date}</span>
                                ${isGoal ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">TARGET</span>' : ''}
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white">${item.title}</h3>
                        </div>
                        ${isCurrent ? `<div class="absolute left-[-4rem] top-1/2 transform -translate-y-1/2 text-xs font-bold text-blue-500 animate-bounce hidden md:block">YOU ARE HERE →</div>` : ''}
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

// B. WOOP Mode (レジリエンス・ボード)
function renderWoopView(data) {
    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <!-- Wish & Outcome -->
            <div class="space-y-6">
                <div class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <h3 class="text-sm font-bold text-indigo-500 uppercase mb-2">Wish (願望)</h3>
                    <p class="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">"${data.wish}"</p>
                </div>
                
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 p-6 rounded-2xl border border-pink-100 dark:border-pink-800">
                    <h3 class="text-sm font-bold text-pink-500 uppercase mb-2">Outcome (最高の結果)</h3>
                    <p class="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">"${data.outcome}"</p>
                </div>
            </div>

            <!-- Obstacles & Plans -->
            <div class="space-y-4">
                <h3 class="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center">
                    <span class="mr-2">🚧</span> Obstacles & If-Then Plans
                </h3>
                
                ${data.obstacles.map(obs => `
                    <div class="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
                        <!-- Obstacle (Surface) -->
                        <div class="p-5 border-l-4 border-gray-400 bg-gray-50 dark:bg-gray-800 relative z-10 transition-transform group-hover:translate-x-1">
                            <h4 class="font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                <span class="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-3 text-gray-600">壁</span>
                                ${obs.text}
                            </h4>
                        </div>
                        
                        <!-- Plan (Reveal on Hover/Click) -->
                        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-gray-100 dark:border-gray-700 flex items-start">
                            <div class="flex-shrink-0 mt-1">
                                <span class="block w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">IF</span>
                            </div>
                            <div class="ml-3 flex-1">
                                <p class="text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                                    → ${obs.plan}
                                </p>
                            </div>
                            <div class="ml-2 flex flex-col items-center">
                                <span class="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                                <span class="text-lg font-black text-emerald-500 leading-none">${obs.overcomeCount}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
                
                <button class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 hover:border-gray-400 hover:text-gray-500 transition flex items-center justify-center font-bold text-sm">
                    + 障害を追加する
                </button>
            </div>
        </div>
    `;
}

// C. OKR Mode (フォーカス・ツリー)
function renderOkrView(data) {
    const getConfidenceColor = (conf) => {
        if (conf === 'high') return 'bg-emerald-500';
        if (conf === 'medium') return 'bg-amber-500';
        return 'bg-red-500';
    };

    return `
        <div class="max-w-4xl mx-auto">
            <!-- Objective (Root) -->
            <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-primary-100 dark:border-primary-900 shadow-lg text-center mb-12 relative z-10">
                <div class="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    Objective
                </div>
                <h2 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                    "${data.objective}"
                </h2>
                
                <!-- Connector Line -->
                <div class="absolute bottom-[-50px] left-1/2 w-1 h-[50px] bg-gray-200 dark:bg-gray-700 z-0"></div>
            </div>

            <!-- Key Results (Branches) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <!-- Horizontal Connector (Desktop only) -->
                <div class="hidden md:block absolute top-[-25px] left-[16.66%] right-[16.66%] h-1 bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 rounded-t-xl z-0"></div>

                ${data.keyResults.map(kr => {
        const percent = Math.round((kr.current / kr.target) * 100);
        const confColor = getConfidenceColor(kr.confidence);

        return `
                        <div class="relative pt-6">
                            <!-- Vertical connector to branch -->
                            <div class="absolute top-[-25px] left-1/2 w-1 h-[25px] bg-gray-200 dark:bg-gray-700 md:block hidden"></div>
                            
                            <div class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group h-full">
                                <div class="flex justify-between items-start mb-3">
                                    <span class="text-xs font-bold text-gray-400">KR #${kr.id}</span>
                                    <div class="w-3 h-3 rounded-full ${confColor}" title="Confidence: ${kr.confidence}"></div>
                                </div>
                                
                                <h4 class="font-bold text-gray-800 dark:text-gray-200 mb-4 h-12 line-clamp-2">
                                    ${kr.text}
                                </h4>
                                
                                <div class="space-y-1">
                                    <div class="flex justify-between text-xs font-bold text-gray-500">
                                        <span>${kr.current}</span>
                                        <span>${kr.target}</span>
                                    </div>
                                    <div class="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                        <div class="h-full bg-blue-500 rounded-full transition-all duration-1000" style="width: ${percent}%"></div>
                                    </div>
                                    <div class="text-right text-sm font-black text-blue-600 mt-1">${percent}%</div>
                                </div>
                            </div>
                        </div>
                    `;
    }).join('')}
            </div>
        </div>
    `;
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
