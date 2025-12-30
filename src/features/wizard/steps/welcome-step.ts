import { getModeSelector } from '../components/mode-selector';
import { WIZARD_MODES, WizardModeId } from '../wizard-config';
import { WizardState } from '../wizard-types';

type RenderWizardCallback = (container: HTMLElement) => void;

export function renderWelcome(container: HTMLElement, state: WizardState, renderWizardCallback: RenderWizardCallback) {
    const config = WIZARD_MODES[state.mode];

    container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 h-full max-h-[700px] flex flex-col">
            <!-- パンくずリスト風のタイトル（コンパクト） -->
            <div class="mb-4 flex-shrink-0">
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <svg class="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span class="font-medium">目標設計ウィザード</span>
                    <svg class="w-3 h-3 mx-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">手法を選択</span>
                </div>
            </div>

            <!-- 手法選択（主役） -->
            <div class="mb-6 flex-shrink-0">
                <h2 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">フレームワークを選択</h2>
                ${getModeSelector(state.mode)}
            </div>

            <!-- プレビューエリア（中央・固定高さ） -->
            <div class="flex-1 mb-6 min-h-0">
                <div class="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
                    <div class="h-full flex flex-col items-center justify-center p-8 text-center">
                        <!-- アイコン（小さく） -->
                        <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg flex-shrink-0">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <!-- タイトルと説明 -->
                        <h3 class="font-bold text-gray-900 dark:text-white mb-3">${config.label}</h3>
                        <p class="text-sm text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            ${config.description}
                        </p>

                        <!-- 特徴リスト（オプション） -->
                        <div class="mt-6 flex flex-wrap gap-2 justify-center">
                            ${getFeatureTags(state.mode)}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 実行ボタン（下部固定・コンパクト） -->
            <div class="flex justify-center pb-4 flex-shrink-0">
                <button id="wizard-start-btn" type="button" class="group inline-flex items-center px-6 py-3 border-2 border-transparent shadow-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:scale-105 active:scale-95">
                    <span>このモードで開始する</span>
                    <svg class="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    // モード切り替えイベント
    container.querySelectorAll<HTMLElement>('.mode-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target as HTMLElement; // Could be button or child? Button usually.
            // .mode-select-btn has data-mode.
            state.mode = (target.closest('.mode-select-btn') as HTMLElement).dataset.mode as WizardModeId;
            renderWizardCallback(container);
        });
    });

    // 開始イベント
    container.querySelector('#wizard-start-btn')?.addEventListener('click', () => {
        state.step = 1;
        renderWizardCallback(container);
    });
}

// 各モードの特徴タグを生成（小さく）
function getFeatureTags(mode: WizardModeId): string {
    const features: Record<string, string[]> = {
        okr: ['測定可能', '野心的目標', 'チーム向け'],
        woop: ['科学的根拠', '障害対策', '個人向け'],
        backward: ['逆算思考', 'マイルストーン', '長期計画']
    };

    return (features[mode] || []).map(tag => `
        <span class="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
            ${tag}
        </span>
    `).join('');
}
