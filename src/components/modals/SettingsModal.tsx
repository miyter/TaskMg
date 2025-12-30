import React, { useState } from 'react';
import { useModalStore } from '../../store/ui/modal-store';
import { Density, FontSize, ThemeMode, useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { Modal } from '../common/Modal';

type SettingsTab = 'general' | 'appearance' | 'account';

export const SettingsModal: React.FC = () => {
    const { activeModal, closeModal } = useModalStore();
    const {
        themeMode, setThemeMode,
        density, setDensity,
        fontSize, setFontSize,
        fontEn, setFontEn,
        fontJp, setFontJp
    } = useSettingsStore();

    const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

    const isOpen = activeModal === 'settings';

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="設定" className="max-w-3xl h-[650px]">
            <div className="flex h-full -m-6">
                {/* Sidebar */}
                <div className="w-56 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-700/50 p-4 space-y-1">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} label="一般" icon="⚙️" />
                    <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} label="外観" icon="🎨" />
                    <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} label="アカウント" icon="👤" />
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {activeTab === 'appearance' && (
                        <div className="space-y-8">
                            {/* Theme */}
                            <section>
                                <h4 className="text-base font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <span>🌓</span> テーマ
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setThemeMode(mode)}
                                            className={cn(
                                                "p-3 border rounded-xl text-sm font-medium transition-all",
                                                themeMode === mode
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            )}
                                        >
                                            <span className="capitalize">{mode}</span>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-gray-100 dark:border-gray-700/50" />

                            {/* Density */}
                            <section>
                                <h4 className="text-base font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <span>📐</span> 表示密度
                                </h4>
                                <div className="space-y-3">
                                    {(['compact', 'normal', 'comfortable', 'spacious'] as Density[]).map(d => (
                                        <label key={d} className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                            density === d
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                                                : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                density === d ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                            )}>
                                                {density === d && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="density"
                                                checked={density === d}
                                                onChange={() => setDensity(d)}
                                                className="hidden"
                                            />
                                            <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">{d}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <hr className="border-gray-100 dark:border-gray-700/50" />

                            {/* Font Size */}
                            <section>
                                <h4 className="text-base font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <span>Aa</span> 文字サイズ
                                </h4>
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                    {(['sm', 'base', 'md', 'lg', 'xl'] as FontSize[]).map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setFontSize(s)}
                                            className={cn(
                                                "flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all",
                                                fontSize === s
                                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Fonts (Optional/Advanced) */}
                            <section className="space-y-4">
                                <h4 className="text-base font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <span>Tt</span> フォント設定
                                </h4>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">欧文フォント</label>
                                    <input
                                        type="text"
                                        value={fontEn}
                                        onChange={(e) => setFontEn(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900"
                                        placeholder="例: Inter, sans-serif"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">和文フォント</label>
                                    <input
                                        type="text"
                                        value={fontJp}
                                        onChange={(e) => setFontJp(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-gray-900"
                                        placeholder="例: 'Not Sans JP', sans-serif"
                                    />
                                </div>
                            </section>

                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg mb-2">🚧 準備中</p>
                            <p className="text-sm">言語設定などの機能は今後のアップデートで追加されます。</p>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg mb-2">🚧 準備中</p>
                            <p className="text-sm">アカウント管理機能は今後実装予定です。</p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all text-left",
            active
                ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400 font-bold"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
        )}
    >
        <span className="text-base">{icon}</span>
        <span>{label}</span>
    </button>
);
