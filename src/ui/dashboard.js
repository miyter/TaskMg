// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 日付処理の堅牢化、グラフロジックの修正（過去→未来順序）、リソース破棄の徹底
 */

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

    // 前回のインスタンスを確実に破棄
    cleanupCharts();

    view.innerHTML = buildDashboardViewHTML();

    // 完了日時が存在する完了タスクのみ抽出
    const completed = tasks.filter(t => t.status === 'completed' && t.completedAt);
    
    updateSummaryStats(completed);
    
    // グラフ描画の設定
    const config = [
        { id: 'daily', color: '#3B82F6', label: '日次', count: 7, unit: 'day' }, // 直近7日
        { id: 'weekly', color: '#10B981', label: '週次', count: 4, unit: 'week' },
        { id: 'monthly', color: '#8B5CF6', label: '月次', count: 6, unit: 'month' }
    ];

    config.forEach(cfg => {
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

/**
 * 安全なDateオブジェクト変換
 */
function toDate(val) {
    if (!val) return null;
    if (val.toDate && typeof val.toDate === 'function') return val.toDate(); // Firestore Timestamp
    if (val instanceof Date) return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
}

/**
 * サマリー数値の更新
 */
function updateSummaryStats(tasks) {
    const now = new Date();
    const getStart = (d) => new Date(d).setHours(0,0,0,0);
    
    const todayStart = getStart(now);
    
    // 週の始まりを計算（月曜始まり）
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // 月曜
    const weekStart = getStart(new Date(now).setDate(diff));
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

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
            start = new Date(targetDate.setHours(0,0,0,0));
            end = new Date(targetDate.setHours(23,59,59,999));
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else if (unit === 'week') {
            // 月曜始まりで計算
            const day = targetDate.getDay();
            const diff = targetDate.getDate() - day + (day === 0 ? -6 : 1) - (i * 7);
            start = new Date(targetDate.setDate(diff));
            start.setHours(0,0,0,0);
            
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23,59,59,999);
            
            label = `${start.getMonth() + 1}/${start.getDate()}`;
        } else {
            // 月次
            start = new Date(targetDate.getFullYear(), targetDate.getMonth() - i, 1);
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

    // cleanupChartsで破棄済みだが、念のため二重チェック
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
                barThickness: 'flex', // レスポンシブ対応
                maxBarThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { 
                    beginAtZero: true, 
                    ticks: { precision: 0 }, // 整数のみ
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