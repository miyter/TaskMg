// @miyter:20251221
// ソートドロップダウンのUIロジック

import { updateUI } from '../core/DataSyncManager.js';

/**
 * カスタムソートドロップダウンのイベントを設定する
 */
export function setupCustomSortDropdown() {
    const trigger = document.getElementById('sort-trigger');
    const menu = document.getElementById('sort-menu');
    const label = document.getElementById('sort-label');
    const options = document.querySelectorAll('.sort-option');

    if (!trigger || !menu || !label) return;
    
    const toggleMenu = (open) => {
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

    const closeMenu = (e) => {
        if (e && (menu.contains(e.target) || trigger.contains(e.target))) {
            return;
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
            const value = option.dataset.value;
            const text = option.textContent;
            label.textContent = text;
            trigger.dataset.value = value;
            updateUI(); 
            toggleMenu(false);
        });
    });

    if (!trigger.dataset.value) {
        trigger.dataset.value = 'createdAt_desc';
        label.textContent = "作成日(新しい順)";
    }
}