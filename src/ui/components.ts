/**
 * 共通UIコンポーネント
 * TypeScript化: 2025-12-29
 */

interface MessageModalConfig {
    title?: string;
    message: string;
    type?: 'info' | 'error' | 'success' | 'confirm';
    onConfirm?: (() => void) | null;
    cancelText?: string;
    okText?: string;
}

/**
 * モーダルのHTML骨格を生成
 */
function buildModalSkeleton(config: MessageModalConfig, okBtnClass: string, showCancel: boolean): string {
    return `
        <div id="message-modal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4" role="dialog" aria-modal="true">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
                <div class="mb-5">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2" id="msg-modal-title"></h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed" id="msg-modal-body"></p>
                </div>
                <div class="flex justify-end space-x-3">
                    ${showCancel ? `
                    <button id="msg-modal-cancel" class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        ${config.cancelText}
                    </button>` : ''}
                    <button id="msg-modal-ok" class="px-4 py-2 text-sm font-bold text-white ${okBtnClass} rounded-lg shadow-md transition-transform active:scale-95">
                        ${config.okText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * 内部レンダリング処理
 */
function _renderMessageModal(config: MessageModalConfig): void {
    document.getElementById('message-modal')?.remove();

    let okBtnClass = 'bg-blue-600 hover:bg-blue-700';
    if (!config.title) {
        switch (config.type) {
            case 'error':
                config.title = 'エラー';
                okBtnClass = 'bg-red-600 hover:bg-red-700';
                break;
            case 'success':
                config.title = '成功';
                okBtnClass = 'bg-green-600 hover:bg-green-700';
                break;
            case 'confirm':
                config.title = '確認';
                okBtnClass = 'bg-red-600 hover:bg-red-700';
                break;
            default:
                config.title = '通知';
                break;
        }
    }

    const showCancel = config.type === 'confirm';
    if (!showCancel && config.okText === 'OK') config.okText = '閉じる';

    document.body.insertAdjacentHTML('beforeend', buildModalSkeleton(config, okBtnClass, showCancel));

    const modal = document.getElementById('message-modal') as HTMLElement;
    const titleEl = document.getElementById('msg-modal-title') as HTMLElement;
    const bodyEl = document.getElementById('msg-modal-body') as HTMLElement;
    const okBtn = document.getElementById('msg-modal-ok') as HTMLElement;
    const cancelBtn = document.getElementById('msg-modal-cancel');

    // 安全なテキスト挿入（XSS対策）
    titleEl.textContent = config.title || '';
    bodyEl.textContent = config.message;

    const close = () => {
        document.removeEventListener('keydown', handleKeydown);
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close();
        if (e.key === 'Enter' && !showCancel) close();
    };

    document.addEventListener('keydown', handleKeydown);

    okBtn.onclick = () => {
        if (config.onConfirm) config.onConfirm();
        close();
    };

    if (cancelBtn) cancelBtn.onclick = close;

    modal.onclick = (e: MouseEvent) => {
        if (e.target === modal && !showCancel) close();
    };

    okBtn.focus();
}

/**
 * 汎用メッセージモーダルを表示
 * インターフェースを正規化し、後方互換性を維持
 */
export function showMessageModal(messageOrOptions: string | Partial<MessageModalConfig>, arg2: string | (() => void) | null = null): void {
    let config: MessageModalConfig = {
        title: '',
        message: '',
        type: 'info',
        onConfirm: null,
        cancelText: 'キャンセル',
        okText: 'OK'
    };

    if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
        config = { ...config, ...messageOrOptions };
    } else {
        config.message = String(messageOrOptions);
        if (typeof arg2 === 'function') {
            config.type = 'confirm';
            config.onConfirm = arg2;
        } else if (typeof arg2 === 'string') {
            // @ts-ignore
            config.type = arg2;
        }
    }

    _renderMessageModal(config);
}
