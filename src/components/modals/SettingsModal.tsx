import React, { useState } from 'react';
import { useModalStore } from '../../store/ui/modal-store';
import { SidebarDensity, useUIStore } from '../../store/ui/ui-store';
import { cn } from '../../utils/cn';
import { Modal } from '../common/Modal';

type SettingsTab = 'general' | 'appearance' | 'account';

export const SettingsModal: React.FC = () => {
    const { activeModal, closeModal } = useModalStore();
    const { sidebarDensity, setSidebarDensity } = useUIStore();
    const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');

    const isOpen = activeModal === 'settings';

    // Mock Theme Toggle (would use a theme store in reality)
    const toggleTheme = (theme: 'light' | 'dark') => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="設定" className="max-w-2xl h-[600px]">
            <div className="flex h-full -m-6">
                {/* Sidebar */}
                <div className="w-48 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-100 dark:border-gray-700/50 p-4 space-y-1">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} label="一般" icon="⚙️" />
                    <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} label="外観" icon="🎨" />
                    <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} label="アカウント" icon="👤" />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <section>
                                <h4 className="text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">テーマ</h4>
                                <div className="flex gap-4">
                                    <button onClick={() => toggleTheme('light')} className="p-4 border rounded-lg hover:border-blue-500 bg-white shadow-sm w-32 text-center">Light</button>
                                    <button onClick={() => toggleTheme('dark')} className="p-4 border rounded-lg hover:border-blue-500 bg-gray-900 text-white shadow-sm w-32 text-center">Dark</button>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">表示密度</h4>
                                <div className="space-y-2">
                                    {(['compact', 'normal', 'comfortable', 'spacious'] as SidebarDensity[]).map(d => (
                                        <label key={d} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="density"
                                                checked={sidebarDensity === d}
                                                onChange={() => setSidebarDensity(d)}
                                                className="text-blue-600"
                                            />
                                            <span className="capitalize text-sm">{d}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="text-gray-500 text-sm">言語設定などがここに入ります。</div>
                    )}

                    {activeTab === 'account' && (
                        <div className="text-gray-500 text-sm">ログアウトボタンなどがここに入ります。</div>
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
            "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left",
            active ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400 font-medium" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
    >
        <span>{icon}</span>
        <span>{label}</span>
    </button>
);
