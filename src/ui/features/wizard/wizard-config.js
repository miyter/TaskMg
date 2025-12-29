export const WIZARD_MODES = {
    backward: {
        id: 'backward',
        label: 'Backward Design',
        description: 'ゴールから逆算して、着実なタスクを設計します。長期的なプロジェクトに最適です。',
        steps: [
            {
                title: 'Goal / KGI',
                description: '最終ゴールの日付と状態（KGI）を定義しましょう。',
                inputs: [{ type: 'textarea', placeholder: '例：2025年3月31日までに、月間アクティブユーザー1万人を達成する。' }]
            },
            {
                title: 'Milestone',
                description: 'ゴールの1ヶ月前に到達すべき状態は？',
                inputs: [{ type: 'textarea', placeholder: '例：コア機能の実装が完了し、ベータ版を100人に配布済みである。' }]
            },
            {
                title: 'First Action',
                description: '今すぐ始めるべき最初のアクションは？',
                inputs: [{ type: 'textarea', placeholder: '例：競合アプリのレビューを分析して機能リストを作る。' }]
            }
        ]
    },
    woop: {
        id: 'woop',
        label: 'WOOP',
        description: '願望と障害を対比させ、実行計画を自動化します。習慣化や困難な目標に有効です。',
        steps: [
            {
                title: 'Wish (願望)',
                description: '達成したいことは何ですか？（挑戦的だが達成可能なもの）',
                inputs: [{ type: 'textarea', placeholder: '例：毎日30分、英語の勉強をする。' }]
            },
            {
                title: 'Outcome (結果)',
                description: 'それが達成できた時の「最高のメリット」や感情を詳しくイメージしてください。',
                inputs: [{ type: 'textarea', placeholder: '例：字幕なしで海外ドラマを楽しめるようになり、自信がつく。' }]
            },
            {
                title: 'Obstacle (障害)',
                description: 'それを邪魔する、あなた自身の「内面の障害」（感情・癖・思い込み）は何ですか？',
                inputs: [{ type: 'textarea', placeholder: '例：仕事で疲れて帰ってくると、ついスマホでSNSを見てしまう。' }]
            },
            {
                title: 'Plan (計画)',
                description: '「もし（障害）が起きたら、（行動）する」という形で計画を立てましょう。',
                inputs: [{ type: 'textarea', placeholder: '例：もし「疲れてソファに座りそう」になったら、「すぐにテキストを開く」とする。' }]
            }
        ]
    },
    okr: {
        id: 'okr',
        label: 'OKR',
        description: '野心的な目標(O)と、測定可能な成果(KR)を組み合わせます。組織やチーム、高い成長を目指す個人に。',
        steps: [
            {
                title: 'Objective',
                description: '定性的でワクワクするような目標を1つ決めてください。',
                inputs: [{ type: 'textarea', placeholder: '例：世界中のエンジニアに愛される開発ツールを作る！' }]
            },
            {
                title: 'Key Results',
                description: '目標達成を測るための、3つの具体的な数字（指標）を設定してください。',
                inputs: [
                    { type: 'text', placeholder: 'KR 1 (例: GitHubスター数 1,000到達)' },
                    { type: 'text', placeholder: 'KR 2 (例: 週間ダウンロード数 500回)' },
                    { type: 'text', placeholder: 'KR 3 (例: ユーザー継続率 40%維持)' }
                ]
            }
        ]
    }
};
