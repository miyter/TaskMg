import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Density } from '../../core/ui-constants';
export type { Density } from '../../core/ui-constants';

export type FontSize = 'sm' | 'base' | 'md' | 'lg' | 'xl';
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
    themeMode: ThemeMode;
    fontEn: string;
    fontJp: string;
    fontSize: FontSize;
    density: Density;
    language: 'ja' | 'en';
    customDurations: number[];

    setThemeMode: (mode: ThemeMode) => void;
    setFontEn: (font: string) => void;
    setFontJp: (font: string) => void;
    setFontSize: (size: FontSize) => void;
    setDensity: (density: Density) => void;
    setLanguage: (lang: 'ja' | 'en') => void;
    setCustomDurations: (durations: number[]) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            themeMode: 'system',
            fontEn: 'Inter',
            fontJp: 'M PLUS 2',
            fontSize: 'md',
            density: 'normal',
            language: 'ja',
            customDurations: [15, 30, 45, 60, 75, 90, 120],

            setThemeMode: (mode) => set({ themeMode: mode }),
            setFontEn: (font) => set({ fontEn: font }),
            setFontJp: (font) => set({ fontJp: font }),
            setFontSize: (size) => set({ fontSize: size }),
            setDensity: (density) => set({ density }),
            setLanguage: (lang) => set((state) => {
                // Language-specific layout presets
                // Japanese: More compact due to dense characters
                // English: More spacious for readability
                const presets = {
                    ja: { density: 'normal' as Density, fontSize: 'md' as FontSize },
                    en: { density: 'comfortable' as Density, fontSize: 'base' as FontSize },
                };
                const preset = presets[lang];
                return {
                    language: lang,
                    density: preset.density,
                    fontSize: preset.fontSize,
                };
            }),
            setCustomDurations: (durations) => set({ customDurations: durations.sort((a, b) => a - b) }),
        }),
        {
            name: 'app-settings',
            partialize: (state) => ({
                themeMode: state.themeMode,
                fontEn: state.fontEn,
                fontJp: state.fontJp,
                fontSize: state.fontSize,
                density: state.density,
                language: state.language,
                customDurations: state.customDurations,
            }),
        }
    )
);
