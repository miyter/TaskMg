import React from 'react';
import { IconCheck, IconChevronRight, IconWizard } from '../../components/common/Icons';
import { Button } from '../../components/ui/Button';
import { useTranslation } from '../../core/translations';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';
import { getWizardModes, WizardModeId } from './wizard-config';

interface WizardWelcomeProps {
    currentMode: WizardModeId;
    onModeChange: (mode: WizardModeId) => void;
    onStart: () => void;
}

export const WizardWelcome: React.FC<WizardWelcomeProps> = ({ currentMode, onModeChange, onStart }) => {
    const { t } = useTranslation();
    const { language } = useSettingsStore();
    const modesConfig = getWizardModes(language);
    const config = modesConfig[currentMode];

    // Get features from translation (comma separated string)
    // Cast to any because of dynamic key construction
    const featureList = (t(`wizard.features.${currentMode}` as any) || '').split(',');

    return (
        <div className="max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col py-6">
            {/* Header */}
            <div className="mb-4 flex-shrink-0">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <IconWizard className="w-3 h-3 mr-1.5" />
                    <span className="font-medium">{t('sidebar.target_wizard')}</span>
                    <IconChevronRight className="w-3 h-3 mx-1.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-semibold">{t('wizard.select_method')}</span>
                </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6 flex-shrink-0">
                <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">{t('wizard.select_framework')}</h2>
                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {(Object.keys(modesConfig) as WizardModeId[]).map((mode) => (
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
                            {modesConfig[mode].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 mb-6 min-h-0">
                <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg flex-shrink-0">
                            <IconCheck className="w-8 h-8 text-white" />
                        </div>

                        <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-xl">{config.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            {config.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2 justify-center">
                            {featureList.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                                    {tag.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pb-4 flex-shrink-0">
                <Button
                    variant="premium"
                    size="lg"
                    onClick={onStart}
                    className="shadow-xl"
                    rightIcon={<IconChevronRight className="w-4 h-4" />}
                >
                    {t('wizard.start_mode')}
                </Button>
            </div>
        </div>
    );
};



