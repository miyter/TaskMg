// @ts-nocheck
// @miyter:20251221
// モーダル内の繰り返し設定UI制御

import { getInitialDueDateFromRecurrence } from '../../utils/date.js';

/**
 * 繰り返し設定の表示切り替えと日付連動をセットアップ
 */
export function setupRecurrenceControls() {
    const select = document.getElementById('modal-task-recurrence');
    const daysContainer = document.getElementById('recurrence-days-container');
    const dateInput = document.getElementById('modal-task-date');

    if (!select || !daysContainer || !dateInput) return;

    const updateDate = (type, days = []) => {
        const newDate = getInitialDueDateFromRecurrence({ type, days });
        dateInput.value = newDate.toISOString().substring(0, 10);
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
    daysContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', () => {
            const days = getCheckedDays();
            if (days.length > 0) updateDate('weekly', days);
        });
    });
}

function getCheckedDays() {
    const container = document.getElementById('recurrence-days-container');
    return Array.from(container.querySelectorAll('input:checked'))
        .map(cb => parseInt(cb.dataset.dayIndex, 10));
}