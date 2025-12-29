export function createAccordionSection(id, title, icon, content, isOpen = false) {
    return `
        <div class="settings-accordion border-b border-gray-100 dark:border-gray-700 last:border-0" data-section="${id}">
            <button class="accordion-header w-full flex items-center justify-between py-4 px-2 focus:outline-none group hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                <div class="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                    ${icon}
                    ${title}
                </div>
                <svg class="accordion-icon w-5 h-5 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            <div class="accordion-content overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}" style="${isOpen ? '' : 'max-height: 0px;'}">
                <div class="pt-2 pb-6 px-2">
                    ${content}
                </div>
            </div>
        </div>
    `;
}

export function createRadioOption(name, value, label, isChecked, icon = '') {
    return `
        <label class="flex items-center justify-center gap-2 cursor-pointer p-3 border ${isChecked ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'} rounded-lg transition-all duration-200">
            <input type="radio" name="${name}" value="${value}" class="hidden" ${isChecked ? 'checked' : ''}>
            ${icon}
            <span class="text-sm font-medium">${label}</span>
        </label>
    `;
}

export function createSelectOption(label, options, selectedValue, name) {
    const optionsHtml = options.map(opt =>
        `<option value="${opt.value}" ${opt.value === selectedValue ? 'selected' : ''}>${opt.label}</option>`
    ).join('');

    return `
        <div>
            <label for="${name}" class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">${label}</label>
            <div class="relative">
                <select id="${name}" name="${name}" class="w-full pl-3 pr-8 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-shadow">
                    ${optionsHtml}
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    `;
}
