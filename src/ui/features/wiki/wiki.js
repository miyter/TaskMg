import { WIKI_DATA } from './wiki-data.js';
import { MODAL_CLASSES } from '../../core/ui-modal-constants.js';

export function renderWiki(container) {
    if (!container) return;

    // カードグリッドレイアウト
    container.innerHTML = `
        <div class="max-w-6xl mx-auto px-4 py-6">
            <h1 class="text-xl font-bold text-gray-800 dark:text-white mb-6">フレームワークWiki</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                ${WIKI_DATA.frameworks.map(framework => `
                    <div class="framework-card cursor-pointer bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6 transition-all hover:border-blue-500 hover:shadow-lg hover:scale-105" data-framework-id="${framework.id}">
                        <div class="text-4xl mb-3">${framework.icon}</div>
                        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">${framework.title}</h2>
                        <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">${framework.summary}</p>
                        <div class="mt-4 flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
                            <span>詳細を見る</span>
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // カードクリックイベント
    container.querySelectorAll('.framework-card').forEach(card => {
        card.addEventListener('click', () => {
            const frameworkId = card.dataset.frameworkId;
            const framework = WIKI_DATA.frameworks.find(f => f.id === frameworkId);
            if (framework) {
                showFrameworkModal(framework);
            }
        });
    });
}

/**
 * フレームワーク詳細モーダルを表示
 */
function showFrameworkModal(framework) {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    const modalHTML = `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="framework-modal-overlay">
            <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${MODAL_CLASSES.WIDTH.DEFAULT} max-h-[90vh] overflow-hidden animate-scale-in">
                <!-- ヘッダー -->
                <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center gap-3">
                        <span class="text-4xl">${framework.icon}</span>
                        <h2 class="text-xl font-bold text-gray-900 dark:text-white">${framework.title}</h2>
                    </div>
                    <button id="close-framework-modal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <!-- コンテンツ -->
                <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
                    <!-- 概要 -->
                    <div class="mb-6">
                        <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">概要</h3>
                        <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed">${framework.summary}</p>
                    </div>

                    <!-- コンセプト -->
                    ${framework.concepts.map(concept => `
                        <div class="mb-6">
                            <h3 class="text-base font-bold text-gray-900 dark:text-white mb-3">${concept.title}</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">${concept.description}</p>
                            ${concept.items ? `
                                <ul class="space-y-2">
                                    ${concept.items.map(item => `
                                        <li class="flex items-start gap-2">
                                            <span class="text-blue-500 mt-1">•</span>
                                            <div>
                                                <strong class="text-sm font-semibold text-gray-900 dark:text-white">${item.label}:</strong>
                                                <span class="text-sm text-gray-600 dark:text-gray-400"> ${item.description}</span>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            ` : ''}
                        </div>
                    `).join('')}

                    <!-- 使用例 -->
                    ${framework.example ? `
                        <div class="mb-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h3 class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">使用例</h3>
                            <p class="text-sm text-gray-700 dark:text-gray-300 italic">${framework.example}</p>
                        </div>
                    ` : ''}
                </div>

                <!-- フッター -->
                <div class="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <button id="close-framework-modal-btn" class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        閉じる
                    </button>
                    <button id="apply-framework-btn" data-mode="${framework.id}" class="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md transition-all transform hover:scale-105">
                        ウィザードで使用する
                    </button>
                </div>
            </div>
        </div>
    `;

    modalContainer.innerHTML = modalHTML;

    // 閉じるイベント
    const closeModal = () => {
        modalContainer.innerHTML = '';
    };

    document.getElementById('close-framework-modal')?.addEventListener('click', closeModal);
    document.getElementById('close-framework-modal-btn')?.addEventListener('click', closeModal);
    document.getElementById('framework-modal-overlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'framework-modal-overlay') {
            closeModal();
        }
    });

    // ウィザードで使用するボタン
    document.getElementById('apply-framework-btn')?.addEventListener('click', (e) => {
        const modeId = e.target.dataset.mode;
        closeModal();

        // ウィザードに遷移
        window.dispatchEvent(new CustomEvent('change-view', {
            detail: { view: 'wizard', mode: modeId }
        }));
    });

    // Escapeキーで閉じる
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}
