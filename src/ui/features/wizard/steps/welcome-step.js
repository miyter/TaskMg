import { WIZARD_MODES } from '../wizard-config.js';
import { getModeSelector } from '../components/mode-selector.js';

export function renderWelcome(container, state, renderWizardCallback) {
    const config = WIZARD_MODES[state.mode];

    container.innerHTML = `
        <div class="max-w-6xl mx-auto py-6 px-4 h-full flex flex-col">
            <!-- パンくずリスト風のタイトル -->
            <div class="mb-8">
                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                    <span class="font-medium">目標設計ウィザード</span>
                    <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                    <span class="text-gray-700 dark:text-gray-300 font-semibold">手法を選択</span>
                </div>
            </div>

            <!-- 手法選択（主役） -->
            <div class="mb-10">
                <h2 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">フレームワークを選択</h2>
                ${getModeSelector(state.mode)}
            </div>

            <!-- プレビューエリア（中央） -->
            <div class="flex-1 mb-8">
                <div class="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
                    <div class="h-full flex flex-col items-center justify-center p-12 text-center">
                        <!-- アイコン -->
                        <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg">
                            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        <!-- タイトルと説明 -->
                        <h3 class="font-bold text-gray-900 dark:text-white mb-4">${config.label}</h3>
                        <p class="text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                            ${config.description}
                        </p>

                        <!-- 特徴リスト（オプション） -->
                        <div class="mt-8 flex flex-wrap gap-3 justify-center">
                            ${getFeatureTags(state.mode)}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 実行ボタン（下部固定） -->
            <div class="flex justify-center pb-4">
                <button id="wizard-start-btn" type="button" class="group inline-flex items-center px-8 py-4 border-2 border-transparent shadow-xl font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all transform hover:scale-105 active:scale-95">
                    <span>このモードで開始する</span>
                    <svg class="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                </button>
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

// 各モードの特徴タグを生成
function getFeatureTags(mode) {
    const features = {
        okr: ['測定可能', '野心的目標', 'チーム向け'],
        woop: ['科学的根拠', '障害対策', '個人向け'],
        backward: ['逆算思考', 'マイルストーン', '長期計画']
    };

    return (features[mode] || []).map(tag => `
        <span class="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">
            ${tag}
        </span>
    `).join('');
}
