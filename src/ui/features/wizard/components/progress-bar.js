import { WIZARD_MODES } from '../wizard-config.js';

export function getProgressBar(state) {
    const config = WIZARD_MODES[state.mode];
    const totalSteps = config.steps.length;

    // step 1-based index for display
    let html = '<div class="flex items-center justify-between mb-8 max-w-2xl mx-auto">';
    html += '<div class="flex items-center space-x-1 mx-auto w-full justify-center">';

    config.steps.forEach((s, i) => {
        const stepNum = i + 1;
        const isActive = state.step >= stepNum;
        const isCurrent = state.step === stepNum;

        const activeCircle = "bg-blue-600 text-white font-bold ring-4 ring-blue-100 dark:ring-blue-900";
        const inactiveCircle = "bg-gray-200 dark:bg-gray-700 text-gray-500 font-bold";
        const doneCircle = "bg-green-500 text-white font-bold";

        let circleClass = inactiveCircle;
        if (isCurrent) circleClass = activeCircle;
        else if (isActive) circleClass = doneCircle;

        const activeLine = "bg-green-500";
        const inactiveLine = "bg-gray-200 dark:bg-gray-700";

        // Circle
        html += `
            <div class="flex flex-col items-center relative z-10 w-16">
                <div class="w-8 h-8 rounded-full ${circleClass} flex items-center justify-center transition-all duration-300">
                    ${isActive && !isCurrent ? '✓' : stepNum}
                </div>
                <div class="text-[10px] mt-1 font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-400'} text-center w-20 truncate">
                    ${s.title}
                </div>
            </div>
        `;

        // Line
        if (i < totalSteps - 1) {
            html += `<div class="h-1 flex-1 mx-[-10px] mt-[-14px] z-0 ${state.step > stepNum ? activeLine : inactiveLine} transition-all duration-500"></div>`;
        }
    });

    html += '</div></div>';
    return html;
}
