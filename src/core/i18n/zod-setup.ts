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
    type ErrorMapType = Parameters<typeof z.setErrorMap>[0];
    type IssueType = Parameters<ErrorMapType>[0];

    const customErrorMap = (issue: IssueType) => {
        const { language } = useSettingsStore.getState();
        const { t } = getTranslator(language as Language);

        // 1. Handle Custom Refinements with internationalization keys
        if (issue.code === z.ZodIssueCode.custom) {
            // @ts-ignore - 'i18n' is a custom param we add manually in schema
            if (issue.params && issue.params.i18n) {
                // @ts-ignore
                return { message: t(issue.params.i18n) };
            }
        }

        // 2. Handle generic "Required" errors
        if (issue.code === z.ZodIssueCode.invalid_type) {
            if (issue.received === 'undefined' || issue.received === 'null') {
                return { message: t('validation.required') };
            }
        }

        // 3. Fallback
        // @ts-ignore
        return { message: issue.message || t('validation.validation_error') };
    };

    z.setErrorMap(customErrorMap);
};
