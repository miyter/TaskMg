import { DensityLevel, setDensity, setFont, setFontSize } from '../../core/ui-settings-manager';
import { setupRadioGroupHandler } from './common-handlers';

export function setupDensityHandler(): void {
    setupRadioGroupHandler('sidebar-density', 'sidebar_density', (val) => {
        setDensity(val as DensityLevel);
    });
}

export function setupFontHandlers(): void {
    setupRadioGroupHandler('font-size', 'fontSize', (val) => {
        setFontSize(val);
    });

    const enSelect = document.querySelector('select[name="font-en-select"]');
    const jpSelect = document.querySelector('select[name="font-jp-select"]');

    if (enSelect) {
        enSelect.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            setFont('EN', target.value);
        });
    }

    if (jpSelect) {
        jpSelect.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            setFont('JP', target.value);
        });
    }
}

export function setupVisibleTaskCountHandler(): void {
    const select = document.querySelector('select[name="visible-task-count"]');
    if (select) {
        select.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            localStorage.setItem('visible_task_count', target.value);
            window.dispatchEvent(new CustomEvent('visible-task-count-updated', { detail: { count: Number(target.value) } }));
        });
    }
}

export function setupTimezoneHandler(): void {
    const tzSelect = document.querySelector('select[name="timezone-select"]');
    if (tzSelect) {
        tzSelect.addEventListener('change', (e) => {
            const target = e.target as HTMLSelectElement;
            localStorage.setItem('timezone', target.value);
            window.dispatchEvent(new CustomEvent('timezone-changed', { detail: { timezone: target.value } }));
        });
    }
}
