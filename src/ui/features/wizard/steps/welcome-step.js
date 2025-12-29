import { WIZARD_MODES } from '../wizard-config.js';
import { getModeSelector } from '../components/mode-selector.js';

export function renderWelcome(container, state, renderWizardCallback) {
    const config = WIZARD_MODES[state.mode];

    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">目標設計ウィザード</h2>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-8">
                    ${getModeSelector(state.mode)}
                
                    <div class="text-center py-12 px-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 transition-all duration-300">
                        <div class="mb-6">
                            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${config.label}</h3>
                            <p class="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">${config.description}</p>
                        </div>

                        <div class="mt-8">
                            <button id="wizard-start-btn" type="button" class="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105">
                                このモードで開始する
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // モード切り替えイベント
    container.querySelectorAll('.mode-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            state.mode = e.target.dataset.mode;
            renderWizardCallback(container);
        });
    });

    // 開始イベント
    container.querySelector('#wizard-start-btn')?.addEventListener('click', () => {
        state.step = 1;
        renderWizardCallback(container);
    });
}
