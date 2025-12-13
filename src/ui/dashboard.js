// @miyter:20251129

import Chart from 'chart.js/auto';

// チャートインスタンス保持用
let dailyChartInstance = null;
let weeklyChartInstance = null;
let monthlyChartInstance = null;

/**
 * ダッシュボードのHTMLテンプレートを生成
 * Grokレビュー対応: グリッド化、重複タイトル削除、サマリー追加、コンパクト化
 */
export function getDashboardTemplate() {
    return `
        <div class="space-y-4 animate-fade-in p-1"> <!-- 余白削減: gap-6->4, p-4->1 -->
            
            <!-- 1. サマリーカード (新規追加: 上部配置) -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                ${createSummaryCard('today-count', '今日の完了', 'text-blue-600', 'bg-blue-50 dark:bg-blue-900/20')}
                ${createSummaryCard('weekly-count', '今週の完了', 'text-green-600', 'bg-green-50 dark:bg-green-900/20')}
                ${createSummaryCard('monthly-count', '今月の完了', 'text-purple-600', 'bg-purple-50 dark:bg-purple-900/20')}
                ${createSummaryCard('total-count', '全期間', 'text-gray-600', 'bg-gray-50 dark:bg-gray-800')}
            </div>

            <!-- 2. グラフエリア (Grid & 高さ統一 h-64) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 日次 -->
                <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700/50 h-64 flex flex-col">
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 日次推移 (直近4日)
                    </h3>
                    <div class="relative flex-1 min-h-0">
                        <canvas id="dailyChart"></canvas>
                    </div>
                </div>

                <!-- 週次 -->
                <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700/50 h-64 flex flex-col">
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> 週次推移
                    </h3>
                    <div class="relative flex-1 min-h-0">
                        <canvas id="weeklyChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- 3. 月次 (下部配置) -->
            <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700/50 h-64 flex flex-col">
                <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                     <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> 月次推移
                </h3>
                <div class="relative flex-1 min-h-0">
                    <canvas id="monthlyChart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function createSummaryCard(id, label, textColorClass, bgColorClass) {
    return `
        <div class="${bgColorClass} rounded-lg p-3 flex flex-col items-center justify-center shadow-sm border border-transparent dark:border-white/5 transition-transform hover:scale-[1.02]">
            <span class="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">${label}</span>
            <span id="${id}" class="text-2xl font-bold ${textColorClass} dark:text-white font-mono tracking-tight">-</span>
        </div>
    `;
}

/**
 * ダッシュボード描画実行
 * サマリー計算とグラフ描画を行う
 */
export function renderDashboard(tasks, projects) {
    if (!tasks || !Chart) return;

    // 完了済みかつ日時があるもの
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt);

    // 1. サマリー数値更新
    updateSummaryStats(completedTasks);

    // 2. グラフ描画
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

// --- グラフ描画関数群 (オプションをスマートに変更) ---

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
                barThickness: 20 // 細くスタイリッシュに
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