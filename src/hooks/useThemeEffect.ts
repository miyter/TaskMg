import { useLayoutEffect } from 'react';
import { useSettingsStore } from '../store/ui/settings-store';
import { useUIStore } from '../store/ui/ui-store';

/**
 * Applies global theme settings (fonts, density, sizes) to the DOM.
 */
export const useThemeEffect = () => {
    const { fontEn, fontJp, fontSize, density, themeMode } = useSettingsStore();
    const { setSidebarDensity } = useUIStore();

    // Apply Theme (Light / Dark)
    useLayoutEffect(() => {
        const root = document.documentElement;
        const applyDark = () => {
            if (themeMode === 'dark') {
                root.classList.add('dark');
            } else if (themeMode === 'light') {
                root.classList.remove('dark');
            } else {
                // System preference
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        applyDark();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (themeMode === 'system') applyDark();
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [themeMode]);

    // Apply Fonts
    useLayoutEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--font-en', `"${fontEn}"`);
        root.style.setProperty('--font-jp', `"${fontJp}"`);
    }, [fontEn, fontJp]);

    // Apply Font Size
    useLayoutEffect(() => {
        const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];
        document.body.classList.remove(...sizeClasses);
        document.body.classList.add(`font-app-${fontSize}`);
    }, [fontSize]);

    // Apply Density (Global)
    useLayoutEffect(() => {
        const classes = ['app-density-compact', 'app-density-normal', 'app-density-comfortable', 'app-density-spacious'];

        document.body.classList.remove(...classes);
        document.body.classList.add(`app-density-${density}`);

        // Sync density to sidebar store as well
        setSidebarDensity(density);
    }, [density, setSidebarDensity]);
};
