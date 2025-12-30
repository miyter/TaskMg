import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type FontSize = 'sm' | 'base' | 'md' | 'lg' | 'xl';
export type Density = 'compact' | 'normal' | 'comfortable' | 'spacious';
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
    themeMode: ThemeMode;
    fontEn: string;
    fontJp: string;
    fontSize: FontSize;
    density: Density;

    setThemeMode: (mode: ThemeMode) => void;
    setFontEn: (font: string) => void;
    setFontJp: (font: string) => void;
    setFontSize: (size: FontSize) => void;
    setDensity: (density: Density) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            themeMode: 'system',
            fontEn: 'Inter',
            fontJp: 'M PLUS 2',
            fontSize: 'md',
            density: 'normal',

            setThemeMode: (mode) => set({ themeMode: mode }),
            setFontEn: (font) => set({ fontEn: font }),
            setFontJp: (font) => set({ fontJp: font }),
            setFontSize: (size) => set({ fontSize: size }),
            setDensity: (density) => set({ density }),
        }),
        {
            name: 'app-settings',
            partialize: (state) => ({
                themeMode: state.themeMode,
                fontEn: state.fontEn,
                fontJp: state.fontJp,
                fontSize: state.fontSize,
                density: state.density,
            }),
        }
    )
);
