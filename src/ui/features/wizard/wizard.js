let state = {
    mode: 'backward', // 'backward' | 'woop' | 'okr'
    step: 0, // 0: Welcome, 1~N: Steps
    data: {} // 入力データを保持
};

// モード定義と設定
const WIZARD_MODES = {
    backward: {
        id: 'backward',
        label: 'Backward Design',
        description: 'ゴールから逆算して、着実なタスクを設計します。長期的なプロジェクトに最適です。',
        steps: [
            {
                title: 'Goal / KGI',
                description: '最終ゴールの日付と状態（KGI）を定義しましょう。',
                inputs: [{ type: 'textarea', placeholder: '例：2025年3月31日までに、月間アクティブユーザー1万人を達成する。' }]
            },
            {
                title: 'Milestone',
                description: 'ゴールの1ヶ月前に到達すべき状態は？',
                inputs: [{ type: 'textarea', placeholder: '例：コア機能の実装が完了し、ベータ版を100人に配布済みである。' }]
            },
            {
                title: 'First Action',
                description: '今すぐ始めるべき最初のアクションは？',
                inputs: [{ type: 'textarea', placeholder: '例：競合アプリのレビューを分析して機能リストを作る。' }]
            }
        ]
    },
    woop: {
        id: 'woop',
        label: 'WOOP',
        description: '願望と障害を対比させ、実行計画を自動化します。習慣化や困難な目標に有効です。',
        steps: [
            {
                title: 'Wish (願望)',
                description: '達成したいことは何ですか？（挑戦的だが達成可能なもの）',
                inputs: [{ type: 'textarea', placeholder: '例：毎日30分、英語の勉強をする。' }]
            },
            {
                title: 'Outcome (結果)',
                description: 'それが達成できた時の「最高のメリット」や感情を詳しくイメージしてください。',
                inputs: [{ type: 'textarea', placeholder: '例：字幕なしで海外ドラマを楽しめるようになり、自信がつく。' }]
            },
            {
                title: 'Obstacle (障害)',
                description: 'それを邪魔する、あなた自身の「内面の障害」（感情・癖・思い込み）は何ですか？',
                inputs: [{ type: 'textarea', placeholder: '例：仕事で疲れて帰ってくると、ついスマホでSNSを見てしまう。' }]
            },
            {
                title: 'Plan (計画)',
                description: '「もし（障害）が起きたら、（行動）する」という形で計画を立てましょう。',
                inputs: [{ type: 'textarea', placeholder: '例：もし「疲れてソファに座りそう」になったら、「すぐにテキストを開く」とする。' }]
            }
        ]
    },
    okr: {
        id: 'okr',
        label: 'OKR',
        description: '野心的な目標(O)と、測定可能な成果(KR)を組み合わせます。組織やチーム、高い成長を目指す個人に。',
        steps: [
            {
                title: 'Objective',
                description: '定性的でワクワクするような目標を1つ決めてください。',
                inputs: [{ type: 'textarea', placeholder: '例：世界中のエンジニアに愛される開発ツールを作る！' }]
            },
            {
                title: 'Key Results',
                description: '目標達成を測るための、3つの具体的な数字（指標）を設定してください。',
                inputs: [
                    { type: 'text', placeholder: 'KR 1 (例: GitHubスター数 1,000到達)' },
                    { type: 'text', placeholder: 'KR 2 (例: 週間ダウンロード数 500回)' },
                    { type: 'text', placeholder: 'KR 3 (例: ユーザー継続率 40%維持)' }
                ]
            }
        ]
    }
};

export function renderWizard(container) {
    if (!container) return;

    // ステップに応じたレンダリング
    if (state.step === 0) {
        renderWelcome(container);
    } else {
        renderStep(container);
    }
}

// モード選択タブの生成
function getModeSelector() {
    return `
        <div class="flex justify-center space-x-2 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg inline-flex mx-auto w-full max-w-lg">
            ${Object.values(WIZARD_MODES).map(mode => `
                <button type="button" 
                    class="mode-select-btn flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${state.mode === mode.id ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
                    data-mode="${mode.id}">
                    ${mode.label}
                </button>
            `).join('')}
        </div>
    `;
}

// プログレスバー（動的）
function getProgressBar() {
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

function renderWelcome(container) {
    const config = WIZARD_MODES[state.mode];

    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">目標設計ウィザード</h2>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-8">
                    ${getModeSelector()}
                
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
            renderWizard(container);
        });
    });

    // 開始イベント
    container.querySelector('#wizard-start-btn')?.addEventListener('click', () => {
        state.step = 1;
        renderWizard(container);
    });
}

function renderStep(container) {
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
                ${getProgressBar()}
                
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
        renderWizard(container); // 0になればWelcome画面へ
    });

    container.querySelector('#wizard-next-btn')?.addEventListener('click', () => {
        // 必要なら入力値を保存する処理をここに追加
        state.step++;
        renderWizard(container);
    });

    container.querySelector('#wizard-finish-btn')?.addEventListener('click', () => {
        alert(`${config.label}の目標が作成されました！（ダッシュボードへ移動します）`);
        state.step = 0; // リセット
        renderWizard(container);
    });
}
