/**
 * 言語設定のイベントハンドラ
 */
export function setupLanguageHandler() {
    const radios = document.querySelectorAll('input[name="ui_language"]');

    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                const lang = e.target.value;
                localStorage.setItem('ui_language', lang);

                // UI上の選択状態更新 (ラジオボタンなので自動だが、スタイル更新が必要)
                updateRadioStyles(radios);

                // 即時リロードで反映 (簡易実装)
                if (confirm('言語設定を変更しました。ページを再読み込みしますか？')) {
                    window.location.reload();
                }
            }
        });
    });
}

function updateRadioStyles(radios) {
    radios.forEach(radio => {
        const label = radio.closest('label');
        if (radio.checked) {
            label.classList.add('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30', 'ring-1', 'ring-blue-500');
            label.classList.remove('border-gray-200', 'dark:border-gray-700');
            label.querySelector('.grayscale')?.classList.remove('grayscale');
        } else {
            label.classList.remove('border-blue-500', 'bg-blue-50', 'dark:bg-blue-900/30', 'ring-1', 'ring-blue-500');
            label.classList.add('border-gray-200', 'dark:border-gray-700');
            label.querySelector('.text-2xl')?.classList.add('grayscale');
        }
    });
}
