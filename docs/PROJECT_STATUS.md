# TaskMg プロジェクト状況ドキュメント

**最終更新**: 2025-12-30

## 📝 プロダクト概要
**TaskMg** は、目標達成とタスク管理を統合した先進的な Web アプリケーションです。
**「目標（Target）から逆算して、日々の行動（Task）を設計する」** というコンセプトの元、単なるToDoリストではなく、OKR、WOOP、バックワード・デザインといった複数のフレームワークをシームレスに切り替えて利用できることが特徴です。

### 主な機能
- **高度なタスク管理**: プロジェクト、ラベル、時間帯（Time Block）、所要時間による多角的なフィルタリングと統計表示。
- **目標設計ウィザード**: 対話形式で目標を明確化し、行動計画へと落とし込むガイド機能。
- **マルチフレームワーク**: OKR、WOOP、バックワード・デザインなど、状況に応じた目標管理手法をサポート。
- **フレームワーク Wiki**: 各手法のベストプラクティスをアプリ内で学習・参照可能。
- **マルチワークスペース**: 複数のワークスペースを切り替えて、異なるプロジェクト群を独立管理。
- **設定の永続化**: テーマ、フォント、UI密度、ソート順などの設定をブラウザに保存し、再訪問時も維持。

---

## 🏗️ 技術スタック

| カテゴリ | 技術 | バージョン |
|----------|------|------------|
| **フレームワーク** | React | 18.3.1 |
| **ビルドツール** | Vite | 6.0.0 |
| **言語** | TypeScript | 5.9.3 |
| **状態管理** | Zustand | 5.0.9 |
| **スタイリング** | Tailwind CSS | 3.4.3 |
| **バックエンド** | Firebase Firestore | 10.14.1 |
| **D&D** | @dnd-kit | 6.3.1 |

---

## 📁 ディレクトリ構造

```
src/
├── App.tsx                  # React アプリケーションルート
├── main.tsx                 # エントリーポイント
├── index.css                # グローバルスタイル
│
├── components/              # 共有・UIコンポーネント
│   ├── auth/                # 認証関連 (LoginPage)
│   ├── common/              # 共通コンポーネント (Modal, SortableItem)
│   ├── layout/              # レイアウト (AppLayout)
│   ├── modals/              # モーダル (TaskDetailModal, SettingsModal 等)
│   ├── sidebar/             # サイドバー構成要素 (SidebarContent, ProjectList 等)
│   └── tasks/               # タスク関連 (TaskList, TaskItem, TaskStats)
│
├── features/                # 機能モジュール
│   ├── target-dashboard/    # 目標ダッシュボード (OKR/WOOP/Backward)
│   ├── wiki/                # フレームワーク解説Wiki
│   └── wizard/              # 目標設計ウィザード
│
├── hooks/                   # カスタムフック
│   ├── useAppDnD.ts         # DnDロジック
│   ├── useTasks.ts          # タスク購読
│   ├── useProjects.ts       # プロジェクト購読
│   ├── useThemeEffect.ts    # テーマ適用
│   └── ...                  # その他 (useLabels, useTimeBlocks 等)
│
├── store/                   # Zustand & Firestore Logic
│   ├── ui/                  # UI状態管理 (filter-store, settings-store 等)
│   ├── store-raw.ts         # タスクCRUD (Firestore)
│   ├── projects-raw.ts      # プロジェクトCRUD
│   ├── schema.ts            # Zodスキーマ定義
│   └── ...                  # その他 (workspace, labels, timeblocks)
│
├── core/                    # Firebase設定・定数
├── logic/                   # ビジネスロジック (search, sort, filter-parser)
└── utils/                   # ユーティリティ (date, cn, paths, ui-utils)
```

---

## 🔄 現在のステータス

💎 **健全性: 極めて良好**

技術的負債の大半（レガシーロジック、非効率な比較、不十分なバリデーション）が解消され、大規模なタスクデータでも安定して動作するクリーンな基盤が整いました。

- **状態管理**: Zustand への移行とワークスペース分離が完了。
- **パフォーマンス**: 各種 shallow compare および高速配列比較の導入により、リレンダリングと計算コストを最適化。
- **検索エンジン**: 統合された高度なフィルタリング機能を搭載。

> 詳細な作業履歴は [CHANGELOG.md](./CHANGELOG.md) を参照してください。
> 既知の課題は [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) を参照してください。

---

## 🎯 次のステップ

1. **新機能開発への復帰**
   - 目標設計ウィザードのブラッシュアップ。
   - 外部カレンダー連携等の検討。

2. **品質保証**
   - 主要ロジックのテストコード作成。
   - ユーザーインターフェースのアクセシビリティ向上。

---

## 🔧 開発コマンド

```bash
# 開発サーバー
npm run dev

# 型チェック
npx tsc --noEmit

# ビルド
npm run build
```
