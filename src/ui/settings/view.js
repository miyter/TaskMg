// @ts-nocheck
// 設定モーダルのUIコンポーネント

export function getSettingsModalHTML(userInitial, userEmail, isCompact) {
    return `
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-black/5 flex flex-col max-h-[90vh]">
            
            <!-- ヘッダー -->
            <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-700/50 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    設定
                </h3>
                <button id="close-settings-modal" class="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <!-- ボディ -->
            <div class="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
                
                <!-- 1. 表示設定セクション (アコーディオン) -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            表示設定
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    
                    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                        <!-- テーマ設定 -->
                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">テーマ</label>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="app-theme" value="light" class="form-radio text-blue-600 focus:ring-blue-500">
                                    <div class="ml-3 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">ライト</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="app-theme" value="dark" class="form-radio text-blue-600 focus:ring-blue-500">
                                    <div class="ml-3 flex items-center gap-2">
                                        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">ダーク</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- サイドバー密度 -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">サイドバーの密度</label>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="sidebar-density" value="normal" class="form-radio text-blue-600 focus:ring-blue-500" ${!isCompact ? 'checked' : ''}>
                                    <div class="ml-3">
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">通常</span>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400">標準的な行間です</span>
                                    </div>
                                </label>
                                <label class="flex items-center cursor-pointer p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex-1">
                                    <input type="radio" name="sidebar-density" value="compact" class="form-radio text-blue-600 focus:ring-blue-500" ${isCompact ? 'checked' : ''}>
                                    <div class="ml-3">
                                        <span class="block text-sm font-medium text-gray-900 dark:text-white">コンパクト</span>
                                        <span class="block text-xs text-gray-500 dark:text-gray-400">行間を狭くして多く表示します</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </details>

                <!-- 2. データ管理セクション (アコーディオン) -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            データ管理
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                        <div class="space-y-3">
                            <button id="export-data-btn-new" class="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex justify-between items-center group border border-gray-100 dark:border-gray-700">
                                <div>
                                    <div class="text-sm font-medium text-gray-800 dark:text-gray-200">バックアップを作成 (JSON)</div>
                                    <div class="text-xs text-gray-500">現在のタスク、プロジェクト、ラベル等のデータをダウンロードします</div>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            </button>
                        </div>
                    </div>
                </details>

                <!-- 3. アカウント設定セクション (アコーディオン) -->
                <details class="group border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden transition-all">
                    <summary class="flex justify-between items-center px-4 py-3 cursor-pointer bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors select-none">
                        <h4 class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            アカウント
                        </h4>
                        <span class="transform group-open:rotate-180 transition-transform duration-200 text-gray-400">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </span>
                    </summary>
                    
                    <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                        <div class="flex items-center gap-4 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-200 font-bold text-xl shadow-sm">
                                ${userInitial}
                            </div>
                            <div>
                                <div class="text-sm font-bold text-gray-900 dark:text-white">ログイン中</div>
                                <div class="text-xs text-gray-600 dark:text-gray-300 font-mono">${userEmail}</div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">パスワードの変更</label>
                            <div class="flex gap-2">
                                <input type="password" id="new-password-input-new" placeholder="新しいパスワード (6文字以上)" class="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                                <button id="update-password-btn-new" class="px-4 py-2 bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap">
                                    変更
                                </button>
                            </div>
                            <p class="text-xs text-gray-500">※ セキュリティのため、再ログインが必要になる場合があります。</p>
                        </div>

                        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <button id="logout-btn-settings" class="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-800 transition-colors flex items-center justify-center gap-2 group">
                                <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                ログアウト
                            </button>
                        </div>
                    </div>
                </details>

            </div>

            <!-- フッター -->
            <div class="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                <button id="close-settings-footer" class="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-bold text-sm transition-all shadow-sm">
                    閉じる
                </button>
            </div>
        </div>
    `;
}