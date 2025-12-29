/**
 * 言語設定のHTMLコンテンツを生成
 */
export function getLanguageContent(currentLang = 'ja') {
    const languages = [
        { id: 'ja', label: '日本語', flag: '🇯🇵' },
        { id: 'en', label: 'English', flag: '🇺🇸' }
    ];

    const optionsHtml = languages.map(lang => {
        const isChecked = lang.id === currentLang ? 'checked' : '';
        const activeClass = lang.id === currentLang ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600';

        return `
            <label class="relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${activeClass} group">
                <input type="radio" name="ui_language" value="${lang.id}" class="sr-only" ${isChecked}>
                <span class="text-2xl mr-3 filter grayscale group-hover:grayscale-0 transition-all ${lang.id === currentLang ? 'grayscale-0' : ''}">${lang.flag}</span>
                <span class="font-bold text-gray-700 dark:text-gray-300">${lang.label}</span>
                ${lang.id === currentLang ? '<span class="absolute right-4 text-blue-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></span>' : ''}
            </label>
        `;
    }).join('');

    return `
        <div class="space-y-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">ユーザーインターフェースの表示言語を選択します。</p>
            <div class="grid grid-cols-1 gap-3">
                ${optionsHtml}
            </div>
            <p class="text-xs text-amber-600 dark:text-amber-500 flex items-center mt-2">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                変更を反映するにはページのリロードが必要です。
            </p>
        </div>
    `;
}
