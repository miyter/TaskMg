import React, { useState } from 'react';
import { auth } from '../../core/firebase';
import { useTranslation } from '../../core/translations';
import { UI_CONFIG } from '../../core/ui-constants';
import { createBackupData, importBackupData } from '../../store/backup';
import { useModalStore } from '../../store/ui/modal-store';
import { Density, FontSize, ThemeMode, useSettingsStore } from '../../store/ui/settings-store';
import { useWorkspaceStore } from '../../store/ui/workspace-store';
import { cn } from '../../utils/cn';
import { AccordionSection } from '../common/AccordionSection';
import { Modal } from '../common/Modal';
import { AccountSettingsTab } from './AccountSettingsTab';

import { cleanupDuplicateTasks } from '../../store/maintenance';

type SettingsTab = 'general' | 'appearance' | 'account' | 'advanced';

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
    <button
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all whitespace-nowrap min-w-0",
            // Desktop: Horizontal list item style
            "md:w-full md:justify-start md:text-left md:py-2",
            // Mobile: Bottom tab item style
            "flex-col w-full justify-center py-3 text-[10px] gap-1 rounded-none md:rounded-lg md:text-sm md:flex-row md:gap-3",
            active
                ? "bg-white dark:bg-gray-800 shadow-sm text-blue-600 dark:text-blue-400 font-bold border-t-2 md:border-t-0 md:border md:border-gray-100 dark:md:border-gray-700 border-blue-500 md:border-transparent"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 border-t-2 md:border-t-0 border-transparent"
        )}
    >
        <span className="text-lg md:text-base">{icon}</span>
        <span className="truncate font-medium">{label}</span>
    </button>
);

interface SettingsModalProps {
    isOpen?: boolean;
    data?: any;
    zIndex?: number;
    overlayClassName?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen: propIsOpen, zIndex, overlayClassName }) => {
    const { t } = useTranslation();
    const { closeModal } = useModalStore();
    const {
        themeMode, setThemeMode,
        density, setDensity,
        fontSize, setFontSize,
        fontEn, setFontEn,
        fontJp, setFontJp,
        language, setLanguage
    } = useSettingsStore();

    const { currentWorkspaceId } = useWorkspaceStore();

    const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
    const [backupConfirmed, setBackupConfirmed] = useState(false);

    const isOpen = !!propIsOpen;

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            title={t('settings_modal.title')}
            className="w-full max-w-4xl h-[90vh] md:h-[85vh] p-0 overflow-hidden"
            zIndex={zIndex}
            overlayClassName={overlayClassName}
        >
            <div className="flex flex-col md:flex-row h-full">
                {/* Sidebar (Tabs) - Mobile: Bottom Bar, Desktop: Left Sidebar */}
                <div className="order-last md:order-first w-full md:w-64 bg-white dark:bg-gray-900 md:bg-gray-50/50 md:dark:bg-gray-900/50 border-t md:border-t-0 md:border-r border-gray-200 dark:border-gray-700 shrink-0 z-10">
                    <div className="flex flex-row md:flex-col justify-around md:justify-start md:p-4 md:space-y-2 pb-safe md:pb-4">
                        <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} label={t('settings_modal.tabs.general')} icon="⚙️" />
                        <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} label={t('settings_modal.tabs.appearance')} icon="🎨" />
                        <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} label={t('settings_modal.tabs.account')} icon="👤" />

                        {/* Mobile only divider logic handled by layout, removing hr */}

                        <TabButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} label={t('settings_modal.tabs.advanced')} icon="⚡" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-900 order-first md:order-last relative">
                    {activeTab === 'appearance' && (
                        <div className="flex flex-col gap-4">
                            {/* Theme */}
                            <AccordionSection title={t('settings_modal.appearance.theme')} icon="🌓" defaultOpen={false}>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => (
                                        <button
                                            key={mode}
                                            onClick={() => setThemeMode(mode)}
                                            className={cn(
                                                "p-3 border rounded-xl text-sm font-medium transition-all",
                                                themeMode === mode
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                                            )}
                                        >
                                            <span className="capitalize">{t(`settings_modal.options.theme.${mode}` as any)}</span>
                                        </button>
                                    ))}
                                </div>
                            </AccordionSection>

                            {/* Density */}
                            <AccordionSection title={t('settings_modal.appearance.density')} icon="📐" defaultOpen={false}>
                                <div className="space-y-3">
                                    {(['compact', 'normal', 'comfortable', 'spacious'] as Density[]).map(d => (
                                        <label key={d} htmlFor={`density-${d}`} className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                                            density === d
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                                                : "border-transparent hover:bg-white dark:hover:bg-gray-800"
                                        )}>
                                            <div className={cn(
                                                "w-4 h-4 rounded-full border flex items-center justify-center",
                                                density === d ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                            )}>
                                                {density === d && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                id={`density-${d}`}
                                                type="radio"
                                                name="density"
                                                checked={density === d}
                                                onChange={() => setDensity(d)}
                                                className="hidden"
                                            />
                                            <span className="capitalize text-sm font-medium text-gray-700 dark:text-gray-300">{t(`settings_modal.options.density.${d}` as any)}</span>
                                        </label>
                                    ))}
                                </div>
                            </AccordionSection>

                            {/* Font Size */}
                            <AccordionSection title={t('settings_modal.appearance.font_size')} icon="Aa" defaultOpen={false}>
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
                            </AccordionSection>

                            {/* Fonts */}
                            <AccordionSection title={t('settings_modal.appearance.fonts')} icon="Tt" defaultOpen={false}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="settings-font-en" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t('settings_modal.appearance.font_en')}</label>
                                        <div className="relative">
                                            <select
                                                id="settings-font-en"
                                                name="fontEn"
                                                value={fontEn}
                                                onChange={(e) => setFontEn(e.target.value)}
                                                className="w-full pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none relative z-10 bg-transparent"
                                            >
                                                {UI_CONFIG.FONTS.EU.map(f => (
                                                    <option key={f.value} value={f.value}>{f.label}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="settings-font-jp" className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t('settings_modal.appearance.font_jp')}</label>
                                        <div className="relative">
                                            <select
                                                id="settings-font-jp"
                                                name="fontJp"
                                                value={fontJp}
                                                onChange={(e) => setFontJp(e.target.value)}
                                                className="w-full pl-3 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-900 appearance-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none relative z-10 bg-transparent"
                                            >
                                                {UI_CONFIG.FONTS.JP.map(f => (
                                                    <option key={f.value} value={f.value}>{f.label}</option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 z-0">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionSection>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <span>💾</span> {t('settings_modal.backup.title')}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                    {t('settings_modal.backup.description')}
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <button
                                        onClick={async () => {
                                            if (!auth.currentUser || !currentWorkspaceId) return;
                                            try {
                                                const data = await createBackupData(auth.currentUser.uid, currentWorkspaceId);
                                                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `taskmg-backup-${new Date().toISOString().slice(0, 10)}.json`;
                                                document.body.appendChild(a);
                                                a.click();
                                                document.body.removeChild(a);
                                                URL.revokeObjectURL(url);
                                            } catch (e) {
                                                console.error(e);
                                                alert(t('settings_modal.backup.create_fail'));
                                            }
                                        }}
                                        className="btn-premium w-full sm:w-auto text-sm flex items-center justify-center gap-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        <span className="inline">{t('settings_modal.backup.create')}</span>
                                    </button>
                                    <div className="relative w-full sm:w-auto">
                                        <input
                                            type="file"
                                            accept=".json"
                                            className="hidden"
                                            id="backup-import-input"
                                            onChange={async (e) => {
                                                const file = e.target.files?.[0];
                                                if (!file || !auth.currentUser || !currentWorkspaceId) return;

                                                if (!window.confirm(t('settings_modal.backup.import_confirm'))) {
                                                    e.target.value = '';
                                                    return;
                                                }

                                                const reader = new FileReader();
                                                reader.onload = async (ev) => {
                                                    try {
                                                        const json = JSON.parse(ev.target?.result as string);
                                                        const result = await importBackupData(auth.currentUser!.uid, currentWorkspaceId, json);
                                                        alert(t('settings_modal.backup.import_success').replace('{tasks}', String(result.tasksCount)).replace('{projects}', String(result.projectsCount)));
                                                        window.location.reload(); // Refresh to reflect changes
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert(t('settings_modal.backup.import_fail'));
                                                    }
                                                };
                                                reader.readAsText(file);
                                                e.target.value = ''; // Reset input
                                            }}
                                        />
                                        <label
                                            htmlFor="backup-import-input"
                                            className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer shadow-sm text-sm flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            {t('settings_modal.backup.import')}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <AccordionSection title={t('settings_modal.language.title')} icon="🌐" defaultOpen={false}>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { code: 'ja', label: '日本語' },
                                        { code: 'en', label: 'English' }
                                    ].map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setLanguage(lang.code as any)}
                                            className={cn(
                                                "p-3 border rounded-xl text-sm font-medium transition-all",
                                                language === lang.code
                                                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-2 ring-blue-200 dark:ring-blue-800"
                                                    : "border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                                            )}
                                        >
                                            <span className="text-xl mr-2">{lang.code === 'ja' ? '🇯🇵' : '🇺🇸'}</span>
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </AccordionSection>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <AccountSettingsTab />
                    )}

                    {activeTab === 'advanced' && (
                        <div className="flex flex-col gap-4">
                            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                                <h4 className="font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                    <span>🧹</span> {t('settings_modal.maintenance.title')}
                                </h4>
                                <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
                                    {t('settings_modal.maintenance.description')}
                                </p>

                                <label htmlFor="backup-confirm-checkbox" className="flex items-center gap-2 mb-4 cursor-pointer">
                                    <input
                                        id="backup-confirm-checkbox"
                                        name="backupConfirmed"
                                        type="checkbox"
                                        className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                                        checked={backupConfirmed}
                                        onChange={(e) => setBackupConfirmed(e.target.checked)}
                                    />
                                    <span className="text-sm font-bold text-red-700 dark:text-red-400">
                                        {t('settings_modal.maintenance.confirm_backup') || 'バックアップを作成しました（必須）'}
                                    </span>
                                </label>

                                <button
                                    onClick={async () => {
                                        if (!currentWorkspaceId) return;
                                        // Checkbox enforces backup confirmation
                                        if (!confirm(t('settings_modal.maintenance.confirm_final'))) return;

                                        try {
                                            const count = await cleanupDuplicateTasks(currentWorkspaceId);
                                            alert(t('settings_modal.maintenance.cleanup_success').replace('{count}', String(count)));
                                            if (count > 0) {
                                                window.location.reload();
                                            }
                                        } catch (e: any) {
                                            console.error(e);
                                            alert(t('settings_modal.maintenance.cleanup_fail').replace('{error}', e.message));
                                        }
                                    }}
                                    disabled={!backupConfirmed}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                                >
                                    {t('settings_modal.maintenance.cleanup_duplicate')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};


