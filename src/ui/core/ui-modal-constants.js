/**
 * モーダル関連の共通定数クラス
 */
export const MODAL_CLASSES = {
    // オーバーレイ・コンテナ
    CONTAINER: 'fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in',

    // ダイアログ本体（幅は別途指定可能）
    DIALOG: 'bg-white dark:bg-gray-800 w-full rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all',

    // 幅のバリエーション（基本はDEFAULTを使用）
    WIDTH: {
        DEFAULT: 'max-w-4xl', // タスク編集モーダルと統一
        LARGE: 'max-w-6xl',
        SMALL: 'max-w-xl'
    },

    // 内部セクション
    HEADER: 'px-modal py-modal border-b border-gray-100 dark:border-gray-700 flex justify-between items-center',
    BODY: 'p-modal overflow-y-auto flex-1 min-h-0 custom-scrollbar',
    FOOTER: 'px-modal py-modal bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center gap-modal border-t border-gray-100 dark:border-gray-700',

    // 共通パーツ
    TITLE: 'text-lg font-bold text-gray-800 dark:text-white',
    CLOSE_BUTTON: 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700',
    CHECKBOX: 'appearance-none w-4 h-4 border-2 border-gray-400 dark:border-gray-500 rounded cursor-pointer relative checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-all'
};
