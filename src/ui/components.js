// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: showMessageModalの引数正規化、デザイン改善、Escキー対応
 */

/**
 * 汎用メッセージモーダルを表示
 * * 使用例:
 * 1. シンプル: showMessageModal("完了しました")
 * 2. タイプ指定: showMessageModal("エラーです", "error")
 * 3. 確認: showMessageModal("削除しますか？", () => deleteFunc())
 * 4. 高度: showMessageModal({ title: "注目", message: "...", type: "warning" })
 * * @param {string|object} messageOrOptions - メッセージ文字列 または 設定オブジェクト
 * @param {Function|string} [arg2] - コールバック関数(confirm時) または タイプ文字列(互換用)
 */
export function showMessageModal(messageOrOptions, arg2 = null) {
    // 既存のモーダルがあれば削除
    document.getElementById('message-modal')?.remove();

    // 設定の正規化
    let config = {
        title: '',
        message: '',
        type: 'info', // info, success, error, confirm
        onConfirm: null,
        cancelText: 'キャンセル',
        okText: 'OK'
    };

    if (typeof messageOrOptions === 'object' && messageOrOptions !== null) {
        config = { ...config, ...messageOrOptions };
    } else {
        config.message = String(messageOrOptions);
        // 第2引数の型で挙動を分岐（後方互換性）
        if (typeof arg2 === 'function') {
            config.type = 'confirm';
            config.onConfirm = arg2;
        } else if (typeof arg2 === 'string') {
            config.type = arg2;
        }
    }

    // タイトルとボタン色の自動設定
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
                okBtnClass = 'bg-red-600 hover:bg-red-700'; // 破壊的操作を想定して赤
                break;
            default: 
                config.title = '通知';
                break;
        }
    }

    // キャンセルボタンが必要か
    const showCancel = config.type === 'confirm';
    if (!showCancel) config.okText = '閉じる';

    const modalHTML = `
        <div id="message-modal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in p-4" role="dialog" aria-modal="true">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-sm w-full transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
                <div class="mb-5">
                    <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                        ${config.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">${config.message}</p>
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

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('message-modal');
    const okBtn = document.getElementById('msg-modal-ok');
    const cancelBtn = document.getElementById('msg-modal-cancel');

    // クリーンアップ付きの閉じる処理
    const close = () => {
        document.removeEventListener('keydown', handleKeydown);
        modal.classList.add('opacity-0');
        setTimeout(() => modal.remove(), 200);
    };

    const handleKeydown = (e) => {
        if (e.key === 'Escape') close();
        if (e.key === 'Enter' && !showCancel) close(); // 情報モーダルはEnterで閉じる
    };

    document.addEventListener('keydown', handleKeydown);

    okBtn.onclick = () => {
        if (config.onConfirm) config.onConfirm();
        close();
    };

    if (cancelBtn) cancelBtn.onclick = close;
    
    // 背景クリックで閉じる（confirm以外は便利のため許可、confirmは誤操作防止のため慎重に）
    modal.onclick = (e) => { 
        if (e.target === modal) {
            if (!showCancel) close();
        }
    };
    
    // フォーカス管理
    okBtn.focus();
}