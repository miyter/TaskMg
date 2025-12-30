import React from 'react';
import { WoopData } from '../../dashboard-types';

interface WoopViewProps {
    data: WoopData;
}

export const WoopView: React.FC<WoopViewProps> = React.memo(({ data }) => {
    if (!data || !data.obstacles) {
        return <div className="p-4 text-center text-gray-500">データ読み込みエラー</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-in">
            {/* Wish & Outcome */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold text-indigo-500 uppercase mb-2">Wish (願望)</h3>
                    <p className="font-bold text-gray-900 dark:text-white leading-relaxed text-lg">"{data.wish}"</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 p-6 rounded-2xl border border-pink-100 dark:border-pink-800 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-sm font-bold text-pink-500 uppercase mb-2">Outcome (最高の結果)</h3>
                    <p className="font-bold text-gray-900 dark:text-white leading-relaxed text-lg">"{data.outcome}"</p>
                </div>
            </div>

            {/* Obstacles & Plans */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 flex items-center">
                    <span className="mr-2">🚧</span> Obstacles & If-Then Plans
                </h3>

                {data.obstacles.map((obs) => (
                    <div key={obs.id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
                        {/* Obstacle (Surface) */}
                        <div className="p-5 border-l-4 border-gray-400 bg-gray-50 dark:bg-gray-800 relative z-10 transition-transform group-hover:translate-x-1">
                            <h4 className="font-bold text-gray-700 dark:text-gray-300 flex items-center">
                                <span className="bg-gray-200 dark:bg-gray-700 text-xs px-2 py-1 rounded mr-3 text-gray-600 dark:text-gray-400">壁</span>
                                {obs.text}
                            </h4>
                        </div>

                        {/* Plan (Reveal on Hover/Click - actually just static in this layout but styled appropriately) */}
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border-t border-gray-100 dark:border-gray-700 flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <span className="block w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">IF</span>
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                                    → {obs.plan}
                                </p>
                            </div>
                            <div className="ml-2 flex flex-col items-center">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Score</span>
                                <span className="text-lg font-black text-emerald-500 leading-none">{obs.overcomeCount}</span>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-400 hover:border-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition flex items-center justify-center font-bold text-sm">
                    + 障害を追加する
                </button>
            </div>
        </div>
    );
});
