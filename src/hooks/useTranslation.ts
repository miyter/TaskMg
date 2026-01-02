import { useMemo } from 'react';
import { getTranslator } from '../core/translations';
import { useSettingsStore } from '../store/ui/settings-store';

export const useTranslation = () => {
    const language = useSettingsStore((state) => state.language);

    // Issue #18: Memoized
    const translator = useMemo(() => getTranslator(language), [language]);

    return translator;
};
