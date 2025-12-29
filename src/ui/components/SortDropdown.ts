/**
 * ソートドロップダウンのUIロジック
 * TypeScript化: 2025-12-29
 */

import { updateUI } from '../core/DataSyncManager.js';

export function setupCustomSortDropdown() {
    const trigger = document.getElementById('sort-trigger');
    const menu = document.getElementById('sort-menu');
    const label = document.getElementById('sort-label');
    const options = document.querySelectorAll('.sort-option');

    if (!trigger || !menu || !label) return;

    const toggleMenu = (open: boolean) => {
        if (open) {
            menu.classList.replace('opacity-0', 'opacity-100');
            menu.classList.replace('invisible', 'visible');
            menu.classList.replace('scale-95', 'scale-100');
            menu.classList.replace('pointer-events-none', 'pointer-events-auto');
            document.addEventListener('click', closeMenu);
        } else {
            menu.classList.replace('opacity-100', 'opacity-0');
            menu.classList.replace('visible', 'invisible');
            menu.classList.replace('scale-100', 'scale-95');
            menu.classList.replace('pointer-events-auto', 'pointer-events-none');
            document.removeEventListener('click', closeMenu);
        }
    };

    const closeMenu = (e: MouseEvent) => {
        if (e.target instanceof HTMLElement) {
            if (menu.contains(e.target) || trigger.contains(e.target)) {
                return;
            }
        }
        toggleMenu(false);
    };

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('opacity-100');
        toggleMenu(!isOpen);
    });

    options.forEach(option => {
        option.addEventListener('click', (e) => {
            const el = option as HTMLElement;
            const value = el.dataset.value;
            const text = el.textContent || '';
            label.textContent = text;
            if (value) trigger.dataset.value = value;
            updateUI();
            toggleMenu(false);
        });
    });

    if (!trigger.dataset.value) {
        trigger.dataset.value = 'createdAt_desc';
        label.textContent = "作成日(新しい順)";
    }
}
