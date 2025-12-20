// @ts-nocheck
// @miyter:20251221
// ダッシュボードの統計描画（Chart.js）

import Chart from 'chart.js/auto';
import { buildDashboardViewHTML } from './ui-dom-utils.js';

// チャートインスタンスの管理
const instances = { daily: null, weekly: null, monthly: null };

/**
 * ダッシュボード全体の描画
 */
export function renderDashboard(tasks) {
    const view = document.getElementById('dashboard-view');
    if (!tasks || !view) return;

    view.innerHTML = buildDashboardViewHTML();

    const completed = tasks.filter(t => t.status === 'completed' && t.completedAt);
    
    updateSummaryStats(completed);
    
    // グラフ描画の設定
    const config = [
        { id: 'daily', color: '#3B82F6', label: '日次', count: 4, unit: 'day' },
        { id: 'weekly', color: '#10B981', label: '週次', count: 4, unit: 'week' },
        { id: 'monthly', color: '#8B5CF6', label: '月次', count: 4, unit: 'month' }
    ];

    config.forEach(cfg => {
        const { labels, data } = processChartData(completed, cfg.count, cfg.unit);
        renderGenericChart(cfg.id, labels, data, cfg.color);
    });
}

/**
 * サマリー数値の更新
 */
function updateSummaryStats(tasks) {
    const now = new Date();
    const getStart = (d) => new Date(d).setHours(0,0,0,0);
    
    const today = getStart(now);
    const sunday = getStart(new Date(now).setDate(now.getDate() - now.getDay()));
    const month = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    const stats = tasks.reduce((acc, t) => {
        const d = (t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt)).getTime();
        if (d >= today) acc.today++;
        if (d >= sunday) acc.weekly++;
        if (d >= month) acc.monthly++;
        return acc;
    }, { today: 0, weekly: 0, monthly: 0, total: tasks.length });

    Object.entries(stats).forEach(([key, val]) => {
        const el = document.getElementById(`${key}-count`);
        if (el) el.textContent = val;
    });
}

/**
 * 期間ごとの集計ロジック
 */
function processChartData(tasks, count, unit) {
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
        let start, end, label;
        
        if (unit === 'day') {
            start = new Date(now);
            start.setDate(now.getDate() - i);
            start.setHours(0,0,0,0);
            end = new Date(start);
            end.setHours(23,59,59,999);
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else if (unit === 'week') {
            const sun = new Date(now);
            sun.setDate(now.getDate() - now.getDay() - (i * 7));
            start = new Date(sun);
            start.setHours(0,0,0,0);
            end = new Date(start);
            end.setDate(end.getDate() + 6);
            end.setHours(23,59,59,999);
            label = `${start.getMonth() + 1}/${start.getDate()}~`;
        } else {
            start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
            label = `${start.getFullYear()}/${start.getMonth() + 1}`;
        }

        const bucketCount = tasks.filter(t => {
            const d = t.completedAt.toDate ? t.completedAt.toDate() : new Date(t.completedAt);
            return d >= start && d <= end;
        }).length;

        labels.push(label);
        data.push(bucketCount);
    }
    return { labels, data };
}

/**
 * Chart.js インスタンス生成
 */
function renderGenericChart(id, labels, data, color) {
    const canvas = document.getElementById(`${id}Chart`);
    if (!canvas) return;

    if (instances[id]) instances[id].destroy();

    instances[id] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: color,
                borderRadius: 4,
                barThickness: id === 'monthly' ? 30 : 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, ticks: { display: false }, grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false } },
                x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9CA3AF' } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#111827',
                    padding: 8,
                    displayColors: false,
                    callbacks: { label: (item) => `${item.raw} 件` }
                }
            }
        }
    });
}