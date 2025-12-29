/**
 * 繰り返し設定の制御ロジック
 * TypeScript化: 2025-12-29
 */
import { getInitialDueDateFromRecurrence } from '../../utils/date';
import { formatDateForInput } from './modal-helpers';

/**
 * 繰り返し設定のUI制御をセットアップ
 */
export function setupRecurrenceControls() {
    const recurrenceSelect = document.getElementById('modal-task-recurrence') as HTMLSelectElement;
    const daysContainer = document.getElementById('recurrence-days-container') as HTMLElement;
    const dateInput = document.getElementById('modal-task-date') as HTMLInputElement;

    if (!recurrenceSelect || !daysContainer || !dateInput) return;

    /**
     * チェックされた曜日インデックスを取得
     */
    const getCheckedDays = (): number[] => {
        const checkboxes = daysContainer.querySelectorAll<HTMLInputElement>('input[name="recurrence_days"]');
        return Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => parseInt(cb.value, 10));
    };

    /**
     * 日付を自動更新する
     */
    const updateDate = (type: string, days: number[]) => {
        // 'none' 以外で、かつ曜日指定が必要な場合は曜日未選択なら更新しない
        if (type === 'weekly' && days.length === 0) return;

        // @ts-ignore: Recurrence type matching
        const nextDate = getInitialDueDateFromRecurrence({ type, days });
        if (nextDate) {
            // 既存の日付が入っていても、繰り返しパターンが変わったら更新するのが親切設計
            // ただし、既に正当な未来の日付が入っている場合は維持するロジックも考えられるが、
            // ここではシンプルに「パターン変更＝日付再計算」とする
            dateInput.value = formatDateForInput(nextDate);
        }
    };

    // 繰り返しタイプ変更時のイベント
    recurrenceSelect.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement;
        const type = target.value;
        const isWeekly = type === 'weekly';

        // 曜日選択エリアの表示切り替え
        daysContainer.classList.toggle('hidden', !isWeekly);

        // 日付更新
        const days = isWeekly ? getCheckedDays() : [];
        if (type !== 'none') {
            updateDate(type, days);
        }
    });

    // 曜日チェックボックス変更時のイベント
    const daysCheckboxes = daysContainer.querySelectorAll<HTMLInputElement>('input[name="recurrence_days"]');
    daysCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const days = getCheckedDays();
            updateDate('weekly', days);
        });
    });
}
