# TaskMg プロジェクト状況ドキュメント

**最終更新**: 2026-01-01

## 📝 プロダクト概要
**TaskMg** は、目標達成とタスク管理を統合した先進的な Web アプリケーションです。
**「目標（Target）から逆算して、日々の行動（Task）を設計する」** というコンセプトの元、OKR、WOOP、バックワード・デザインといった複数のフレームワークをシームレスに利用できます。

ファイル総数: 119 ファイル (src/ 配下)
総行数(LOC): 11,089 行 (src/ 配下)

### 主な機能
- **高度なタスク管理**: プロジェクト・ラベル・時間帯フィルタに加え、AND/OR 複合条件による柔軟な検索が可能。
- **目標ダッシュボード (Target Dashboard)**: ウィザード形式で作成した目標を可視化し、日々のタスクとリンクさせて管理。
- **マルチワークスペース**: 完全に分離されたデータ環境で、仕事・プライベートなど複数のコンテキストをスイッチ可能。
- **フレームワーク Wiki**: アプリ内蔵のナレッジベースにより、各手法のベストプラクティスを即座に参照。

---

## 🏗️ 技術スタック

| カテゴリ | 技術 | ポイント |
|----------|------|------------|
| **Frontend** | React 18, TypeScript 5, Vite 6 | 型安全性 100% の堅牢なコードベース |
| **State** | Zustand 5 | グローバル状態と UI 状態の一元管理 |
| **Backend** | Firebase Firestore 10 | リアルタイム同期とオフライン対応 |
| **Auth** | Firebase Auth 10 | 堅牢な認証システム |
| **Hosting** | Cloudflare Workers | 高速なエッジネットワーク配信 |
| **Styling** | Tailwind CSS 3 | プレミアムなデザインシステムとレスポンシブ対応 |
| **DnD** | @dnd-kit/core 6, @dnd-kit/sortable 10 | タスク・セクションのドラッグ&ドロップ |
| **Cache** | @tanstack/react-query 5 | 効率的なデータ取得とキャッシュ管理 |
| **Date** | date-fns 4, date-fns-tz 3 | 日付操作とタイムゾーン管理 |

---

## 📁 ディレクトリ構造 (概要)

```
src/
├── components/      # UIコンポーネント (layout, modals, tasks, sidebar 等)
├── features/        # 機能モジュール (target-dashboard, wiki, wizard)
├── hooks/           # カスタムフック (データ購読, DnD, テーマ管理)
├── store/           # 状態管理 (Zustand ストアおよび Firestore CRUD)
├── core/            # Firebase 設定・認証・i18n
├── logic/           # 純粋なビジネスロジック (検索, フィルタ解析)
└── utils/           # 汎用ユーティリティ
```

---

## 🧠 アーキテクチャ・設計思想

### レイヤー分離
- **UI層** (`components/`): 純粋な表示責務。ビジネスロジックを持たない。
- **Hook層** (`hooks/`): データ購読とコンポーネントへの橋渡し。副作用の管理。
- **Store層** (`store/`): Zustand による UI 状態 + Firestore CRUD 操作のカプセル化。
- **Logic層** (`logic/`): 純粋関数によるビジネスロジック。テスト容易性を確保。
- **Core層** (`core/`): インフラ設定、認証、国際化などの基盤機能。

### 状態管理戦略
- **Server State**: Firestore のリアルタイム購読 (`onSnapshot`) + React Query によるキャッシュ管理。
- **UI State**: Zustand + `persist` middleware で localStorage に永続化。
- **Derived State**: `useMemo` / セレクタで計算。不要な再レンダリングを抑制。

### データフロー
```
Firestore → subscribeToXxx() → React Query Cache → Hook → Component
     ↑                                                ↓
     └──────── addXxx() / updateXxx() ←───────────────┘
```

### 設計原則
1. **型安全性**: Zod スキーマによるランタイムバリデーション + TypeScript の静的型付け。
2. **関心の分離**: `store/xxx.ts` (公開API) と `store/xxx-raw.ts` (内部実装) の分離。
3. **統一シグネチャ**: 全 subscribe 関数は `(workspaceId, callback)` 形式に統一。
4. **エラー可視化**: Toast 通知によるユーザーフィードバック。
5. **i18n**: ネストされたキー構造による型安全な翻訳管理。

---

## 🔄 現在のステータス

💎 **健全性: 極めて良好**

2026-01-01現在、UIの大幅な刷新と多言語化(i18n)対応が完了しました。
主要なリスト（タスク、プロジェクト、タイムブロック）に対するコンテキストメニューの実装や、ドラッグ＆ドロップによる並び替え強化など、UXの向上が図られています。

- **フェーズ**: 機能安定化 / メンテナンスフェーズ
- **最新の改善**: コンテキストメニュー実装、設定モーダルの多言語化、タスク並び替え機能の強化
- **残存課題**: [KNOWN_ISSUES.md](./KNOWN_ISSUES.md) (集計表示の再現監視のみ)
