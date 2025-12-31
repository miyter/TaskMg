import React, { useCallback } from 'react';
import { Modal } from '../../components/common/Modal';
import { useModalStore } from '../../store/ui/modal-store';
import { WikiFramework } from './wiki-data';

interface WikiFrameworkModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
}

export const WikiFrameworkModal: React.FC<WikiFrameworkModalProps> = ({ isOpen: propIsOpen, data: propData, zIndex }) => {
    const { activeModal, modalData, closeModal } = useModalStore();
    const isOpen = propIsOpen ?? (activeModal === 'wiki-framework');
    const framework = (propData ?? modalData) as WikiFramework;

    const handleApply = useCallback(() => {
        // ウィザードに遷移 (既存のカスタムイベントを使用)
        // Note: This relies on App.tsx listening to this event or a store subscription
        window.dispatchEvent(new CustomEvent('change-view', {
            detail: { view: 'wizard', mode: framework.id }
        }));
        closeModal();
    }, [framework, closeModal]);

    if (!isOpen || !framework) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-transparent shadow-none"
        >
            <div className={`w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl animate-bounce-slow">{framework.icon}</span>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{framework.title}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{framework.subTitle}</p>
                        </div>
                    </div>
                    {/* Close button is handled by Modal component header usually, but here we customize content */}
                </div>

                {/* コンテンツ */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* 概要 */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center">
                            <span className="w-1 h-4 bg-blue-600 dark:bg-blue-400 mr-2 rounded-full"></span>
                            概要
                        </h3>
                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                            {framework.concept.summary}
                        </p>
                    </div>

                    {/* 詳細 */}
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                            <span className="w-1 h-4 bg-gray-400 mr-2 rounded-full"></span>
                            詳細
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            {framework.concept.detail}
                        </p>
                    </div>

                    {/* 使用例 */}
                    {Array.isArray(framework.useCases) && framework.useCases.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                <span className="w-1 h-4 bg-purple-500 mr-2 rounded-full"></span>
                                Use Cases
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {framework.useCases.map((uc, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-5 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                                        <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                                            <span className="text-purple-500 mr-2">#</span>
                                            {uc.title}
                                        </h4>
                                        <div className="mb-3">
                                            <div className="flex items-start mb-1">
                                                <span className="text-[10px] font-bold text-red-600 bg-red-100 dark:bg-red-900/40 dark:text-red-300 px-1.5 py-0.5 rounded mr-2 mt-0.5 min-w-[40px] text-center">Before</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">{uc.before}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-start">
                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 px-1.5 py-0.5 rounded mr-2 mt-0.5 min-w-[40px] text-center">After</span>
                                                <span className="text-sm text-gray-800 dark:text-gray-300 font-medium">{uc.after}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tips (Optional, based on data structure) */}
                    {framework.tips && framework.tips.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                <span className="w-1 h-4 bg-amber-500 mr-2 rounded-full"></span>
                                Tips
                            </h3>
                            <div className="space-y-3">
                                {framework.tips.map((tip, idx) => (
                                    <div key={idx} className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                        <p className="font-bold text-amber-800 dark:text-amber-400 mb-1">Q. {tip.q}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">A. {tip.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* フッター */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <button
                        onClick={closeModal}
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        閉じる
                    </button>
                    <button
                        onClick={handleApply}
                        className="group relative px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center">
                            ウィザードで使用する
                            <svg className="w-4 h-4 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                    </button>
                </div>
            </div>
        </Modal>
    );
};
