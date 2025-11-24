// --- ダッシュボードUI制御モジュール (新規作成) ---
// 役割: タスクデータを集計し、Chart.jsを使ってグラフを描画する

import { getProjectName } from "./ui-sidebar.js";

let statusChartInstance = null;
let projectChartInstance = null;

// ダッシュボードの数値とグラフを更新
export function updateDashboard(tasks) {
    if (!tasks) return;

    // --- 1. KPI集計 ---
    const totalTodo = tasks.filter(t => t.status === 'todo').length;
    const totalDone = tasks.filter(t => t.status === 'completed').length;
    
    // 期限切れ計算
    const now = new Date();
    const overdue = tasks.filter(t => {
        if (t.status === 'completed' || !t.dueDate) return false;
        const due = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
        return due < now;
    }).length;

    // 今週の予定計算 (今日〜7日後)
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const upcoming = tasks.filter(t => {
        if (t.status === 'completed' || !t.dueDate) return false;
        const due = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
        return due >= now && due <= nextWeek;
    }).length;

    // UI反映
    document.getElementById('kpi-todo').textContent = totalTodo;
    document.getElementById('kpi-done').textContent = totalDone;
    document.getElementById('kpi-overdue').textContent = overdue;
    document.getElementById('kpi-upcoming').textContent = upcoming;

    // --- 2. グラフ描画 ---
    renderStatusChart(totalTodo, totalDone);
    renderProjectChart(tasks);
}

// 円グラフ: ステータス割合
function renderStatusChart(todo, done) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    if (statusChartInstance) {
        statusChartInstance.destroy(); // 古いグラフを破棄
    }

    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['未完了', '完了'],
            datasets: [{
                data: [todo, done],
                backgroundColor: ['#3B82F6', '#10B981'], // Tailwind Blue-500, Green-500
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

// 棒グラフ: プロジェクト別 未完了タスク数
function renderProjectChart(tasks) {
    const ctx = document.getElementById('projectChart').getContext('2d');

    // 集計: プロジェクトIDごとにTodo数をカウント
    const counts = {};
    tasks.filter(t => t.status === 'todo').forEach(t => {
        // プロジェクト名を取得 (IDがnullならInbox)
        const pid = t.projectId || 'inbox';
        const pname = t.projectId ? getProjectName(t.projectId) : 'インボックス';
        
        // プロジェクト名が取得できない場合（削除済みなど）のガード
        const label = pname || '未分類';
        
        counts[label] = (counts[label] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    if (projectChartInstance) {
        projectChartInstance.destroy();
    }

    projectChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '未完了タスク数',
                data: data,
                backgroundColor: '#8B5CF6', // Tailwind Purple-500
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1 } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}