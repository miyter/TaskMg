
import { z } from 'zod';
import { useSettingsStore } from '../../store/ui/settings-store';
import { Language } from './types';
import { getTranslator } from './utils';

/**
 * Configure global Zod error map for i18n.
 * This looks for `params.i18n` in the issue to translate custom error messages.
 */
export const initZodI18n = () => {
    z.setErrorMap(((issue: any, ctx: any) => {
        const { language } = useSettingsStore.getState();
        const { t } = getTranslator(language as Language);

        // 1. Handle Custom Refinements with internationalization keys
        if (issue.code === z.ZodIssueCode.custom) {
            if (issue.params && issue.params.i18n) {
                return { message: t(issue.params.i18n as any) };
            }
        }

        // Fallback to default Zod message
        return { message: ctx.defaultError };
    }) as any);
};
