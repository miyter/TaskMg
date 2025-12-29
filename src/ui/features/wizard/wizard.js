let currentStep = 0;

export function renderWizard(container) {
    if (!container) return;

    // 現在のステップに応じたレンダリング
    switch (currentStep) {
        case 0:
            renderWelcome(container);
            break;
        case 1:
            renderStep1(container);
            break;
        case 2:
            renderStep2(container);
            break;
        case 3:
            renderStep3(container);
            break;
        default:
            renderWelcome(container);
            currentStep = 0;
    }
}

// 共通パーツ：プログレスバー
function getProgressBar(step) {
    const activeClass = "bg-blue-600 text-white font-bold";
    const inactiveClass = "bg-gray-200 dark:bg-gray-700 text-gray-500 font-bold";
    const pipeActive = "bg-blue-600";
    const pipeInactive = "bg-gray-200 dark:bg-gray-700";

    return `
    <div class="flex items-center justify-between mb-8">
        <div class="flex items-center space-x-4 mx-auto">
            <div class="w-8 h-8 rounded-full ${step >= 1 ? activeClass : inactiveClass} flex items-center justify-center">1</div>
            <div class="text-sm font-medium ${step >= 1 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}">Vision</div>
            <div class="w-8 h-1 ${step >= 2 ? pipeActive : pipeInactive}"></div>
            <div class="w-8 h-8 rounded-full ${step >= 2 ? activeClass : inactiveClass} flex items-center justify-center">2</div>
            <div class="text-sm font-medium ${step >= 2 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}">Strategy</div>
             <div class="w-8 h-1 ${step >= 3 ? pipeActive : pipeInactive}"></div>
             <div class="w-8 h-8 rounded-full ${step >= 3 ? activeClass : inactiveClass} flex items-center justify-center">3</div>
             <div class="text-sm font-medium ${step >= 3 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}">Action</div>
        </div>
    </div>`;
}

function renderWelcome(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">目標設計ウィザード</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div class="p-8">
                    ${getProgressBar(0)}
                
                    <div class="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">目標設定プロセスを開始</h3>
                        <p class="mt-1 text-sm text-gray-500">Backwards Designアプローチで、ゴールから逆算してタスクを生成します。</p>
                        <div class="mt-6">
                            <button id="wizard-start-btn" type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                開始する
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#wizard-start-btn')?.addEventListener('click', () => {
        currentStep = 1;
        renderWizard(container);
    });
}

function renderStep1(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Step 1: Vision (目的地)</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
                ${getProgressBar(1)}
                <p class="mb-4 text-gray-700 dark:text-gray-300">あなたが達成したい最終的なゴールは何ですか？（例：3ヶ月後にWebアプリをリリースする）</p>
                <textarea class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition" rows="4" placeholder="ゴールを具体的に記述..."></textarea>
                
                <div class="mt-6 flex justify-between">
                    <button id="wizard-back-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">戻る</button>
                    <button id="wizard-next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition">次へ: Strategy</button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#wizard-back-btn')?.addEventListener('click', () => {
        currentStep = 0;
        renderWizard(container);
    });

    container.querySelector('#wizard-next-btn')?.addEventListener('click', () => {
        currentStep = 2;
        renderWizard(container);
    });
}

function renderStep2(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Step 2: Strategy (戦略)</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
                ${getProgressBar(2)}
                <p class="mb-4 text-gray-700 dark:text-gray-300">そのゴールを達成するために、どのような戦略やマイルストーンが必要ですか？</p>
                <div class="space-y-4">
                     <input type="text" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700" placeholder="マイルストーン 1 (例: MVPの機能定義完了)">
                     <input type="text" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700" placeholder="マイルストーン 2 (例: データベース設計完了)">
                     <input type="text" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700" placeholder="マイルストーン 3 (例: フロントエンド実装)">
                </div>
                
                <div class="mt-6 flex justify-between">
                    <button id="wizard-back-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">戻る</button>
                    <button id="wizard-next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition">次へ: Action</button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#wizard-back-btn')?.addEventListener('click', () => {
        currentStep = 1;
        renderWizard(container);
    });

    container.querySelector('#wizard-next-btn')?.addEventListener('click', () => {
        currentStep = 3;
        renderWizard(container);
    });
}

function renderStep3(container) {
    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Step 3: Action (行動)</h2>
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
                ${getProgressBar(3)}
                <p class="mb-4 text-gray-700 dark:text-gray-300">今日からできる具体的なアクションアイテムに分解しましょう。</p>
                <textarea class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition" rows="6" placeholder="- [ ] リポジトリを作成する\n- [ ] READMEを書く\n- [ ] UIデザインをスケッチする"></textarea>
                
                <div class="mt-6 flex justify-between">
                    <button id="wizard-back-btn" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">戻る</button>
                    <button id="wizard-finish-btn" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md transition flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        完了してダッシュボードへ
                    </button>
                </div>
            </div>
        </div>
    `;

    container.querySelector('#wizard-back-btn')?.addEventListener('click', () => {
        currentStep = 2;
        renderWizard(container);
    });

    container.querySelector('#wizard-finish-btn')?.addEventListener('click', () => {
        alert('目標が作成されました！（機能は未実装）');
        currentStep = 0; // リセット
        renderWizard(container);
    });
}
