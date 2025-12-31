import { SidebarDensity, UI_CONFIG } from '../core/ui-constants';

/** Type guard for SidebarDensity */
const isSidebarDensity = (value: string): value is SidebarDensity => {
    return value in UI_CONFIG.DENSITY_CLASSES;
};

/**
 * Get the tailwind padding class for a specific density level
 */
export const getDensityClass = (density: string): string => {
    if (isSidebarDensity(density)) {
        return UI_CONFIG.DENSITY_CLASSES[density];
    }
    return UI_CONFIG.DENSITY_CLASSES.normal;
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
