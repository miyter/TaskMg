import { z } from 'zod';
import { useSettingsStore } from '../../store/ui/settings-store';
import { Language } from './types';
import { getTranslator } from './utils';

/**
 * Configure global Zod error map for i18n.
 * This looks for `params.i18n` in the issue to translate custom error messages.
 * Also handles standard Zod errors with generic translated messages.
 */
export const initZodI18n = () => {
    // Use Parameters utility to get the exact expected types for the error map function from zod directly
    // This avoids dependency on specific exported types that might change between versions (v3 vs v4)
    const customErrorMap = (issue: any, ctx: any) => {
        const { language } = useSettingsStore.getState();
        const { t } = getTranslator(language as Language);

        // 1. Handle Custom Refinements with internationalization keys
        if (issue.code === z.ZodIssueCode.custom) {
            // params is optional in ZodCustomIssue
            if (issue.params && typeof issue.params === 'object' && 'i18n' in issue.params) {
                return { message: t(issue.params.i18n as any) };
            }
        }

        // 2. Handle generic "Required" errors
        if (issue.code === z.ZodIssueCode.invalid_type) {
            if (issue.received === 'undefined' || issue.received === 'null') {
                return { message: t('validation.required') };
            }
        }

        // 3. Fallback
        return { message: ctx.defaultError };
    };

    z.setErrorMap(customErrorMap as any);
};
