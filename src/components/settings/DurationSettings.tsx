import React from 'react';
import { useTranslation } from '../../core/translations';
import { useSettingsStore } from '../../store/ui/settings-store';
import { cn } from '../../utils/cn';

export const DurationSettings: React.FC = () => {
    const { t } = useTranslation();
    const { customDurations, setCustomDurations } = useSettingsStore();

    const PRESETS = [15, 30, 45, 60, 75, 90, 105, 120];

    const toggleDuration = (val: number) => {
        if (customDurations.includes(val)) {
            setCustomDurations(customDurations.filter(d => d !== val));
        } else {
            setCustomDurations([...customDurations, val].sort((a, b) => a - b));
        }
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>⏱️</span> {t('durations')}
            </h4>

            <div className="grid grid-cols-4 gap-2">
                {PRESETS.map(min => {
                    const isActive = customDurations.includes(min);
                    return (
                        <button
                            key={min}
                            onClick={() => toggleDuration(min)}
                            className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg border text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                            )}
                        >
                            <span>{min}</span>
                            <span className="text-[10px] opacity-80">min</span>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('settings_modal.duration.description') || "Select preset durations available in task details."}
            </p>
        </div>
    );
};
