import { WIZARD_MODES } from '../wizard-config.js';

export function getModeSelector(currentMode) {
    return `
        <div class="flex justify-center space-x-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex mx-auto w-full max-w-lg">
            ${Object.values(WIZARD_MODES).map(mode => `
                <button type="button" 
                    class="mode-select-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${currentMode === mode.id ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
                    data-mode="${mode.id}">
                    ${mode.label}
                </button>
            `).join('')}
        </div>
    `;
}
