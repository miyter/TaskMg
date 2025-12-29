export function setupRadioGroupHandler(name, storageKey, onUpdate) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    const savedValue = localStorage.getItem(storageKey);

    const activeClasses = ['border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/20', 'text-blue-700', 'dark:text-blue-300'];
    const inactiveClasses = ['border-gray-200', 'dark:border-gray-700', 'hover:bg-gray-50', 'dark:hover:bg-gray-700/50', 'text-gray-600', 'dark:text-gray-300'];

    const updateVisuals = (selectedRadio) => {
        radios.forEach(r => {
            const label = r.parentElement;
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
            const val = e.target.value;
            localStorage.setItem(storageKey, val);
            updateVisuals(e.target);
            onUpdate(val);
        });
    });

    if (savedValue) {
        radios.forEach(radio => {
            if (radio.value === savedValue) radio.checked = true;
        });
    } else {
        const checked = Array.from(radios).find(r => r.checked);
        if (checked) localStorage.setItem(storageKey, checked.value);
    }
}

export function setupAccordionHandlers() {
    const headers = document.querySelectorAll('.accordion-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const currentContent = currentItem.querySelector('.accordion-content');
            const currentIcon = header.querySelector('.accordion-icon');
            const isClosing = currentContent.style.maxHeight !== '0px' && currentContent.style.maxHeight !== '';

            // Close all others
            document.querySelectorAll('.settings-accordion').forEach(item => {
                if (item !== currentItem) {
                    const content = item.querySelector('.accordion-content');
                    const icon = item.querySelector('.accordion-icon');
                    content.style.maxHeight = '0px';
                    content.classList.remove('opacity-100');
                    content.classList.add('opacity-0');
                    icon.classList.remove('rotate-180');
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
        const content = item.querySelector('.accordion-content');
        if (content.classList.contains('opacity-100')) {
            content.style.maxHeight = content.scrollHeight + 'px';
        }
    });
}
