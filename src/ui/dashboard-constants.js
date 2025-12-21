/**
 * 更新日: 2025-12-21
 * 内容: ダッシュボードのKPI、チャート設定の集約
 */
export const DASHBOARD_CONFIG = {
    KPI_ITEMS: [
        { id: 'today-count', label: '今日の完了', color: 'text-blue-600' },
        { id: 'weekly-count', label: '今週の完了', color: 'text-green-600' },
        { id: 'monthly-count', label: '今月の完了', color: 'text-purple-600' },
        { id: 'total-count', label: '全期間', color: 'text-gray-600' }
    ],
    CHARTS: [
        { id: 'daily', label: '日次推移 (直近7日)', dot: 'bg-blue-500', fullWidth: false },
        { id: 'weekly', label: '週次推移', dot: 'bg-green-500', fullWidth: false },
        { id: 'monthly', label: '月次推移', dot: 'bg-purple-500', fullWidth: true }
    ],
    CLASSES: {
        KPI_CARD: 'p-3 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform',
        CHART_CARD: 'p-3 h-64 flex flex-col',
        CHART_CONTAINER: 'relative flex-1 min-h-0 w-full'
    }
};