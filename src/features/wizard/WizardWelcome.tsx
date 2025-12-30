import React from 'react';
import { cn } from '../../../utils/cn';
import { WIZARD_MODES, WizardModeId } from './wizard-config';

interface WizardWelcomeProps {
    currentMode: WizardModeId;
    onModeChange: (mode: WizardModeId) => void;
    onStart: () => void;
}

export const WizardWelcome: React.FC<WizardWelcomeProps> = ({ currentMode, onModeChange, onStart }) => {
    const config = WIZARD_MODES[currentMode];

    const features: Record<string, string[]> = {
        okr: ['測定可能', '野心的目標', 'チーム向け'],
        woop: ['科学的根拠', '障害対策', '個人向け'],
        backward: ['逆算思考', 'マイルストーン', '長期計画']
    };

    return (
        <div className="max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col py-6">
            {/* Header */}
            <div className="mb-4 flex-shrink-0">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span className="font-medium">目標設計ウィザード</span>
                    <svg className="w-3 h-3 mx-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">手法を選択</span>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6 flex-shrink-0">
                <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">フレームワークを選択</h2>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {(Object.keys(WIZARD_MODES) as WizardModeId[]).map((mode) => (
                        <button
                            key={mode}
                            onClick={() => onModeChange(mode)}
                            className={cn(
                                "flex-1 py-2 text-xs font-bold rounded-lg transition-all",
                                currentMode === mode
                                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            {WIZARD_MODES[mode].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 mb-6 min-h-0">
                <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg flex-shrink-0">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-xl">{config.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            {config.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                            {(features[currentMode] || []).map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pb-4 flex-shrink-0">
                <button
                    onClick={onStart}
                    className="group inline-flex items-center px-6 py-3 border-2 border-transparent shadow-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:scale-105 active:scale-95"
                >
                    <span>このモードで開始する</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};
