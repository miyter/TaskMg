export function renderTargetDashboard(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Target Insight</h2>
            <p class="mb-8 text-gray-500 dark:text-gray-400">厳選した重要目標の戦略的進捗と分析</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Goal 1 -->
                <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100">Project A: Launch</h3>
                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs rounded-full">On Track</span>
                    </div>
                    <div class="space-y-4">
                        <div>
                            <div class="text-xs text-gray-500 mb-1">Backup Design Timeline</div>
                            <div class="h-24 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-200 dark:border-gray-600">
                                Gantt Chart Visualization
                            </div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-500 mb-1">Progress</div>
                            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div class="bg-blue-600 h-2 rounded-full" style="width: 65%"></div>
                            </div>
                            <div class="text-right text-xs text-gray-400 mt-1">65%</div>
                        </div>
                    </div>
                </div>

                <!-- Goal 2 -->
                <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100">Skill Acquisition</h3>
                        <span class="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 text-xs rounded-full">At Risk</span>
                    </div>
                     <div class="space-y-4">
                        <div>
                            <div class="text-xs text-gray-500 mb-1">WOOP Analysis</div>
                             <div class="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded text-sm text-gray-600 dark:text-gray-300 border border-yellow-100 dark:border-yellow-900/20">
                                <span class="font-bold text-yellow-700 dark:text-yellow-500">Obstacle:</span> 時間不足<br>
                                <span class="font-bold text-green-700 dark:text-green-500">Plan:</span> 朝6時に起きて30分確保
                            </div>
                        </div>
                    </div>
                </div>

                 <!-- Goal 3 -->
                <div class="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                     <div class="flex items-center justify-between mb-4">
                        <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100">Network Growth</h3>
                        <span class="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-xs rounded-full">Completed</span>
                    </div>
                     <div class="space-y-4">
                        <div class="text-center py-6">
                            <div class="text-4xl font-bold text-gray-900 dark:text-white mb-1">120<span class="text-lg text-gray-400 font-normal">/100</span></div>
                            <div class="text-sm text-gray-500">Key Results Achieved</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
