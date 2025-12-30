import { SidebarDensity, UI_CONFIG } from '../core/ui-constants';

/**
 * Get the tailwind padding class for a specific density level
 */
export const getDensityClass = (density: string): string => {
    return UI_CONFIG.DENSITY_CLASSES[density as SidebarDensity] || UI_CONFIG.DENSITY_CLASSES.normal;
};

/**
 * Get CSS variable value for a density level (if implemented with CSS variables)
 * or return specific height/margin values
 */
export const getDensitySpacing = (density: string): number => {
    switch (density) {
        case 'compact': return 4;
        case 'normal': return 8;
        case 'comfortable': return 12;
        case 'spacious': return 16;
        default: return 8;
    }
};
