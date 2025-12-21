// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 日付処理のヘルパー化、ロジック整理、Chart設定の定数化
 */

import Chart from 'chart.js/auto';
import { buildDashboardViewHTML } from './ui-dom-utils.js';

// チャート設定定数
const CHART_COLORS = {
    daily: '#3B82F6',
    weekly: '#10B981',
    monthly: '#8B5CF6'
};

const instances = { daily: null, weekly: null, monthly: null };

/**
 * ダッシュボード全体の描画
 */
export function renderDashboard(tasks) {
    const view = document.getElementById('dashboard-view');
    if (!tasks || !view) return;

    cleanupCharts();

    view.innerHTML = buildDashboardViewHTML();

    // 完了日時が存在する完了タスクのみ抽出
    const completed = tasks.filter(t => t.status === 'completed' && t.completedAt);
    
    updateSummaryStats(completed);
    
    const chartConfigs = [
        { id: 'daily', color: CHART_COLORS.daily, label: '日次', count: 7, unit: 'day' },
        { id: 'weekly', color: CHART_COLORS.weekly, label: '週次', count: 4, unit: 'week' },
        { id: 'monthly', color: CHART_COLORS.monthly, label: '月次', count: 6, unit: 'month' }
    ];

    chartConfigs.forEach(cfg => {
        const { labels, data } = processChartData(completed, cfg.count, cfg.unit);
        renderGenericChart(cfg.id, labels, data, cfg.color);
    });
}

/**
 * チャートのリソース解放
 */
function cleanupCharts() {
    Object.keys(instances).forEach(key => {
        if (instances[key]) {
            instances[key].destroy();
            instances[key] = null;
        }
    });
}

// ==========================================
// Date Helpers (Internal)
// ==========================================

function toDate(val) {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === 'function') return val.toDate();
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

function getStartOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getEndOfDay(date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}

function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 月曜始まり
    const start = new Date(d.setDate(diff));
    return getStartOfDay(start);
}

function getStartOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

// ==========================================
// Stats & Data Processing
// ==========================================

/**
 * サマリー数値の更新
 */
function updateSummaryStats(tasks) {
    const now = new Date();
    const todayStart = getStartOfDay(now).getTime();
    const weekStart = getStartOfWeek(now).getTime();
    const monthStart = getStartOfMonth(now).getTime();

    const stats = tasks.reduce((acc, t) => {
        const dateObj = toDate(t.completedAt);
        if (!dateObj) return acc;

        const time = dateObj.getTime();
        
        if (time >= todayStart) acc.today++;
        if (time >= weekStart) acc.weekly++;
        if (time >= monthStart) acc.monthly++;
        return acc;
    }, { today: 0, weekly: 0, monthly: 0, total: tasks.length });

    Object.entries(stats).forEach(([key, val]) => {
        const el = document.getElementById(`${key}-count`);
        if (el) el.textContent = val;
    });
}

/**
 * 期間ごとの集計ロジック（過去 -> 未来の順序で生成）
 */
function processChartData(tasks, count, unit) {
    const labels = [];
    const data = [];
    const now = new Date();

    // 過去から現在へループ
    for (let i = count - 1; i >= 0; i--) {
        let start, end, label;
        const targetDate = new Date(now);
        
        if (unit === 'day') {
            targetDate.setDate(now.getDate() - i);
            start = getStartOfDay(targetDate);
            end = getEndOfDay(targetDate);
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else if (unit === 'week') {
            // 基準日から i週間前 にずらす
            targetDate.setDate(now.getDate() - (i * 7));
            start = getStartOfWeek(targetDate);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else {
            // 月次
            start = new Date(now.getFullYear(), now.getMonth() - i, 1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59, 999);
            label = `${start.getFullYear()}/${start.getMonth() + 1}`;
        }

        const bucketCount = tasks.filter(t => {
            const d = toDate(t.completedAt);
            return d && d >= start && d <= end;
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

    if (instances[id]) {
        instances[id].destroy();
        instances[id] = null;
    }

    instances[id] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: color,
                borderRadius: 4,
                barThickness: 'flex',
                maxBarThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { precision: 0 },
                    grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false } 
                },
                x: { 
                    grid: { display: false }, 
                    ticks: { font: { size: 10 }, color: '#9CA3AF' } 
                }
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