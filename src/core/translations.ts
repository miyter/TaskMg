/**
 * 翻訳リソースマップ (Legacy Compatibility Layer)
 * 
 * NOTE: Refactored individual parts to `src/core/i18n/*` and `src/hooks/useTranslation.ts`.
 * This file remains for backward compatibility to avoid breaking existing imports.
 * 
 * Ideally, consumers should import from the specific files:
 * - Types: `src/core/i18n/types`
 * - Data: `src/core/i18n/constants`
 * - Utils: `src/core/i18n/utils` (For Stores/Logic)
 * - Hook: `src/hooks/useTranslation` (For React Components)
 */

export { useTranslation } from '../hooks/useTranslation';
export { translations } from './i18n/constants';
export type { I18nKeys } from './i18n/types';
export { getTranslator } from './i18n/utils';

