export function setupRadioGroupHandler(name: string, storageKey: string, onUpdate: (value: string) => void): void {
    const radios = document.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`);
    const savedValue = localStorage.getItem(storageKey);

    const activeClasses = ['border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300'];
    const inactiveClasses = ['border-gray-200', 'dark:border-gray-700', 'hover:bg-gray-50', 'dark:hover:bg-gray-700/50', 'text-gray-600', 'dark:text-gray-300'];

    const updateVisuals = (selectedRadio: HTMLInputElement) => {
        radios.forEach(r => {
            const label = r.parentElement;
            if (!label) return;

            if (r === selectedRadio) {
                label.classList.remove(...inactiveClasses);
                label.classList.add(...activeClasses);
            } else {
                label.classList.remove(...activeClasses);
                label.classList.add(...inactiveClasses);
            }
        });
    };

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const target = e.target as HTMLInputElement;
            const val = target.value;
            localStorage.setItem(storageKey, val);
            updateVisuals(target);
            onUpdate(val);
        });
    });

    if (savedValue) {
        radios.forEach(radio => {
            if (radio.value === savedValue) radio.checked = true;
        });
        // Initial visual update? Maybe needed if we want to sync visuals on load.
        // The original code didn't explicitly call updateVisuals on load, 
        // but maybe the UI is rendered with correct classes by default? 
        // Actually, let's trigger it if found.
        const checked = Array.from(radios).find(r => r.checked);
        if (checked) updateVisuals(checked);

    } else {
        const checked = Array.from(radios).find(r => r.checked);
        if (checked) localStorage.setItem(storageKey, checked.value);
    }
}

export function setupAccordionHandlers(): void {
    const headers = document.querySelectorAll<HTMLElement>('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            if (!currentItem) return;

            const currentContent = currentItem.querySelector('.accordion-content') as HTMLElement;
            const currentIcon = header.querySelector('.accordion-icon') as HTMLElement;
            if (!currentContent || !currentIcon) return;

            const isClosing = currentContent.style.maxHeight !== '0px' && currentContent.style.maxHeight !== '';

            // Close all others
            document.querySelectorAll('.settings-accordion').forEach(item => {
                if (item !== currentItem) {
                    const content = item.querySelector('.accordion-content') as HTMLElement;
                    const icon = item.querySelector('.accordion-icon') as HTMLElement;
                    if (content) {
                        content.style.maxHeight = '0px';
                        content.classList.remove('opacity-100');
                        content.classList.add('opacity-0');
                    }
                    if (icon) {
                        icon.classList.remove('rotate-180');
                    }
                }
            });

            // Toggle current
            if (isClosing) {
                currentContent.style.maxHeight = '0px';
                currentContent.classList.remove('opacity-100');
                currentContent.classList.add('opacity-0');
                currentIcon.classList.remove('rotate-180');
            } else {
                currentContent.style.maxHeight = currentContent.scrollHeight + 'px';
                currentContent.classList.remove('opacity-0');
                currentContent.classList.add('opacity-100');
                currentIcon.classList.add('rotate-180');
            }
        });
    });

    // Initialize height for any pre-opened items
    document.querySelectorAll('.settings-accordion').forEach(item => {
        const content = item.querySelector('.accordion-content') as HTMLElement;
        if (content && content.classList.contains('opacity-100')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
}
