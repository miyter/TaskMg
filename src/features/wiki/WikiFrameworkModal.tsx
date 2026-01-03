import React, { useCallback, useState } from 'react';
import { IconChevronDown } from '../../components/common/Icons';
import { Modal } from '../../components/common/Modal';
import { useTranslation } from '../../core/translations';
import { useModalStore } from '../../store/ui/modal-store';
import { cn } from '../../utils/cn';
import { WikiFramework } from './wiki-data';

import { useViewStore } from '../../store/ui/view-store';

interface WikiFrameworkModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
}

// アコーディオンセクションコンポーネント
const AccordionItem: React.FC<{
    title: string;
    accentColor?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}> = ({ title, accentColor = 'gray', defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colorMap: Record<string, string> = {
        purple: 'bg-purple-500',
        amber: 'bg-amber-500',
        gray: 'bg-gray-400',
    };

    return (
        <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors rounded-md -mx-1 px-1"
            >
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center">
                    <span className={cn("w-1 h-4 mr-2 rounded-full", colorMap[accentColor])}></span>
                    {title}
                </span>
                <IconChevronDown
                    size={18}
                    className={cn(
                        "text-gray-400 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>
            <div className={cn(
                "overflow-hidden transition-all duration-200",
                isOpen ? "max-h-[2000px] opacity-100 pb-4" : "max-h-0 opacity-0"
            )}>
                {children}
            </div>
        </div>
    );
};

export const WikiFrameworkModal: React.FC<WikiFrameworkModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex }) => {
    const { closeModal } = useModalStore();
    const { t } = useTranslation();
    const isOpen = !!propIsOpen;
    const framework = propData as WikiFramework;
    const [currentUseCaseIndex, setCurrentUseCaseIndex] = useState(0);

    const handleApply = useCallback(() => {
        // ウィザードに遷移
        useViewStore.getState().setView('wizard', { mode: framework.id });
        closeModal();
    }, [framework, closeModal]);

    if (!isOpen || !framework) return null;

    const useCases = framework.useCases || [];
    const hasMultipleUseCases = useCases.length > 1;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-2xl max-h-[90vh] p-0 overflow-hidden bg-transparent shadow-none"
        >
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* ヘッダー - コンパクト化 */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-3xl">{framework.icon}</span>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{framework.title}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{framework.subTitle}</p>
                    </div>
                </div>

                {/* コンテンツ - 段階的開示 */}
                <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                    {/* 概要 - 常に表示 */}
                    <div className="mb-4">
                        <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2 flex items-center">
                            <span className="w-1 h-4 bg-purple-500 mr-2 rounded-full"></span>
                            {t('wiki.summary')}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                            {framework.concept.summary}
                        </p>
                    </div>

                    {/* 詳細 - アコーディオン */}
                    <AccordionItem title={t('wiki.details')} accentColor="gray" defaultOpen={false}>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {framework.concept.detail}
                        </p>
                    </AccordionItem>

                    {/* 使用例 - アコーディオン + カルーセル */}
                    {useCases.length > 0 && (
                        <AccordionItem title={t('wiki.use_cases')} accentColor="purple" defaultOpen={false}>
                            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 text-sm">
                                    {useCases[currentUseCaseIndex].title}
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start">
                                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mr-2 mt-0.5 min-w-[40px]">Before:</span>
                                        <span className="text-gray-500 dark:text-gray-400">{useCases[currentUseCaseIndex].before}</span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 mr-2 mt-0.5 min-w-[40px]">After:</span>
                                        <span className="text-gray-800 dark:text-gray-200 font-medium">{useCases[currentUseCaseIndex].after}</span>
                                    </div>
                                </div>
                                {/* カルーセルナビゲーション */}
                                {hasMultipleUseCases && (
                                    <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                                        <button
                                            onClick={() => setCurrentUseCaseIndex(i => i > 0 ? i - 1 : useCases.length - 1)}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            aria-label="Previous"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <span className="text-xs text-gray-500 min-w-[40px] text-center">
                                            {currentUseCaseIndex + 1} / {useCases.length}
                                        </span>
                                        <button
                                            onClick={() => setCurrentUseCaseIndex(i => i < useCases.length - 1 ? i + 1 : 0)}
                                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            aria-label="Next"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </AccordionItem>
                    )}

                    {/* Tips - アコーディオン（デフォルト閉じ） */}
                    {framework.tips && framework.tips.length > 0 && (
                        <AccordionItem title={t('wiki.tips')} accentColor="amber" defaultOpen={false}>
                            <div className="space-y-2">
                                {framework.tips.map((tip, idx) => (
                                    <div key={idx} className="text-sm">
                                        <p className="font-medium text-gray-700 dark:text-gray-300">Q. {tip.q}</p>
                                        <p className="text-gray-500 dark:text-gray-400 mt-1">A. {tip.a}</p>
                                    </div>
                                ))}
                            </div>
                        </AccordionItem>
                    )}
                </div>

                {/* フッター - 下部固定 */}
                <div className="flex items-center justify-between p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    >
                        {t('close')}
                    </button>
                    <button
                        onClick={handleApply}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                        {t('wiki.use_in_wizard')}
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </Modal>
    );
};



