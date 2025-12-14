// @ts-nocheck
import Chart from 'chart.js/auto';
import { buildDashboardViewHTML } from './ui-dom-utils.js';

// チャートインスタンス保持用
let dailyChartInstance = null;
let weeklyChartInstance = null;
let monthlyChartInstance = null;

/**
 * ダッシュボード描画実行
 * 共通DOM生成関数を利用してGlassmorphism化
 */
export function renderDashboard(tasks, projects) {
    const dashboardView = document.getElementById('dashboard-view');
    if (!tasks || !Chart || !dashboardView) return;

    // 1. HTML構造を注入 (Glassmorphism適用済み)
    dashboardView.innerHTML = buildDashboardViewHTML();

    // 2. データ集計
    // 完了済みかつ日時があるもの
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt);

    // 3. サマリー数値更新
    updateSummaryStats(completedTasks);

    // 4. グラフ描画
    renderDailyChart(completedTasks);
    renderWeeklyChart(completedTasks);
    renderMonthlyChart(completedTasks);
}

function updateSummaryStats(tasks) {
    const now = new Date();
    
    // 今日の0時
    const todayStart = new Date(now);
    todayStart.setHours(0,0,0,0);

    // 今週の日曜0時
    const sundayStart = new Date(now);
    sundayStart.setDate(now.getDate() - now.getDay());
    sundayStart.setHours(0,0,0,0);

    // 今月の1日0時
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const counts = {
        today: 0,
        weekly: 0,
        monthly: 0,
        total: tasks.length
    };

    tasks.forEach(t => {
        const d = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
        if (d >= todayStart) counts.today++;
        if (d >= sundayStart) counts.weekly++;
        if (d >= monthStart) counts.monthly++;
    });

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    setVal('today-count', counts.today);
    setVal('weekly-count', counts.weekly);
    setVal('monthly-count', counts.monthly);
    setVal('total-count', counts.total);
}

// --- グラフ描画関数群 ---

function getChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    display: false, // 目盛り数値非表示（すっきりさせる）
                    stepSize: 1
                },
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                    drawBorder: false // 軸線なし
                },
                border: { display: false }
            },
            x: {
                ticks: {
                    color: '#9CA3AF',
                    font: { size: 10 }
                },
                grid: { display: false }
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 8,
                cornerRadius: 4,
                displayColors: false,
                callbacks: {
                    title: (items) => items[0].label,
                    label: (item) => `${item.raw} 件`
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        }
    };
}

// --- 1. 日次グラフ ---
function renderDailyChart(tasks) {
    const ctx = document.getElementById('dailyChart')?.getContext('2d');
    if (!ctx) return;
    if (dailyChartInstance) dailyChartInstance.destroy();

    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        d.setHours(0, 0, 0, 0);
        const dEnd = new Date(d);
        dEnd.setHours(23, 59, 59, 999);

        labels.push(`${d.getMonth() + 1}/${d.getDate()}`);
        const count = tasks.filter(t => {
            const cDate = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return cDate >= d && cDate <= dEnd;
        }).length;
        data.push(count);
    }

    dailyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: '#3B82F6',
                borderRadius: 4,
                barThickness: 20
            }]
        },
        options: getChartOptions()
    });
}

// --- 2. 週次グラフ ---
function renderWeeklyChart(tasks) {
    const ctx = document.getElementById('weeklyChart')?.getContext('2d');
    if (!ctx) return;
    if (weeklyChartInstance) weeklyChartInstance.destroy();

    const labels = [];
    const data = [];
    const now = new Date();
    const currentSunday = new Date(now);
    currentSunday.setDate(now.getDate() - now.getDay());
    currentSunday.setHours(0, 0, 0, 0);

    for (let i = 3; i >= 0; i--) {
        const start = new Date(currentSunday);
        start.setDate(start.getDate() - (i * 7));
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        labels.push(`${start.getMonth() + 1}/${start.getDate()}~`);
        const count = tasks.filter(t => {
            const cDate = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return cDate >= start && cDate <= end;
        }).length;
        data.push(count);
    }

    weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: '#10B981',
                borderRadius: 4,
                barThickness: 20
            }]
        },
        options: getChartOptions()
    });
}

// --- 3. 月次グラフ ---
function renderMonthlyChart(tasks) {
    const ctx = document.getElementById('monthlyChart')?.getContext('2d');
    if (!ctx) return;
    if (monthlyChartInstance) monthlyChartInstance.destroy();

    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const start = new Date(d);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);

        labels.push(`${start.getFullYear()}/${start.getMonth() + 1}`);
        const count = tasks.filter(t => {
            const cDate = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return cDate >= start && cDate <= end;
        }).length;
        data.push(count);
    }

    monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: '#8B5CF6',
                borderRadius: 4,
                barThickness: 30
            }]
        },
        options: getChartOptions()
    });
}