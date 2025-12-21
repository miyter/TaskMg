/**
 * 更新日: 2025-12-21
 * 内容: weakMapによるインスタンス管理、update()による差分更新、日付ヘルパー外部化
 */
import Chart from 'chart.js/auto';
import { buildDashboardViewHTML } from './ui-dom-utils.js';
import * as DateUtils from '../utils/date.js';

const chartInstances = new WeakMap();

const CHART_CONFIG = {
    COLORS: { daily: '#3B82F6', weekly: '#10B981', monthly: '#8B5CF6' },
    DEFAULTS: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
    }
};

export function renderDashboard(tasks) {
    const view = document.getElementById('dashboard-view');
    if (!tasks || !view) return;

    view.innerHTML = buildDashboardViewHTML();
    const completed = tasks.filter(t => t.status === 'completed' && t.completedAt);
    
    updateSummaryStats(completed);
    
    const configs = [
        { id: 'daily', color: CHART_CONFIG.COLORS.daily, count: 7, unit: 'day' },
        { id: 'weekly', color: CHART_CONFIG.COLORS.weekly, count: 4, unit: 'week' },
        { id: 'monthly', color: CHART_CONFIG.COLORS.monthly, count: 6, unit: 'month' }
    ];

    configs.forEach(cfg => {
        const { labels, data } = processChartData(completed, cfg.count, cfg.unit);
        syncChart(cfg.id, labels, data, cfg.color);
    });
}

function updateSummaryStats(tasks) {
    const now = new Date();
    const today = DateUtils.getStartOfDay(now).getTime();
    const week = DateUtils.getStartOfWeek(now).getTime();
    const month = DateUtils.getStartOfMonth(now).getTime();

    const stats = tasks.reduce((acc, t) => {
        const d = DateUtils.toDate(t.completedAt);
        if (!d) return acc;
        const time = d.getTime();
        if (time >= today) acc.today++;
        if (time >= week) acc.weekly++;
        if (time >= month) acc.monthly++;
        return acc;
    }, { today: 0, weekly: 0, monthly: 0, total: tasks.length });

    Object.entries(stats).forEach(([k, v]) => {
        const el = document.getElementById(`${k}-count`);
        if (el) el.textContent = v;
    });
}

function processChartData(tasks, count, unit) {
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        let start, end, label;
        const target = new Date(now);
        
        if (unit === 'day') {
            target.setDate(now.getDate() - (count - 1 - i));
            start = DateUtils.getStartOfDay(target);
            end = DateUtils.getEndOfDay(target);
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else if (unit === 'week') {
            target.setDate(now.getDate() - ((count - 1 - i) * 7));
            start = DateUtils.getStartOfWeek(target);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else {
            start = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            label = `${start.getFullYear()}/${start.getMonth() + 1}`;
        }

        const bucket = tasks.filter(t => {
            const d = DateUtils.toDate(t.completedAt);
            return d && d >= start && d <= end;
        }).length;

        labels.push(label);
        data.push(bucket);
    }
    return { labels, data };
}

function syncChart(id, labels, data, color) {
    const canvas = document.getElementById(`${id}Chart`);
    if (!canvas) return;

    let chart = chartInstances.get(canvas);

    if (chart) {
        chart.data.labels = labels;
        chart.data.datasets[0].data = data;
        chart.update();
    } else {
        chart = new Chart(canvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels,
                datasets: [{ data, backgroundColor: color, borderRadius: 4 }]
            },
            options: CHART_CONFIG.DEFAULTS
        });
        chartInstances.set(canvas, chart);
    }
}