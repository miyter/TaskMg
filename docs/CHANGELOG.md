# TaskMg 作業履歴

このドキュメントは、プロジェクトの主要な変更履歴を記録します。

---

## 2025-12-31

### UX 最適化 & 機能追加 ✅
- **DnDの即時反映 (Optimistic Update)**: プロジェクト並び替え時の操作ラグを解消するため、サーバー応答を待たずにUIを更新する楽観的UI更新を実装。
- **ローディング表示の改善**: サイドバー各所（プロジェクト、ラベル、TimeBlock）に統一されたスケルトンローダーを導入し、読み込み中の体験を向上。
- **アカウント昇格機能**: ゲストユーザーがデータを保持したまま本登録を行えるよう、設定画面にアカウント管理機能（登録・ログアウト）を追加。

### UI/UX & アクセシビリティの洗練 ✅
- **アクセシビリティ完全対応**: `LoginPage`, `SettingsModal`, `TaskDetailModal` 等の全フォームで適切な `label` 関連付けを完了。ブラウザのオートフィル機能が正常に動作するよう改善。
- **モーダルの挙動最適化**: `Modal` コンポーネントにフォーカストラップを実装し、キーボード操作時のアクセシビリティを向上。
- **入力体験の向上**: `InlineTaskInput` にて、テキスト入力中の誤操作による内容消失を防止するガード処理を追加。
- **エラー通知の刷新**: ユーザーへのフィードバックを `alert()` から `toast` 通知システムへ統合し、よりモダンな体験へ。

### コード品質・安定性向上 ✅
- **型安全性の強化**: `firebase.ts` の `@ts-nocheck` を廃止し、環境変数やグローバル設定を型安全に取得できるよう再設計。
- **ストア設計のリファクタリング**: `ProjectEditModal` や `workspace-store` の設計を見直し、コンポーネント間の疎結合化と、リロード時のデータ保持の安定性を向上。
- **ロジックの堅牢化**: OKR計算におけるゼロ除算防止、ソートロジックのフォールバック強化、リストレンダリングの安定キー採用。
- **日付処理の柔軟性**: `getStartOfWeek` で週の開始日を指定可能にし、タイムゾーンに関する実装上の注釈を追加。

### Grokレビュー対応 (品質改善) ✅
- **Firebaseエラー防止**: `store-raw.ts` に `removeUndefined` ヘルパーを導入し、Firestore書き込み時の `undefined` 値を自動除去。`TaskDetailModal` の任意フィールドで `?? null` / `?? undefined` に統一。
- **UI白抜けバグ修正**: `AppLayout.tsx` と `TaskList.tsx` に明示的な背景色 (`bg-white dark:bg-gray-900`) を追加。`index.css` の body にフォールバック背景を設定。
- **CSS保守性向上**: 未使用CSS変数 (`--app-bg-light/dark`) を削除。グラデーション色の意図を明記するコメント追加。スクロールバー色をライト/ダーク両対応に修正。
- **React最適化**: `TaskDetailModal` の `handleSave`/`handleDelete` から `useCallback` を削除し保守性向上。`TaskItem` の `React.memo` 比較関数で Timestamp/Date 混在に対応。
- **コード整理**: `useLabels` 未使用インポート削除、`isNewTask` 判定を `startsWith('temp-')` に改善、`duration` キャッシュを `null` に正規化、toast通知のノイズ軽減。
- **密度対応**: `TaskList.tsx` のパディングを CSS変数連動に変更。`AppLayout.tsx` から冗長な `h-full` を削除。

### 開発基盤・品質向上 ✅
- **エラー監視システム**: 自作エラーロギング (`error-logger.ts`) を実装。`window.onerror`/`unhandledrejection` のグローバルキャッチ、React Error Boundary (`ErrorBoundary.tsx`) による UI エラー捕捉。
- **テスト環境整備**: Vitest を導入し `npm run test` / `npm run test:run` コマンドを追加。`filter-parser.test.ts` (25+ テストケース)、`search.test.ts` (15+ テストケース) を作成。
- **タイムゾーン対応**: `date-fns` / `date-fns-tz` を導入。新規ユーティリティ `date-tz.ts` で UTC ↔ ローカル変換、日付比較、フォーマットを安全に実行。日本語ロケール対応。

### 品質改善と保守性向上 (Priority: Low 対応) ✅
- **スキーマと型の厳格化**: `schema.ts`, `event-constants.ts` の型定義を見直し、`WorkspaceChangedDetail` や `RecurrenceSchema` を最適化。
- **データ整合性の強化**: `addTask`/`updateTask` に Zod の `safeParse` を導入し、ランタイムでの不正データ混入を防止。
- **Toast 通知の堅牢化**: ID生成に `crypto.randomUUID` を採用し、タイプ別の表示時間制御とタイマークリーンアップを実装してメモリリークを防止。
- **ストアの最適化**: `workspace-store` の永続化設定を変更し、ローカルとリモートの同期ずれリスクを排除。`filter-store` の初期値を `inbox` に統一。
- **認証・DnDの改善**: 認証エラーの適切な伝播、DnD失敗時のユーザーフィードバック追加、TypeScript型の明示化 (`UserCredential`, `Partial<Task>`)。

---

## 2025-12-30

### リファクタリング・設計改善 ✅
- **完全 React 化**: `src/ui` 内のレガシー DOM 操作コードを全廃し、全て React コンポーネントに移行完了。
- **ディレクトリ最適化**: `src/features` に主要機能をフラットに配置し、見通しを改善。
- **workspace の Zustand 移行**: グローバル変数と localStorage の直接操作を完全に廃止し、`useWorkspaceStore` による一元管理を実現。
- **型安全性 100%**: `SortCriteria`, `SearchConfig`, `Task` スキーマなど、全域にわたる TypeScript 化と厳密な型定義。
- **ストアバレルファイルの再構成**: `store.ts` と `index.ts` の混在を解消し、`src/store/index.ts` を唯一のエントリポイントとして整理。
- **フックのリアクティブ化**: `useWorkspace` フックを Zustand と同期させ、ワークスペース切り替え時の自動再読み込みを実現。

### パフォーマンス/安定性向上 ✅
- **データ購読の高度化**: `store-raw.ts` / `projects-raw.ts` にて、`areTaskArraysIdentical` や JSON比較による不要な再レンダリングの抑制。
- **レンダリング最適化**: `TaskItem`, `ProjectItem` の `React.memo` (shallow compare) 化および計算コストの高いフィルタ処理の `useMemo` 化。
- **キャッシュの堅牢化**: projects キャッシュを `Map<string, Project[]>` 形式に変更し、ワークスペース間でのデータ混入を防止。
- **ロジックの集約**: `search.ts` の二重フィルタリングを解消し、`filterTasks` エンジンにすべての検索ロジックを集約。
- **データの正規化**: `deserializeTask` での厳密なバリデーションとデフォルト値設定により、不正データによるクラッシュを防止。
- **耐障害性の向上**: `withRetry` ユーティリティを導入し、書き込み操作に指数バックオフ再試行を適用。

### UI/UX & 機能強化 ✅
- **プレミアム・デザイン**: グラスモルフィズム、高級感のあるグラデーション、浮遊アニメーション等の適用。
- **高度な検索**: フレーズ検索 (`"fix bug"`)、接頭辞クエリ (`is:important`, `p:"Inbox"`) への対応。
- **検索UIの統合**: サイドバー内への検索バー配置と、ショートカット `/` による即時アクセス。
- **重要度（スター）の正式実装**: `isImportant` スキーマ導入、スターアイコンによる直感的なトグル機能。
- **動的ソート**: `TaskList` での作成日、期限、重要度、名前による並び替え。
- **日付表示の高度化**: `formatDateCompact` による「今日」「明日」の相対表記と、期限切れの強調表示。
- **操作性向上**: `TaskList` ヘッダーの sticky 化、完了タスク表示のトグル、空状態の刷新。

### 機能実装・不具合修正 (Work Package 完了) ✅
- **TargetDashboard 実装**: Wizard で作成した目標データを Firestore に保存し、ダッシュボードで可視化（Backward/WOOP/OKR 対応）。
- **検索ロジック改善**: キーワード検索における `OR` 条件のサポート (`"A OR B"` pattern)。
- **アクセシビリティ向上**: `InlineTaskInput` の外クリック対応、フォームラベルの完備、フォーカス管理の改善。
- **データ不整合の解消**: Wizard データの構造化 (`config` ベースのキー管理) と、日付比較ロジックの安全性検証。
- **UI/UX 改善**: サイドバー/ヘッダーのレスポンシブ挙動の最適化、モバイルでの不要なブラー削除。

### ロジック・アーキテクチャの堅牢化 (Grok Review 対応) ✅
- **繰り返しタスク自動化**: タスク完了時に `recurrence` 設定を解析し、次期タスクを自動生成するバックエンドロジックを実装。
- **検索フィルター強化**: `excludeStatus (-is:completed)` や `is:unimportant` のサポート、引用符付きクエリ (`key:"val ue"`) の正規表現パーサー改善。
- **データ整合性**: `writeBatch` を用いたプロジェクト並び替えのアトミック更新、ローカルキャッシュ更新時の競合回避策 (`isMounted` チェック)。
- **スパゲッティ依存の解消**: モーダルコンポーネント (`ProjectEditModal` 等) の `activeModal` / `modalData` 依存を Props 経由にリファクタリングし、データフローを可視化。
- **インフラ/SDK 整備**: Cloudflare Workers の SPA ルーティング標準化 (`serveSinglePageApp`)、Firebase SDK ラッパーの整理、設定ストア (`settings-store`) の永続化最適化。

---
