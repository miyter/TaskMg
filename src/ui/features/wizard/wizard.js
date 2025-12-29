import { renderWelcome } from './steps/welcome-step.js';
import { renderStep } from './steps/question-step.js';

let state = {
    mode: 'backward', // 'backward' | 'woop' | 'okr'
    step: 0, // 0: Welcome, 1~N: Steps
    data: {} // 入力データを保持
};

export function renderWizard(container) {
    if (!container) return;

    // ステップに応じたレンダリング
    if (state.step === 0) {
        renderWelcome(container, state, renderWizard);
    } else {
        renderStep(container, state, renderWizard);
    }
}
