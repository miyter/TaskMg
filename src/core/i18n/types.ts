/**
 * i18n Type Definitions
 */

import { ja } from './constants';

export type Language = 'ja' | 'en';

// Helper to generate dot notation types
type NestedKeyOf<ObjectType extends object> = {
    [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)];

export type I18nKeys = NestedKeyOf<typeof ja>;
