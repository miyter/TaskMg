export function renderBackwardView(data) {
    if (!data || !data.milestones) {
        return '<div class="p-4 text-center text-gray-500">データ読み込みエラー</div>';
    }

    return `
        <div class="max-w-4xl mx-auto relative pl-6">
            <!-- Vertical Line -->
            <div class="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            ${data.milestones.map((item, index) => {
        const isGoal = item.type === 'goal';
        const isCurrent = item.type === 'current';
        const isCompleted = item.completed;

        let icon = '';
        let contentClass = '';

        if (isGoal) {
            icon = `<div class="w-6 h-6 rounded-full bg-yellow-400 text-white flex items-center justify-center text-sm shadow-md ring-2 ring-yellow-100 dark:ring-yellow-900 z-10">🏆</div>`;
            contentClass = "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
        } else if (isCurrent) {
            icon = `<div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-2 ring-blue-100 dark:ring-blue-900 z-10 animate-pulse">Now</div>`;
            contentClass = "border-blue-500 border-2 shadow-md";
        } else if (isCompleted) {
            icon = `<div class="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shadow z-10">✓</div>`;
            contentClass = "bg-gray-50 dark:bg-gray-800 opacity-70";
        } else {
            icon = `<div class="w-6 h-6 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 z-10"></div>`;
            contentClass = "bg-white dark:bg-gray-800";
        }

        return `
                    <div class="relative flex items-center mb-3 animate-fade-in" style="animation-delay: ${index * 50}ms">
                        <div class="absolute left-[-0.75rem] w-6 flex justify-center">
                            ${icon}
                        </div>
                        <div class="ml-4 flex-1 px-3 py-2 rounded-lg border ${isCurrent ? 'border-2 border-blue-500' : 'border-gray-200 dark:border-gray-700'} ${contentClass} shadow-sm transition-transform hover:scale-[1.01]">
                            <div class="flex items-center justify-between gap-3">
                                <span class="text-xs font-bold ${isCurrent ? 'text-blue-600' : 'text-gray-500'} flex-shrink-0">${item.date}</span>
                                <h3 class="font-bold text-gray-900 dark:text-white flex-1 truncate">${item.title}</h3>
                                ${isGoal ? '<span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold flex-shrink-0">TARGET</span>' : ''}
                                ${isCurrent ? '<span class="text-xs text-blue-500 font-bold flex-shrink-0 hidden md:inline">← NOW</span>' : ''}
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}
