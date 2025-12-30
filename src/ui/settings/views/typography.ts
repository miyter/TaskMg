import { FONT_OPTIONS, getCurrentFonts } from '../../layout/fonts';
import { createRadioOption, createSelectOption } from './components';

export const FONT_SIZES = {
    SMALL: 'sm',
    BASE: 'base',
    MEDIUM: 'md',
    LARGE: 'lg',
    XL: 'xl'
};

export function getTypographyContent(): string {
    const current = getCurrentFonts();
    return `
        <div class="space-y-4">
            ${createSelectOption('英数字フォント', FONT_OPTIONS.EN, current.en, 'font-en-select')}
            ${createSelectOption('日本語フォント', FONT_OPTIONS.JP, current.jp, 'font-jp-select')}
        </div>
    `;
}

export function getFontSizeContent(currentFontSize: string): string {
    return `
        <div class="grid grid-cols-5 gap-2">
            ${createRadioOption('font-size', FONT_SIZES.SMALL, 'Small', currentFontSize === FONT_SIZES.SMALL)}
            ${createRadioOption('font-size', FONT_SIZES.BASE, 'Base', currentFontSize === FONT_SIZES.BASE)}
            ${createRadioOption('font-size', FONT_SIZES.MEDIUM, 'Medium', currentFontSize === FONT_SIZES.MEDIUM)}
            ${createRadioOption('font-size', FONT_SIZES.LARGE, 'Large', currentFontSize === FONT_SIZES.LARGE)}
            ${createRadioOption('font-size', FONT_SIZES.XL, 'XL', currentFontSize === FONT_SIZES.XL)}
        </div>
    `;
}
