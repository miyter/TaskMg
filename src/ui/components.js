// @ts-nocheck
// @miyter:20251221
// 共通UIコンポーネント (確認モーダルなど)

/**
 * 確認メッセージモーダルを表示
 * @param {string} message - 表示メッセージ
 * @param {Function} onConfirm - OKボタン押下時のコールバック
 */
export function showMessageModal(message, onConfirm) {
    document.getElementById('message-modal')?.remove();

    const modalHTML = `
        <div id="message-modal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100">
                <div class="mb-4">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">確認</h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">${message}</p>
                </div>
                <div class="flex justify-end space-x-3">
                    <button id="msg-modal-cancel" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        キャンセル
                    </button>
                    <button id="msg-modal-ok" class="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition-transform active:scale-95">
                        OK
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('message-modal');
    const okBtn = document.getElementById('msg-modal-ok');
    const cancelBtn = document.getElementById('msg-modal-cancel');

    const close = () => {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    };

    okBtn.onclick = () => {
        if (onConfirm) onConfirm();
        close();
    };

    cancelBtn.onclick = close;
    modal.onclick = (e) => { if (e.target === modal) close(); };
}