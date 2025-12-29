export function renderBackwardView(data) {
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
