// @miyter:20251129

// Chart.jsをnpmパッケージからインポート
import Chart from 'chart.js/auto';

// チャートインスタンス保持用
let dailyChartInstance = null;
let weeklyChartInstance = null;
let monthlyChartInstance = null;

// 名前を updateDashboard に変更（元のコードに倣う）
export function renderDashboard(tasks, projects) {
    if (!tasks || !Chart) return;
    
    // 完了済みタスクのみ対象にする
    // ★完了日時(completedAt)がない場合、便宜上updatedAtを使うか、なければ現在日時等のフォールバックが必要だが
    // 今回は簡易的に「完了ステータス」のものをカウント対象とする。
    // ※ 正確な時系列グラフを作るには「いつ完了したか」の情報が必須。
    //   Firestoreデータに completedAt がある前提で進める。
    //   もし completedAt がないデータはグラフに反映できないため注意。
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt);

    renderDailyChart(completedTasks);
    renderWeeklyChart(completedTasks);
    renderMonthlyChart(completedTasks);
}

// --- 1. 日次グラフ (直近4日) ---
function renderDailyChart(tasks) {
    const ctx = document.getElementById('dailyChart')?.getContext('2d');
    if (!ctx) return;

    if (dailyChartInstance) dailyChartInstance.destroy();

    const labels = [];
    const data = [];
    const now = new Date();

    // 直近4日分 (今日含む)
    for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0); // その日の0時

        const dEnd = new Date(d);
        dEnd.setHours(23, 59, 59, 999); // その日の終わり

        // ラベル (例: 12/01)
        const label = `${d.getMonth() + 1}/${d.getDate()}`;
        labels.push(label);

        // カウント
        const count = tasks.filter(t => {
            const cDate = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return cDate >= d && cDate <= dEnd;
        }).length;
        data.push(count);
    }

    dailyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '完了タスク数',
                data: data,
                backgroundColor: '#3B82F6', // Blue
                borderRadius: 4
            }]
        },
        options: getChartOptions()
    });
}

// --- 2. 週次グラフ (直近4週間 - 日曜始まり) ---
function renderWeeklyChart(tasks) {
    const ctx = document.getElementById('weeklyChart')?.getContext('2d');
    if (!ctx) return;

    if (weeklyChartInstance) weeklyChartInstance.destroy();

    const labels = [];
    const data = [];
    
    // 今週の日曜日を特定
    const now = new Date();
    const currentSunday = new Date(now);
    currentSunday.setDate(now.getDate() - now.getDay()); // 今週の日曜
    currentSunday.setHours(0, 0, 0, 0);

    // 直近4週間分 (今週含む)
    for (let i = 3; i >= 0; i--) {
        const start = new Date(currentSunday);
        start.setDate(start.getDate() - (i * 7)); // i週間前の日曜
        
        const end = new Date(start);
        end.setDate(end.getDate() + 6); // その週の土曜
        end.setHours(23, 59, 59, 999);

        // ラベル (例: 11/26~)
        const label = `${start.getMonth() + 1}/${start.getDate()}~`;
        labels.push(label);

        // カウント
        const count = tasks.filter(t => {
            const cDate = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return cDate >= start && cDate <= end;
        }).length;
        data.push(count);
    }

    weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '完了タスク数',
                data: data,
                backgroundColor: '#10B981', // Green
                borderRadius: 4
            }]
        },
        options: getChartOptions()
    });
}

// --- 3. 月次グラフ (直近4ヶ月) ---
function renderMonthlyChart(tasks) {
    const ctx = document.getElementById('monthlyChart')?.getContext('2d');
    if (!ctx) return;

    if (monthlyChartInstance) monthlyChartInstance.destroy();

    const labels = [];
    const data = [];
    const now = new Date();

    // 直近4ヶ月 (今月含む)
    for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1); // 月初
        const start = new Date(d);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0); // 月末
        end.setHours(23, 59, 59, 999);

        // ラベル (例: 2025/11)
        const label = `${start.getFullYear()}/${start.getMonth() + 1}`;
        labels.push(label);

        // カウント
        const count = tasks.filter(t => {
            const cDate = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return cDate >= start && cDate <= end;
        }).length;
        data.push(count);
    }

    monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '完了タスク数',
                data: data,
                backgroundColor: '#8B5CF6', // Purple
                borderRadius: 4
            }]
        },
        options: getChartOptions()
    });
}

// 共通オプション
function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // 整数のみ
                    color: '#9CA3AF' // text-gray-400
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)' // 薄いグリッド
                }
            },
            x: {
                ticks: {
                    color: '#9CA3AF'
                },
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false // 凡例非表示（タイトルでわかるため）
            }
        }
    };
}