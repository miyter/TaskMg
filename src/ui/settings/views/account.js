export function getAccountContent(userInitial, userEmail) {
    const safeInitial = userInitial || '?';

    return `
         <div class="flex items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-700">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                ${safeInitial}
            </div>
            <div>
                <div class="text-sm font-bold text-gray-900 dark:text-white">ログイン中</div>
                <div class="text-xs text-gray-500 font-mono">${userEmail || ''}</div>
            </div>
        </div>
        <div class="space-y-3">
            <div class="flex gap-2">
                <input type="password" id="new-password-input-new" placeholder="新しいパスワード" class="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-shadow">
                <button id="update-password-btn-new" class="px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap">変更</button>
            </div>
            <button id="logout-btn-settings" class="w-full py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors text-left flex items-center gap-2 px-2">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                ログアウト
            </button>
        </div>
    `;
}
