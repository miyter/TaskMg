import { useEffect } from 'react';
import { useSettingsStore } from '../store/ui/settings-store';
import { useUIStore } from '../store/ui/ui-store';

/**
 * Applies global theme settings (fonts, density, sizes) to the DOM.
 * DOM operations are batched within a single useLayoutEffect to minimize reflows.
 */
export const useThemeEffect = () => {
    const { fontEn, fontJp, fontSize, density, themeMode } = useSettingsStore();
    const { setSidebarDensity } = useUIStore();

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        let rafId: number;

        const updateDOM = () => {
            rafId = requestAnimationFrame(() => {
                // --- Theme (Light / Dark) ---
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

                // --- Fonts (no quotes - CSS handles font-family parsing) ---
                root.style.setProperty('--font-en', fontEn);
                root.style.setProperty('--font-jp', fontJp);

                // --- Font Size ---
                const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];
                body.classList.remove(...sizeClasses);
                body.classList.add(`font-app-${fontSize}`);

                // --- Density (Global) ---
                const densityClasses = ['app-density-compact', 'app-density-normal', 'app-density-comfortable', 'app-density-spacious'];
                body.classList.remove(...densityClasses);
                body.classList.add(`app-density-${density}`);
            });
        };

        updateDOM();

        // Sync density to sidebar store as well
        setSidebarDensity(density);

        // --- System Theme Change Listener ---
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (themeMode === 'system') {
                if (mediaQuery.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [themeMode, fontEn, fontJp, fontSize, density, setSidebarDensity]);
};
