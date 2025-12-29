export const MOCK_DATA = {
    kgi: {
        title: "2025年3月31日までに、月間アクティブユーザー1万人を達成する",
        progress: 65,
        daysLeft: 42,
        status: 'good' // 'good' | 'warning' | 'danger'
    },
    backward: {
        milestones: [
            { date: '2025-03-31', title: 'GOAL: 10,000 MAU達成', type: 'goal', completed: false },
            { date: '2025-02-28', title: 'ベータ版100人配布完了', type: 'milestone', completed: false },
            { date: '2025-02-15', title: 'コア機能実装完了', type: 'milestone', completed: true },
            { date: 'Today', title: '現在地', type: 'current', completed: true },
            { date: '2025-01-10', title: '競合分析完了', type: 'action', completed: true }
        ]
    },
    woop: {
        wish: "毎日30分、英語の勉強をする",
        outcome: "字幕なしで海外ドラマを楽しめるようになり、自信がつく",
        obstacles: [
            { id: 1, text: "仕事で疲れてSNSを見てしまう", plan: "すぐにテキストを開く", overcomeCount: 5 },
            { id: 2, text: "急な残業が入る", plan: "朝15分、夜15分に分割する", overcomeCount: 2 }
        ]
    },
    okr: {
        objective: "世界中のエンジニアに愛される開発ツールを作る",
        keyResults: [
            { id: 1, text: "GitHubスター数 1,000到達", current: 650, target: 1000, confidence: 'high' },
            { id: 2, text: "週間ダウンロード数 500回", current: 320, target: 500, confidence: 'medium' },
            { id: 3, text: "ユーザー継続率 40%維持", current: 35, target: 40, confidence: 'low' }
        ]
    }
};
