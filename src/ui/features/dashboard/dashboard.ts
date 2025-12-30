import Chart from 'chart.js/auto';
import { Task } from '../../../store/schema';
import * as DateUtils from '../../../utils/date';
import { buildDashboardViewHTML } from '../../ui-dom-utils';
import { DASHBOARD_CONFIG } from './dashboard-constants';

// チャートインスタンスの管理（メモリリーク防止）
const chartInstances = new WeakMap<HTMLCanvasElement, Chart>();

/**
 * ダッシュボード描画実行
 */
export function renderDashboard(tasks: Task[]): void {
    const view = document.getElementById('dashboard-view');
    if (!tasks || !view) return;

    // 基本構造の構築
    view.innerHTML = buildDashboardViewHTML();

    const completed = tasks.filter(t => t.status === 'completed' && t.completedAt);
    updateSummaryStats(completed);

    const configs = [
        { id: 'daily', color: DASHBOARD_CONFIG.COLORS.daily, count: 7, unit: 'day' },
        { id: 'weekly', color: DASHBOARD_CONFIG.COLORS.weekly, count: 4, unit: 'week' },
        { id: 'monthly', color: DASHBOARD_CONFIG.COLORS.monthly, count: 6, unit: 'month' }
    ];

    configs.forEach(cfg => {
        const { labels, data } = processChartData(completed, cfg.count, cfg.unit as 'day' | 'week' | 'month');
        syncChart(cfg.id, labels, data, cfg.color);
    });
}

function updateSummaryStats(tasks: Task[]): void {
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
        if (el) el.textContent = String(v);
    });
}

function processChartData(tasks: Task[], count: number, unit: 'day' | 'week' | 'month'): { labels: string[], data: number[] } {
    const labels: string[] = [];
    const data: number[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
        let start: Date, end: Date, label: string;
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
            // Monthly
            start = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
            end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
            label = `${start.getFullYear()}/${start.getMonth() + 1}`;
        }

        const bucketCount = tasks.filter(t => {
            const d = DateUtils.toDate(t.completedAt);
            return d && d >= start && d <= end;
        }).length;

        labels.push(label);
        data.push(bucketCount);
    }

    return { labels, data };
}

function syncChart(id: string, labels: string[], data: number[], color: string): void {
    const canvas = document.getElementById(`${id}Chart`) as HTMLCanvasElement;
    if (!canvas) return;

    let chart = chartInstances.get(canvas);

    if (chart) {
        // 差分更新
        if (chart.data.datasets.length > 0) {
            chart.data.labels = labels;
            chart.data.datasets[0].data = data;
            chart.update();
        }
    } else {
        // 新規生成
        chart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: color,
                    borderRadius: 4
                }]
            },
            options: DASHBOARD_CONFIG.CHART_DEFAULTS as any // ChartJS types compatibility
        });
        chartInstances.set(canvas, chart);
    }
}
