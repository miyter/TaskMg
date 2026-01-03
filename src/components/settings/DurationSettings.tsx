import React, { useState } from 'react';
import { useTranslation } from '../../core/translations';
import { useSettingsStore } from '../../store/ui/settings-store';
import { IconPlus, IconTrash } from '../common/Icons';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const DurationSettings: React.FC = () => {
    const { t } = useTranslation();
    const { customDurations, setCustomDurations } = useSettingsStore();
    const [newValue, setNewValue] = useState<string>('');

    const handleAdd = () => {
        const val = parseInt(newValue, 10);
        if (!isNaN(val) && val > 0 && !customDurations.includes(val)) {
            setCustomDurations([...customDurations, val]);
            setNewValue('');
        }
    };

    const handleDelete = (val: number) => {
        setCustomDurations(customDurations.filter(d => d !== val));
    };

    // Enter key to add
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAdd();
        }
    };

    return (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span>⏱️</span> {t('durations')}
            </h4>

            <div className="flex flex-wrap gap-2">
                {customDurations.map(d => (
                    <div key={d} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white dark:bg-gray-700/50 rounded-lg text-sm border border-gray-200 dark:border-gray-600 shadow-sm">
                        <span className="font-mono font-medium">{d} min</span>
                        <button
                            onClick={() => handleDelete(d)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded transition-colors"
                            title={t('delete')}
                        >
                            <IconTrash className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 items-center mt-2">
                <div className="relative w-24">
                    <Input
                        type="number"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="60"
                        className="h-9 text-sm"
                    />
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">min</span>
                </div>
                <Button onClick={handleAdd} size="sm" variant="secondary" disabled={!newValue} className="h-9">
                    <IconPlus className="w-4 h-4" />
                    {t('add')}
                </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('settings_modal.duration.description') || "Custom durations for task estimation."}
            </p>
        </div>
    );
};
