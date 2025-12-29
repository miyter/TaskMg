import { setFont } from '../../layout/fonts.js';
import { SIDEBAR_CONFIG } from '../../features/sidebar/sidebar-constants.js';
import { setupRadioGroupHandler } from './common-handlers.js';

export function setupDensityHandler() {
    setupRadioGroupHandler('sidebar-density', SIDEBAR_CONFIG.STORAGE_KEYS.DENSITY, (val) => {
        if (val === 'compact') localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'true');
        else localStorage.setItem(SIDEBAR_CONFIG.STORAGE_KEYS.COMPACT, 'false');

        const densities = ['compact', 'normal', 'comfortable', 'spacious'];
        const classes = densities.map(d => `app-density-${d}`);
        document.body.classList.remove(...classes);
        document.body.classList.add(`app-density-${val}`);

        window.dispatchEvent(new CustomEvent('sidebar-settings-updated', { detail: { density: val } }));
    });
}

export function setupFontHandlers() {
    setupRadioGroupHandler('font-size', 'fontSize', (val) => {
        const sizeClasses = ['font-app-sm', 'font-app-base', 'font-app-md', 'font-app-lg', 'font-app-xl'];
        document.body.classList.remove(...sizeClasses);
        document.body.classList.add(`font-app-${val}`);
    });

    const enSelect = document.querySelector('select[name="font-en-select"]');
    const jpSelect = document.querySelector('select[name="font-jp-select"]');

    if (enSelect) {
        enSelect.addEventListener('change', (e) => {
            setFont('EN', e.target.value);
        });
    }

    if (jpSelect) {
        jpSelect.addEventListener('change', (e) => {
            setFont('JP', e.target.value);
        });
    }
}

export function setupVisibleTaskCountHandler() {
    const select = document.querySelector('select[name="visible-task-count"]');
    if (select) {
        select.addEventListener('change', (e) => {
            localStorage.setItem('visible_task_count', e.target.value);
            window.dispatchEvent(new CustomEvent('visible-task-count-updated', { detail: { count: Number(e.target.value) } }));
        });
    }
}

export function setupTimezoneHandler() {
    const tzSelect = document.querySelector('select[name="timezone-select"]');
    if (tzSelect) {
        tzSelect.addEventListener('change', (e) => {
            localStorage.setItem('timezone', e.target.value);
            window.dispatchEvent(new CustomEvent('timezone-changed', { detail: { timezone: e.target.value } }));
        });
    }
}
