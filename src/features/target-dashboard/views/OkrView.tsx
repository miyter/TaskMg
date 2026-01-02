import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { OkrData } from '../dashboard-types';

interface OkrViewProps {
    data: OkrData;
}

export const OkrView: React.FC<OkrViewProps> = React.memo(({ data }) => {
    const { t } = useTranslation();
    if (!data || !data.keyResults) {
        return <div className="p-4 text-center text-gray-500">{t('target_dashboard.loading_error')}</div>;
    }

    const getConfidenceColor = (conf: string) => {
        if (conf === 'high') return 'bg-emerald-500';
        if (conf === 'medium') return 'bg-amber-500';
        return 'bg-red-500';
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {/* Objective (Root) */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border-2 border-blue-100 dark:border-blue-900 shadow-lg text-center mb-12 relative z-10 transition-transform hover:scale-[1.01]">
                <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {t('target_dashboard.okr.objective_label')}
                </div>
                <h2 className="font-black text-2xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                    "{data.objective}"
                </h2>

                {/* Connector Line */}
                <div className="absolute bottom-[-50px] left-1/2 w-1 h-[50px] bg-gray-200 dark:bg-gray-700 z-0"></div>
            </div>

            {/* Key Results (Branches) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Horizontal Connector (Desktop only) */}
                <div className="hidden md:block absolute top-[-25px] left-[16.66%] right-[16.66%] h-1 bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 rounded-t-xl z-0"></div>

                {data.keyResults.map(kr => {
                    // ゼロ除算防止: target が 0 の場合は 0% として扱う
                    const percent = kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0;
                    const confColor = getConfidenceColor(kr.confidence);

                    return (
                        <div key={kr.id} className="relative pt-6">
                            {/* Vertical connector to branch */}
                            <div className="absolute top-[-25px] left-1/2 w-1 h-[25px] bg-gray-200 dark:bg-gray-700 md:block hidden"></div>

                            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all group h-full flex flex-col">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-xs font-bold text-gray-400">{t('target_dashboard.okr.kr_prefix')}{kr.id}</span>
                                    <div className={`w-3 h-3 rounded-full ${confColor}`} title={`Confidence: ${kr.confidence}`}></div>
                                </div>

                                <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-4 h-12 line-clamp-2">
                                    {kr.text}
                                </h4>

                                <div className="space-y-1 mt-auto">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
                                        <span>{kr.current}</span>
                                        <span>{kr.target}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <div className="text-right text-sm font-black text-blue-600 mt-1">{percent}%</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});


