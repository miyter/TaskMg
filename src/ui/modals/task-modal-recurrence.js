/**
 * 繝｢繝ｼ繝繝ｫ蜀・・郢ｰ繧願ｿ斐＠險ｭ螳啅I蛻ｶ蠕｡
 */
import { getInitialDueDateFromRecurrence } from '../../utils/date';

/**
 * 郢ｰ繧願ｿ斐＠險ｭ螳壹・陦ｨ遉ｺ蛻・ｊ譖ｿ縺医→譌･莉倬｣蜍輔ｒ繧ｻ繝・ヨ繧｢繝・・
 */
export function setupRecurrenceControls() {
    const select = document.getElementById('modal-task-recurrence');
    const daysContainer = document.getElementById('recurrence-days-container');
    const dateInput = document.getElementById('modal-task-date');

    if (!select || !daysContainer || !dateInput) return;

    // 隕∫ｴ蜀・く繝｣繝・す繝･
    const daysCheckboxes = daysContainer.querySelectorAll('input[type="checkbox"]');

    const updateDate = (type, days = []) => {
        // 譖懈律縺檎ｩｺ縺ｮ騾ｱ谺｡縺ｮ蝣ｴ蜷医・譌･莉俶峩譁ｰ繧偵せ繧ｭ繝・・・医け繝ｪ繧｢縺ｯ縺帙★迴ｾ蝨ｨ縺ｮ蛟､繧堤ｶｭ謖・ｼ・
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

    // 譖懈律繝√ぉ繝・け繝懊ャ繧ｯ繧ｹ縺ｮ繧､繝吶Φ繝・
    daysCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const days = getCheckedDays();
            updateDate('weekly', days);
        });
    });
}
