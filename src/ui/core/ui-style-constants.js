/**
 * UIの共通スタイル定数
 * 保守性向上のため、Tailwind CSSのクラス列を一元管理する
 */

export const UI_STYLES = {
    // ボタン関連
    BUTTON: {
        PRIMARY: 'bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1.5 px-4 rounded-lg transition-all active:scale-95 shadow-sm',
        DANGER: 'bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-1.5 rounded transition-colors shadow-sm',
        SECONDARY: 'text-sm font-medium text-gray-500 hover:text-gray-800 transition',
        CANCEL: 'text-xs text-gray-500 px-3 py-1.5 hover:text-gray-800 transition', // task-inputなどでのキャンセル用
        ICON: 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition'
    },

    // 入力フォーム関連
    INPUT: {
        // 標準的な枠付き入力
        DEFAULT: 'w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition',
        // 背景透明、枠なし（インライン入力用）
        TRANSPARENT: 'bg-transparent border-none outline-none',
        GLASSCARD_TITLE: 'bg-transparent text-lg font-medium placeholder-gray-400 text-gray-800 dark:text-white border-none outline-none focus:ring-0',
        MINIMAL_TEXT: 'w-full text-sm font-semibold bg-transparent border-none outline-none text-gray-800 dark:text-gray-100',
        MINIMAL_TEXTAREA: 'w-full text-xs bg-transparent border-none outline-none text-gray-600 dark:text-gray-300 resize-none'
    },

    // UIコンポーネント
    SELECT: {
        DEFAULT: 'bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-xs rounded-md py-1.5 px-2 cursor-pointer',
        TRANSPARENT: 'bg-transparent text-xs text-gray-500 border border-gray-200 dark:border-gray-600/50 rounded px-2 py-1 cursor-pointer'
    },

    // テキスト
    TEXT: {
        LABEL: 'block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wider',
        ERROR: 'text-red-500 text-xs mt-1'
    }
};
