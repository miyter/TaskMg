export function renderWiki(container) {
    if (!container) return;
    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-6">
            <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Framework Wiki</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">GTD (Getting Things Done)</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        「頭の中を空っぽにする」ストレスフリーの仕事術。全ての気になることを収集し、処理し、整理するプロセス。
                    </p>
                    <ul class="list-disc list-inside text-sm text-gray-500 space-y-1">
                        <li>Capture (収集)</li>
                        <li>Clarify (明確化)</li>
                        <li>Organize (整理)</li>
                        <li>Reflect (見直し)</li>
                        <li>Engage (実行)</li>
                    </ul>
                </div>

                <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-xl font-bold mb-2 text-green-600 dark:text-green-400">WOOP</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                        願望を実現するためのメンタル・コントラスティング戦略。
                    </p>
                    <ul class="list-disc list-inside text-sm text-gray-500 space-y-1">
                        <li>Wish (願い)</li>
                        <li>Outcome (結果)</li>
                        <li>Obstacle (障害)</li>
                        <li>Plan (計画) - If/Thenプランニング</li>
                    </ul>
                </div>
                 <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-100 dark:border-gray-700">
                    <h3 class="text-xl font-bold mb-2 text-purple-600 dark:text-purple-400">OKR</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">
                         Objectives and Key Results. 野心的な目標と測定可能な成果指標を設定する。
                    </p>
                </div>
            </div>
        </div>
    `;
}
