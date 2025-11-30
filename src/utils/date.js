// @ts-nocheck
// @miyter:20251129

// ★修正: getTaskDateDateColor -> getTaskDateColor に修正 (task-list.js側での指摘対応)

/**
 * 日付を指定された形式でコンパクトにフォーマットする
 * @param {Date|null} date - 期限日
 * @returns {string} フォーマットされた日付文字列 ('M/D'形式、今日/明日表示、時間表示など)
 */
export function formatDateCompact(date) {
    if (!date) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 翌年以降なら年を表示
    if (year !== now.getFullYear()) {
        return `${year}/${month}/${day}`;
    }

    return `${month}/${day}`;
}

/**
 * 期限日に基づいて表示クラス（色）を決定する
 * @param {Date|null} date - 期限日
 * @returns {string} Tailwind CSSクラス
 */
export function getTaskDateColor(date) {
    if (!date) return 'text-gray-500';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 期限切れ (昨日以前)
    if (diffDays < 0) {
        return 'text-red-500 font-bold';
    }
    // 今日
    if (diffDays === 0) {
        return 'text-red-500 font-medium';
    }
    // 明日
    if (diffDays === 1) {
        return 'text-yellow-600 dark:text-yellow-400 font-medium';
    }
    // 未来
    return 'text-gray-500 dark:text-gray-400';
}

/**
 * 繰り返し設定に基づいて次回の期限日を計算する
 * @param {Date} currentDueDate - 現在の期限日
 * @param {object} recurrence - 繰り返し設定 { type: 'daily' | 'weekly' | 'monthly', days?: number[] }
 * @returns {Date|null} 次回の期限日
 */
export function getNextRecurrenceDate(currentDueDate, recurrence) {
    const nextDate = new Date(currentDueDate);
    
    if (recurrence.type === 'daily') {
        // 毎日: 1日加算
        nextDate.setDate(nextDate.getDate() + 1);
        return nextDate;
    } 
    
    if (recurrence.type === 'weekly' && Array.isArray(recurrence.days) && recurrence.days.length > 0) {
        // 毎週: 次の指定された曜日を探す (days: 0=日, 1=月, ..., 6=土)
        
        let found = false;
        let daysToAdd = 1;
        const currentDay = currentDueDate.getDay(); // 0-6

        // 最大7日間探す
        for (let i = 1; i <= 7; i++) {
            const nextDayIndex = (currentDay + i) % 7;
            if (recurrence.days.includes(nextDayIndex)) {
                daysToAdd = i;
                found = true;
                break;
            }
        }

        if (found) {
            nextDate.setDate(nextDate.getDate() + daysToAdd);
            return nextDate;
        }
    } 
    
    if (recurrence.type === 'monthly') {
        // 毎月: 1ヶ月加算
        // Dateオブジェクトは自動で月末処理を行う
        nextDate.setMonth(nextDate.getMonth() + 1);
        return nextDate;
    }
    
    // 設定が不明または無効な場合はnull
    return null;
}

// ★修正: exportキーワードを追加して、外部からアクセスできるようにする
/**
 * 繰り返し設定に基づいてタスクの初期期限日を決定する (今日の日付か、最短の曜日)
 * @param {object} recurrence - 繰り返し設定 { type: 'daily' | 'weekly' | 'monthly', days?: number[] }
 * @returns {Date} 初期期限日
 */
export function getInitialDueDateFromRecurrence(recurrence) {
    const today = new Date();
    // 時間をリセットして日付のみにする
    today.setHours(0, 0, 0, 0); 
    
    if (!recurrence || !recurrence.type) {
        return today; // デフォルトで今日を返す
    }

    if (recurrence.type === 'daily' || recurrence.type === 'monthly') {
        // 毎日、毎月の場合は、今日の日付を期限日とする
        return today;
    } 
    
    if (recurrence.type === 'weekly' && Array.isArray(recurrence.days) && recurrence.days.length > 0) {
        // 毎週の場合: 今日以降の最短の指定曜日を探す
        
        const currentDay = today.getDay(); // 0:日曜日, 1:月曜日, ..., 6:土曜日
        let daysToAdd = 0;
        let found = false;

        // まず今日の日付が指定されているか確認
        if (recurrence.days.includes(currentDay)) {
            daysToAdd = 0; // 今日
            found = true;
        } else {
            // 明日以降の最短の曜日を探す (最大6日間先)
            for (let i = 1; i <= 6; i++) {
                const nextDayIndex = (currentDay + i) % 7;
                if (recurrence.days.includes(nextDayIndex)) {
                    daysToAdd = i;
                    found = true;
                    break;
                }
            }
        }
        
        const initialDueDate = new Date(today);
        initialDueDate.setDate(today.getDate() + daysToAdd);
        return initialDueDate;
    }
    
    // その他の設定の場合は今日を返す
    return today;
}