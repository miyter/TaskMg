import { WIZARD_MODES } from '../wizard-config.js';
import { getProgressBar } from '../components/progress-bar.js';

export function renderStep(container, state, renderWizardCallback) {
    const config = WIZARD_MODES[state.mode];
    const stepIndex = state.step - 1;
    const stepConfig = config.steps[stepIndex];
    const totalSteps = config.steps.length;

    // 入力フィールドの生成
    const inputsHtml = stepConfig.inputs.map((input, idx) => {
        if (input.type === 'textarea') {
            return `<textarea id="wizard-input-${idx}" class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-base" rows="5" placeholder="${input.placeholder}"></textarea>`;
        } else {
            return `<input type="text" id="wizard-input-${idx}" class="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition text-base" placeholder="${input.placeholder}">`;
        }
    }).join('<div class="h-4"></div>');

    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">${config.label} Mode</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 min-h-[500px] flex flex-col">
                ${getProgressBar(state)}
                
                <div class="flex-1 animate-fade-in">
                    <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Q${state.step}. ${stepConfig.title}</h3>
                    <p class="mb-6 text-gray-600 dark:text-gray-400">${stepConfig.description}</p>
                    
                    <div class="mb-8">
                        ${inputsHtml}
                    </div>
                </div>
                
                <div class="pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <button id="wizard-back-btn" class="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium">
                        戻る
                    </button>
                    
                    ${state.step < totalSteps ? `
                        <button id="wizard-next-btn" class="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition font-medium flex items-center">
                            次へ
                            <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    ` : `
                        <button id="wizard-finish-btn" class="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition font-medium flex items-center transform hover:scale-105">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                            完了して作成
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;

    // イベントリスナー
    container.querySelector('#wizard-back-btn')?.addEventListener('click', () => {
        state.step--;
        renderWizardCallback(container); // 0になればWelcome画面へ
    });

    container.querySelector('#wizard-next-btn')?.addEventListener('click', () => {
        // 必要なら入力値を保存する処理をここに追加
        state.step++;
        renderWizardCallback(container);
    });

    container.querySelector('#wizard-finish-btn')?.addEventListener('click', () => {
        alert(`${config.label}の目標が作成されました！（ダッシュボードへ移動します）`);
        state.step = 0; // リセット
        renderWizardCallback(container);
    });
}
