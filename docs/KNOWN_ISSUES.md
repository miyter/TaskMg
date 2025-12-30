# 既知の課題と改善候補

**最終更新**: 2025-12-31
**ステータス**: 🟢 概ね完了 (Remaining: UX Improvements)

すべての主要な不具合および機能不足（Work Package 1-5）は解消されました。
現在は UX 向上のための最適化と、将来的な品質向上タスクのみが残っています。

---

## 🚀 残存する課題 (UX最適化)

| 項目 | 問題の概要 | 対策の方向性 |
| :--- | :--- | :--- |
| **キャッシュ同期の疎結合** | `getProjects()` 等の同期ゲッターが、初期ロード完了前に呼ばれると空を返す可能性がある | ローディング状態 (`loading`) を UI コンポーネントでより厳密にハンドリングし、データ未到達時の表示を統一する |

---

## 🟢 優先度: 低 (将来的な品質向上)

- **ストア構成の洗練**: `store/` 配下のファイル構成をさらに整理し、バレルファイル (`index.ts`) への集約を徹底する。
- **エラー監視**: Sentry 等の導入による、クライアントサイドでの予期せぬエラーの追跡。
- **テスト拡充**: 複雑化した `search.ts` (検索ロジック) や `filter-parser.ts` に対する単体テストの作成。

---

## 🧠 ロジック・アーキテクチャ (Grok Review)

| コンポーネント | 指摘事項 | 改善案 |
| :--- | :--- | :--- |
| **src/store/tasks.ts** | 認証チェックの効率 | `requireAuthAndWorkspace` が頻繁に呼ばれる。パフォーマンスに影響する場合、Zustandストア内でのキャッシュ利用を検討 |
| **src/logic/filter-parser** | パーサーの脆弱性 | 正規表現が簡易的で、`label:work project:"home"` 等のスペース混じりのクエリでパース崩れのリスクが高い |
| **src/logic/filter-parser** | 型変換の非一貫性 | `duration` (number) のパース処理分散や `is:important` の扱いなど、構造的な整理とテストが必要 |
| **src/hooks/useTasks.ts** | 購読解除の競合リスク | `workspaceId` 変更時の `unsubscribe` タイミングにより、古いリスナーが残るレースコンディションの可能性がある |
| **src/components/modals/ModalManager.tsx** | データフローの切断 | 各モーダルコンポーネントに `modalData` がPropsとして渡されておらず、ストア依存が隠蔽されている |
| **src/store/store-raw.ts** | グローバルキャッシュの危険性 | ⚠️ 警告コメント追加済み。将来的にZustand/クラス化推奨 |
| **src/store/store-raw.ts** | リトライ戦略の曖昧さ | `withRetry` が全操作に一律適用されており、エラー種別判断やバックオフ戦略が不明確 |
| **src/store/store-raw.ts** | 無効データの隠蔽 | `deserializeTask` が不正データに `Invalid Task` を返すが、根本的なバリデーションエラーとして処理すべき |
| **src/core/firebase.ts** | 型チェックの放棄 | 全体への `@ts-nocheck` 適用は危険。必要な行のみの `ts-ignore` に留め、型定義を守るべき |
| **src/core/firebase.ts** | 設定取得の複雑化 | `window` 注入/Vite/Legacy が混在し保守性が低い。Vite環境変数に一本化すべき |
| **src/core/firebase-sdk.ts** | メンテナンス管理の属人化 | `@miyter` タグや古い日付コメントが散見され、SDKラッパーとしての抽象化レイヤーが将来的な負債になり得る |
| **src/utils/compare.ts** | 危険なJSONシリアライズ | ⚠️ 警告コメント追加済み。プリミティブ配列向けに限定使用 |
| **workers-site/index.js** | 非標準ルーティング実装 | `serveSinglePageApp` を使用しておらず、独自実装のためエッジケースに弱い |
| **workers-site/index.js** | エラーページの欠如 | 404エラー時に単なるテキスト 'Not Found' を返しており、SPAとしての適切な404ページがない |
| **workers-site/index.js** | デプロイ方式の陳腐化 | `kv-asset-handler` を使用したWorkerスクリプトは古く、`wrangler.toml` の `not_found_handling` 推奨 |
| **src/store/ui/workspace-store.ts** | ワークスペース情報の揮発 | `persist` で `workspaces` 配列を除外しているため、リロード時にリストが消える |
| **src/store/ui/settings-store.ts** | 将来的なストレージ肥大化 | 全設定を無差別に永続化しており、LocalStorage容量を圧迫するリスク |
| **src/components/modals/TaskDetailModal.tsx** | 未実装機能の放置 | 繰り返し設定 (`recurrence`) のUIはあるが、バックエンドでの生成ロジックが未完成 |
| **src/components/modals/ProjectEditModal.tsx** | ストア依存の疎結合崩れ | `getCurrentWorkspaceId()` を直呼びしており、テストや再利用が困難 |
| **src/components/modals/ProjectEditModal.tsx** | エラー表示位置の不備 | エラーメッセージが入力項目の直下ではなく離れた場所に表示される |
| **src/components/common/Modal.tsx** | 強制的なDOM操作 | `document.body.style.overflow` を直接操作しており、他のライブラリとの競合リスク |
| **src/components/common/Modal.tsx** | フォーカストラップ未実装 | Tabキーで背景要素にフォーカスが移動してしまう |
| **src/hooks/useAppDnD.ts** | インタラクションの遅延 | 並び替え時にFirestore更新完了を待っているため、操作後のフィードバックが遅い |
| **src/hooks/useAppDnD.ts** | プロジェクト順序のリスク | `order` フィールドの更新を `Promise.all` で一括実行しており、書き込み制限に引っかかる可能性 |
| **src/utils/date.ts** | 曜日計算のローカライズ | `getStartOfWeek` が月曜始まり固定で実装されている |
| **src/utils/date.ts** | タイムゾーンの不整合 | Firestore (UTC) と `toDate` (Local) 間でタイムゾーンの考慮がなく、日付境界でズレが発生 |
| **src/components/auth/LoginPage.tsx** | バリデーションの不備 | フォームバリデーションがサーバー側エラー返却に依存 |
| **src/components/auth/LoginPage.tsx** | 匿名認証のデータ管理 | ゲストログインから本登録への移行ロジックがなく、データが消失するリスク |
| **src/components/tasks/InlineTaskInput.tsx** | 誤入力の誘発 | フォーカスを外すと確認なしでキャンセルされ、入力内容が消失 |
