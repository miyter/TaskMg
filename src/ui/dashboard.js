// @miyter:20251125
// Vite導入に伴い、Chart.jsをnpmパッケージからインポートするように修正
// --- ダッシュボード制御 (完全版) ---

// --- 修正: Chart.jsをnpmパッケージからインポート ---
import Chart from 'chart.js/auto';

// --- 修正: プロジェクト名解決のために sidebar からインポート ---
import { getProjectName } from "./sidebar.js";

let statusChartInstance = null;
let projectChartInstance = null;

// 名前を updateDashboard に変更（元のコードに倣う）
export function renderDashboard(tasks, projects) {
    if (!tasks || !Chart) return;
    
    // 現在時刻
    const now = new Date();
    
    // KPI計算
    const totalTodo = tasks.filter(t => t.status === 'todo').length;
    const totalDone = tasks.filter(t => t.status === 'completed').length;
    
    // 期限切れ
    const overdue = tasks.filter(t => {
        if (t.status === 'completed' || !t.dueDate) return false;
        // Firestore Timestamp or Dateオブジェクトを扱う
        const due = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
        // 日付のみ比較
        due.setHours(0, 0, 0, 0);
        now.setHours(0, 0, 0, 0);
        return due < now;
    }).length;
    
    // 今週の予定 (今日から7日後まで)
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999); // 7日後の終わりまで
    
    const upcoming = tasks.filter(t => {
        if (t.status === 'completed' || !t.dueDate) return false;
        const due = t.dueDate.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
        
        // 期限が現在から7日以内であるタスクをカウント
        return due >= now && due <= nextWeek;
    }).length;

    // KPI表示更新
    document.getElementById('kpi-todo').textContent = totalTodo;
    document.getElementById('kpi-done').textContent = totalDone;
    document.getElementById('kpi-overdue').textContent = overdue;
    document.getElementById('kpi-upcoming').textContent = upcoming;

    renderStatusChart(totalTodo, totalDone);
    renderProjectChart(tasks, projects);
}

function renderStatusChart(todo, done) {
    const ctx = document.getElementById('statusChart')?.getContext('2d');
    if (!ctx) return;
    
    if (statusChartInstance) statusChartInstance.destroy();
    
    statusChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['未完了', '完了'],
            datasets: [{
                data: [todo, done],
                backgroundColor: ['#3B82F6', '#10B981'], 
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

function renderProjectChart(tasks, allProjects) {
    const ctx = document.getElementById('projectChart')?.getContext('2d');
    if (!ctx) return;

    const counts = {};
    
    // 未完了タスクのみをカウント
    tasks.filter(t => t.status === 'todo').forEach(t => {
        // プロジェクト名を取得（getProjectNameはsidebar.jsに依存）
        const projectName = t.projectId ? getProjectName(t.projectId, allProjects) : 'インボックス';
        const label = projectName || '未分類';
        counts[label] = (counts[label] || 0) + 1;
    });
    
    const labels = Object.keys(counts);
    const data = Object.values(counts);

    if (projectChartInstance) projectChartInstance.destroy();
    
    projectChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '未完了タスク数',
                data: data,
                backgroundColor: '#8B5CF6', 
                borderRadius: 4
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            scales: { 
                y: { 
                    beginAtZero: true, 
                    ticks: { stepSize: 1 } 
                } 
            }, 
            plugins: { 
                legend: { display: false } 
            } 
        }
    });
}