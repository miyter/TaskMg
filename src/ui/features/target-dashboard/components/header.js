export function renderHeader(kgi) {
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

export function renderTabs(currentTab) {
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
