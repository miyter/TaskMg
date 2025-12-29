import { setFont, setFontSize, setDensity } from '../../core/ui-settings-manager.js';
import { setupRadioGroupHandler } from './common-handlers.js';

export function setupDensityHandler() {
    setupRadioGroupHandler('sidebar-density', 'sidebar_density', (val) => {
        setDensity(val);
    });
}

export function setupFontHandlers() {
    setupRadioGroupHandler('font-size', 'fontSize', (val) => {
        setFontSize(val);
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
