import React from 'react';
import { BackwardData } from '../dashboard-types';

interface BackwardViewProps {
    data: BackwardData;
}

export const BackwardView: React.FC<BackwardViewProps> = React.memo(({ data }) => {
    if (!data || !data.milestones) {
        return <div className="p-4 text-center text-gray-500">データ読み込みエラー</div>;
    }

    return (
        <div className="max-w-4xl mx-auto relative pb-10">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2"></div>

            {data.milestones.map((item, index) => {
                const isGoal = item.type === 'goal';
                const isCurrent = item.type === 'current';
                const isCompleted = item.completed;

                let icon;
                let contentClass = '';

                if (isGoal) {
                    icon = <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center text-base shadow-md ring-4 ring-gray-50 dark:ring-gray-900 z-10 relative">🏆</div>;
                    contentClass = "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700";
                } else if (isCurrent) {
                    icon = <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shadow-md ring-4 ring-gray-50 dark:ring-gray-900 z-10 animate-pulse relative">Now</div>;
                    contentClass = "border-blue-500 border-2 shadow-md";
                } else if (isCompleted) {
                    icon = <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs shadow ring-4 ring-gray-50 dark:ring-gray-900 z-10 relative">✓</div>;
                    contentClass = "bg-gray-50 dark:bg-gray-800 opacity-70";
                } else {
                    icon = <div className="w-5 h-5 rounded-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 ring-4 ring-gray-50 dark:ring-gray-900 z-10 relative"></div>;
                    contentClass = "bg-white dark:bg-gray-800";
                }

                return (
                    <div
                        key={index}
                        className="relative flex items-center mb-4 animate-fade-in group"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        {/* Icon Column */}
                        <div className="w-16 flex-shrink-0 flex justify-center items-center z-10">
                            {icon}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 pr-4 min-w-0">
                            <div className={`px-3 py-3 rounded-lg border ${isCurrent && !contentClass.includes('border-2') ? 'border-2 border-blue-500' : isCurrent ? '' : 'border-gray-200 dark:border-gray-700'} ${contentClass} shadow-sm transition-all hover:shadow-md hover:translate-x-1 cursor-pointer`}>
                                <div className="flex items-center justify-between gap-3">
                                    <span className={`text-xs font-bold ${isCurrent ? 'text-blue-600' : 'text-gray-500'} flex-shrink-0 font-mono`}>{item.date}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white flex-1 truncate text-sm md:text-base">{item.title}</h3>
                                    {isGoal && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold flex-shrink-0">TARGET</span>}
                                    {isCurrent && <span className="text-[10px] text-blue-500 font-bold flex-shrink-0">← NOW</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
});
