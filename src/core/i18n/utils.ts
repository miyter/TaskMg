/**
 * i18n Pure Utility Functions
 * NO React dependencies, NO Store dependencies.
 */

import { translations } from './constants';
import { I18nKeys, Language } from './types';

export const getTranslator = (language: Language) => {
    function t(key: I18nKeys, params?: Record<string, string | number>): string {
        const langData = translations[language];
        const enData = translations['en'];

        // Resolve path
        const resolve = (obj: any, path: string): string => {
            return path.split('.').reduce((acc, part) => acc && acc[part], obj);
        };

        let result = resolve(langData, key);
        if (!result) {
            result = resolve(enData, key) || key;
        }

        if (params) {
            return Object.entries(params).reduce((acc, [key, value]) => {
                return acc.replace(`{${key}}`, String(value));
            }, result);
        }

        return result;
    }

    function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
        try {
            return new Intl.NumberFormat(language === 'ja' ? 'ja-JP' : 'en-US', options).format(value);
        } catch (e) {
            return String(value);
        }
    }

    function formatCurrency(value: number, currency: string = 'USD'): string {
        return formatNumber(value, { style: 'currency', currency });
    }

    return { t, formatNumber, formatCurrency };
};
