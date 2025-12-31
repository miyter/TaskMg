# 既知の課題と改善候補

**最終更新**: 2024-12-31
**ステータス**: 🟢 概ね完了 (Remaining: UX Improvements & Logic Cleanup)

すべての主要な不具合および機能不足（Work Package 1-5）は解消されました。
現在は UX 向上のための最適化と、将来的な品質向上タスクのみが残っています。

---

## 🚀 残存する課題 (UX最適化)

| 項目 | 問題の概要 | 対策の方向性 | 状態 |
| :--- | :--- | :--- | :---: |
| **キャッシュ同期の疎結合** | `getProjects()` 等の同期ゲッターが、初期ロード完了前に呼ばれると空を返す可能性がある | ローディング状態 (`loading`) を UI コンポーネントでより厳密にハンドリングし、データ未到達時の表示を統一する | ✅ |
| **DnD インタラクションの遅延** | 並び替え時にFirestore更新完了を待っているため、操作後のフィードバックが遅い | `useAppDnD.ts` にてローカル状態を用いた Optimistic Update を実装する | ✅ |

---

## 🟢 優先度: 低 (将来的な品質向上)

- **ストア構成の洗練**: `store/` 配下のファイル構成をさらに整理し、バレルファイル (`index.ts`) への集約を徹底する。
- **エラー監視**: Sentry 等の導入による、クライアントサイドでの予期せぬエラーの追跡。
- **テスト拡充**: 複雑化した `search.ts` (検索ロジック) や `filter-parser.ts` に対する単体テストの作成。

---

## 🧠 ロジック・アーキテクチャ (Grok Review)

| コンポーネント | 指摘事項 | 改善案 |
| :--- | :--- | :--- |
| **src/store/tasks.ts** | 認証チェックの効率 | ✅ 現状は軽量であり問題なし (将来的にキャッシュ検討) |
| **src/logic/filter-parser** | パーサーの脆弱性 | ✅ Regex改良と論理バグ修正済み (Status除外、重要度判定の正規化) |
| **src/logic/filter-parser** | 型変換の非一貫性 | ✅ 型定義の厳格化と数値パース処理の統合 |
| **src/hooks/useTasks.ts** | 購読解除の競合リスク | ✅ `isMounted` フラグによる適切なクリーンアップを確認 |
| **src/components/modals/ModalManager.tsx** | データフローの切断 | ✅ 各モーダルコンポーネントに `Props` リファクタリングを実施し、`ModalManager` から明示的にデータを渡すよう修正 |
| **src/store/store-raw.ts** | グローバルキャッシュの危険性 | ⚠️ 警告コメント追加済み。将来的にZustand/クラス化推奨 |
| **src/store/store-raw.ts** | 無効データの隠蔽 | ✅ `TaskSchema.safeParse` によるバリデーションを追加 (ログ出力のみから開始) |
| **src/core/firebase-sdk.ts** | メンテナンス管理の属人化 | ✅ 個別の開発者タグ等を削除し、汎用的なコメントに修正 |
| **workers-site/index.js** | 非標準ルーティング実装 | ✅ 標準の `serveSinglePageApp` を導入し、SPAルーティングを堅牢化 |
| **workers-site/index.js** | エラーページの欠如 | ✅ アセット404時に簡易的なHTMLページを返すよう修正 |
| **src/store/ui/settings-store.ts** | 将来的なストレージ肥大化 | ✅ `partialize` を導入し、設定のみを永続化するよう修正 |
| **src/components/modals/TaskDetailModal.tsx** | 未実装機能の放置 | ✅ `recurrence` による次タスク生成ロジックを `store-raw.ts` に実装済み |
| **src/hooks/useAppDnD.ts** | プロジェクト順序のリスク | ✅ `writeBatch` を使用した `reorderProjectsRaw` によるアトミック更新に修正済み |
| **src/utils/date.ts** | タイムゾーンの不整合 | Firestore (UTC) と local時間間の考慮。注釈追加済みだが、将来的に `date-fns-tz` 検討 |

