/**
 * モーダル内の繰り返し設定UI制御
 */
import { getInitialDueDateFromRecurrence } from '../../utils/date.js';

/**
 * 繰り返し設定の表示切り替えと日付連動をセットアップ
 */
export function setupRecurrenceControls() {
    const select = document.getElementById('modal-task-recurrence');
    const daysContainer = document.getElementById('recurrence-days-container');
    const dateInput = document.getElementById('modal-task-date');

    if (!select || !daysContainer || !dateInput) return;

    // 要素内キャッシュ
    const daysCheckboxes = daysContainer.querySelectorAll('input[type="checkbox"]');

    const updateDate = (type, days = []) => {
        // 曜日が空の週次の場合は日付更新をスキップ（クリアはせず現在の値を維持）
        if (type === 'weekly' && days.length === 0) return;

        const newDate = getInitialDueDateFromRecurrence({ type, days });
        dateInput.value = newDate.toISOString().substring(0, 10);
    };

    const getCheckedDays = () => {
        return Array.from(daysCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.dataset.dayIndex ?? '0', 10));
    };

    select.addEventListener('change', (e) => {
        const type = e.target.value;
        const isWeekly = type === 'weekly';

        daysContainer.classList.toggle('hidden', !isWeekly);

        if (type !== 'none') {
            const checkedDays = isWeekly ? getCheckedDays() : [];
            updateDate(type, checkedDays);
        }
    });

    // 曜日チェックボックスのイベント
    daysCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const days = getCheckedDays();
            updateDate('weekly', days);
        });
    });
}