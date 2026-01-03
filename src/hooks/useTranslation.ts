/**
 * i18n React Hook
 * Connects the Store to the pure translator utility.
 */

import { useMemo } from 'react';
import { getTranslator } from '../core/i18n/utils';
import { useSettingsStore } from '../store/ui/settings-store';

export const useTranslation = () => {
    const language = useSettingsStore((state) => state.language);

    // Memoize the translator to prevent unnecessary re-renders
    const translator = useMemo(() => getTranslator(language), [language]);

    return translator;
};
