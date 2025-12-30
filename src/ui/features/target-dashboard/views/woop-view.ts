import { WoopData } from '../dashboard-types';

export function renderWoopView(data: WoopData) {
    if (!data || !data.obstacles) {
        return '<div class="p-4 text-center text-gray-500">データ読み込みエラー</div>';
    }

    return `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <!-- Wish & Outcome -->
            <div class="space-y-6">
                <div class="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                    <h3 class="text-sm font-bold text-indigo-500 uppercase mb-2">Wish (願望)</h3>
                    <p class="font-bold text-gray-900 dark:text-white leading-relaxed">"${data.wish}"</p>
                </div>
                
                <div class="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 p-6 rounded-2xl border border-pink-100 dark:border-pink-800">
                    <h3 class="text-sm font-bold text-pink-500 uppercase mb-2">Outcome (最高の結果)</h3>
                    <p class="font-bold text-gray-900 dark:text-white leading-relaxed">"${data.outcome}"</p>
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
