# 既知の課題と改善候補

**最終更新**: 2025-12-30
**ステータス**: 🟢 概ね完了 (Remaining: UX Improvements)

すべての主要な不具合および機能不足（Work Package 1-5）は解消されました。
現在は UX 向上のための最適化と、将来的な品質向上タスクのみが残っています。

---

## 🚀 残存する課題 (UX最適化)

| 項目 | 問題の概要 | 対策の方向性 |
| :--- | :--- | :--- |
| **Optimistic UI** | Firestore 書き込み後の反映ラグ (onSnapshot 待ち) により、操作直後に一瞬遅延を感じる場合がある | ストア側での先行的なキャッシュ更新 (Optimistic Update) を実装し、体感速度を向上させる |
| **キャッシュ同期の疎結合** | `getProjects()` 等の同期ゲッターが、初期ロード完了前に呼ばれると空を返す可能性がある | ローディング状態 (`loading`) を UI コンポーネントでより厳密にハンドリングし、データ未到達時の表示を統一する |

---


## 🎨 コードレビュー指摘 (UI/UX改善)

| コンポーネント | 指摘事項 | 改善案 |
| :--- | :--- | :--- |
| **TaskItem** | 説明文の省略 (line-clamp) | `WebkitLineClamp` から Tailwind プラグインへ移行 |
| **TaskItem** | 重要度ボタンの視認性 | `opacity-10` は低すぎるため、Hoverなしでも視認可能にする |
| **TaskItem** | ドラッグ中の透明度 | `opacity-50` → `0.7` 以上へ変更し見失わないようにする |
| **TaskItem** | React.memo 比較 | Dateオブジェクトの文字列表記 (`toISOString`) で厳密比較する |
| **TaskList** | 空状態のアニメーション | パフォーマンス負荷軽減のため Static SVG へ変更 |
| **TaskList** | AddTaskButtonの重なり | `z-INDEX` のスタッキングコンテキストを明示的に確認 (`z-10`推奨) |
| **TaskList** | 完了ボタンの文言 | 文言の整合性確認（「隠す」が自然であることを再確認） |
| **TaskList** | モバイル Safe Area | `TaskStats` (下部固定) に `safe-area-inset-bottom` を考慮 |
| **TaskList** | 密度設定の整合性 | `density` に応じて `TaskItem` のパディングも調整する |
| **Sidebar** | モバイル時のクリッピング | `width: 0px` 時に `overflow-hidden` を徹底する |
| **Sidebar** | リサイザーの視認性 | 常時 `opacity-30` 程度を確保する |
| **Sidebar** | 画像パスの依存性 | public パスではなく `import` 文を使用する |
| **Sidebar** | トグルボタン配置 | `justify-between` を使用し、幅可変時の崩れを防止 |
| **Sidebar** | Backdrop Blur | パフォーマンスを確認の上、軽量ならモバイルでも適用検討 |

---

## 🟢 優先度: 低 (将来的な品質向上)

- **ストア構成の洗練**: `store/` 配下のファイル構成をさらに整理し、バレルファイル (`index.ts`) への集約を徹底する。
- **エラー監視**: Sentry 等の導入による、クライアントサイドでの予期せぬエラーの追跡。


- **テスト拡充**: 複雑化した `search.ts` (検索ロジック) や `filter-parser.ts` に対する単体テストの作成。

## 🧠 ロジック・アーキテクチャ (Grok Review)

| コンポーネント | 指摘事項 | 改善案 |
| :--- | :--- | :--- |
| **src/store/tasks.ts** | Optimistic Update未実装 | 現在はFirestore完了待ちでUIラグが発生。`toggleTaskStatus` 等でローカル状態を先行更新し体感速度を向上させる (重要) |
| **src/store/tasks.ts** | エラーハンドリング欠如 | Firestoreエラー時に例外がスローされずUI反応がない。`try-catch` ブロックとユーザー通知(Toast等)の実装が必要 |
| **src/store/tasks.ts** | トグル処理の競合リスク | `toggleTaskStatus` が引数 `currentStatus` に依存しており古い値を参照する危険性あり。最新取得またはトランザクション利用を推奨 |
| **src/store/tasks.ts** | 認証チェックの効率 | `requireAuthAndWorkspace` が頻繁に呼ばれる。パフォーマンスに影響する場合、Zustandストア内でのキャッシュ利用を検討 |
| **src/logic/search.ts** | 検索ロジックの簡易性 | キーワード検索の `OR` 実装が単純な配列分割のみで、複雑なクエリ ("A OR B C") で意図しない挙動になる |
| **src/logic/search.ts** | フィルタ実装の不完全さ | `status` 判定が `completed` 除外に偏っており、`todo` / `active` 等の細やかな制御や否定検索 (`-tag`) が未対応 |
| **src/logic/search.ts** | パフォーマンス懸念 | タスク数1000件超で毎回全件フィルタ・ソートが走る。メモ化 (`useMemo`) やリストの仮想化 (`react-window`) が必須要件 |
| **src/logic/filter-parser** | パーサーの脆弱性 | 正規表現が簡易的で、`label:work project:"home"` 等のスペース混じりのクエリでパース崩れのリスクが高い |
| **src/logic/filter-parser** | 型変換の非一貫性 | `duration` (number) のパース処理分散や `is:important` の扱いなど、構造的な整理とテストが必要 |
| **src/hooks/useTasks.ts** | Loading状態の不整合 | 初回ロード後 `setLoading(false)` するが、更新時やエラー時の制御がなく、体感遅延やスタックの原因になる |
| **src/hooks/useTasks.ts** | 購読解除の競合リスク | `workspaceId` 変更時の `unsubscribe` タイミングにより、古いリスナーが残るレースコンディションの可能性がある |
| **src/hooks/useTasks.ts** | エラーハンドリング欠如 | Firestoreエラー発生時に `loading` が解除されず永久ローディングになるリスクがある |
| **src/components/modals/ModalManager.tsx** | 単一モーダル制約 | `activeModal` が文字列管理のため、タスク詳細からラベル編集を開く等のネスト・スタック表示が構造的に不可能 (最大弱点) |
| **src/components/modals/ModalManager.tsx** | アクセシビリティ欠落 | バックドロップ、フォーカストラップ、ESCキー対応などの共通機能が実装されておらずUX品質が低い |
| **src/components/modals/ModalManager.tsx** | データフローの切断 | 各モーダルコンポーネントに `modalData` がPropsとして渡されておらず、ストア依存が隠蔽されている |
| **src/store/ui/modal-store.ts** | 非React連携の脆弱性 | `openModal` ヘルパーが `getState()` を直呼びしており、SSRや将来的な拡張でクラッシュするリスクがある |
| **src/store/ui/modal-store.ts** | 型安全性の欠如 | `modalData` が `any` を含んでおり、各利用箇所でのキャストが必要でバグの温床となっている |
| **src/store/store-raw.ts** | グローバルキャッシュの危険性 | `_cachedTasksMap` がモジュールスコープ変数であり、複数タブ/ユーザー切替時の競合やメモリリークの原因になる |
| **src/store/store-raw.ts** | 同期ロジックの脆弱性 | `onSnapshot` エラー時にデータを空 `[]` で上書きしており、一時的な接続断でデータ消失に見える挙動を起こす |
| **src/store/store-raw.ts** | リトライ戦略の曖昧さ | `withRetry` が全操作に一律適用されており、エラー種別判断やバックオフ戦略が不明確で無限ループのリスクがある |
| **src/store/store-raw.ts** | 無効データの隠蔽 | `deserializeTask` が不正データに `Invalid Task` を返すが、根本的なバリデーションエラーとして処理すべき |
| **src/core/firebase.ts** | 型チェックの放棄 | 全体への `@ts-nocheck` 適用は危険。必要な行のみの `ts-ignore` に留め、型定義を守るべき |
| **src/core/firebase.ts** | 設定取得の複雑化 | `window` 注入/Vite/Legacy が混在し保守性が低い。Vite環境変数 (`import.meta.env`) に一本化すべき |
| **src/core/firebase-sdk.ts** | メンテナンス管理の属人化 | `@miyter` タグや古い日付コメントが散見され、SDKラッパーとしての抽象化レイヤーが将来的な負債になり得る |
| **src/utils/retry.ts** | ログ汚染 | `console.warn` でリトライ毎にログ出力しており本番環境のコンソールを汚染する。Sentry等への移行を推奨 |
| **src/utils/retry.ts** | エラー種別の判別不足 | 権限エラー等のみ即 `throw` しているが、ネットワークエラー等の「一時的なエラー」のみをリトライ対象とすべき |
| **src/utils/compare.ts** | 順序依存のキャッシュ比較 | `areTaskArraysIdentical` が配列の並び順に依存しており、Firestoreの順序保証がないためキャッシュヒット率が低下する恐れがある |
| **src/utils/compare.ts** | 危険なJSONシリアライズ | `areArraysEqual` で `JSON.stringify` を使用しており、プロパティ順序不同や循環参照に対応できない |
| **src/logic/sort.ts** | デフォルト動作の隠蔽 | 不明な `criteria` 指定時に全タスクの比較値が `0` となり、並び替えが発生しないまま通知されない |
| **src/logic/sort.ts** | パフォーマンス負荷 | ソート毎に `[...tasks]` で新規配列を作成しており、タスク数が多い場合に不要なメモリコピーが発生する |
| **workers-site/index.js** | 非標準ルーティング実装 | `serveSinglePageApp` を使用しておらず、拡張子なしパスのリライトロジックが独自実装のためエッジケースに弱い |
| **workers-site/index.js** | エラーページの欠如 | 404エラー時に単なるテキスト 'Not Found' を返しており、SPAとしての適切な404ページ（またはindex.htmlへのフォールバック）がない |
| **workers-site/index.js** | デプロイ方式の陳腐化 | `kv-asset-handler` を使用したWorkerスクリプトは古く、現在は `wrangler.toml` の `not_found_handling` 推奨 (2025年基準) |
| **src/store/ui/workspace-store.ts** | ワークスペース情報の揮発 | `persist` で `workspaces` 配列を除外しているため、リロード時にリストが消え、再同期まで表示されないUX上の欠陥がある |
| **src/store/ui/settings-store.ts** | 将来的なストレージ肥大化 | 全設定を無差別に永続化しており、将来的にカスタムフォントデータ等が増えた場合にLocalStorage容量を圧迫するリスクがある |
| **src/components/modals/ModalManager.tsx** | 単一モーダル制約 | 複数モーダルの同時表示・スタッキング（例: タスク詳細を開いたままプロジェクト編集）が不可で、複雑なワークフローに対応できない |
| **src/components/modals/ModalManager.tsx** | Portal未使用 | `createPortal` を使用していないため、親要素の `z-index` や `overflow` の影響を受け、レイアウト崩れのリスクがある |
| **src/components/modals/TaskDetailModal.tsx** | **フォーム属性の欠落** | 多くの入力項目に `name`/`id` 属性がなく、ブラウザのオートフィルが無効で **警告ログの主因** となっている |
| **src/components/modals/TaskDetailModal.tsx** | アクセシビリティ低下 | `label htmlFor` の紐付けが不完全で、特にチェックボックスや日付選択の操作性が低い |
| **src/components/modals/TaskDetailModal.tsx** | 未実装機能の放置 | 繰り返し設定 (`recurrence`) のUIはあるが、バックエンドでの生成ロジックが未完成で機能していない |
| **src/components/modals/ProjectEditModal.tsx** | ストア依存の疎結合崩れ | コンポーネント内で `getCurrentWorkspaceId()` を直呼びしており、テストや再利用が困難な設計になっている |
| **src/components/modals/ProjectEditModal.tsx** | エラー表示位置の不備 | エラーメッセージが入力項目の直下ではなく離れた場所に表示され、ユーザーが気づきにくいUIになっている |
| **src/components/common/Modal.tsx** | 強制的なDOM操作 | `document.body.style.overflow` を直接操作しており、Shadow DOM環境や他のライブラリとの競合リスクがある |
| **src/components/common/Modal.tsx** | フォーカストラップ未実装 | モーダル表示中にTabキーで背景要素にフォーカスが移動してしまい、キーボード操作のアクセシビリティ基準を満たしていない |
| **src/hooks/useAppDnD.ts** | インタラクションの遅延 | 並び替え時にFirestoreの更新完了を待っているため、操作後のフィードバックが遅くUXが悪い (Optimistic Update必須) |
| **src/hooks/useAppDnD.ts** | プロジェクト順序のリスク | `order` フィールドの更新を `Promise.all` で一括実行しており、プロジェクト数が多い場合に書き込み制限に引っかかる可能性がある |
| **src/utils/date.ts** | 曜日計算のローカライズ | `getStartOfWeek` が月曜始まり固定で実装されており、日曜始まりを好むユーザーや地域設定に対応していない |
| **src/utils/date.ts** | 繰り返し計算のバグ | `weekly` 設定時、当日が実施曜日の場合に「次の週」ではなく「当日（過去）」を返してしまうバグが存在する |
| **src/utils/date.ts** | タイムゾーンの不整合 | Firestore (UTC) と `toDate` (Local) 間でタイムゾーンの考慮がなく、日付境界でズレが発生するリスクがある |
| **src/components/auth/LoginPage.tsx** | **アクセシビリティ警告の主因** | label要素に `htmlFor` がなく、input要素に `id` がないため、フォームとラベルが紐づいていない。これが "No label associated with a form field" 警告の直接的な原因 |
| **src/components/auth/LoginPage.tsx** | バリデーションの不備 | フォームのバリデーションがサーバー側のエラー返却に依存しており、入力段階でのフィードバックが遅い |
| **src/components/auth/LoginPage.tsx** | 匿名認証のデータ管理 | ゲストログインから本登録への移行ロジックがなく、ゲスト時のデータが引き継がれずに消失するリスクがある |
| **src/components/tasks/InlineTaskInput.tsx** | 誤入力の誘発 | テキスト入力中にフォーカスを外すと確認なしでキャンセルされ、入力内容が消失するUX上の問題がある |
| **src/components/tasks/InlineTaskInput.tsx** | エラー表示の粗雑さ | エラー時に `alert()` を使用しており、ユーザー体験を損なう。Toastなどの非同期通知に置き換えるべき |
| **src/features/target-dashboard/views/OkrView.tsx** | ゼロ除算リスク | KRの進捗率計算で `target` が0の場合に考慮がなく、`NaN%` が表示される可能性がある |
| **src/features/target-dashboard/views/BackwardView.tsx** | リストレンダリングのキー | マイルストーンの描画で `index` を `key` に使用しており、並べ替えや削除時にReactの再描画効率と整合性が落ちるリスクがある |
| **src/components/modals/TaskDetailModal.tsx** | **No Label警告の主因** | タスクタイトル入力欄に `label` がなく `id` もないため、アクセシビリティ非対応として警告の主な発生源となっている |
| **src/components/modals/ProjectEditModal.tsx** | **No Label警告の主因** | プロジェクト名入力欄に `label` も `id` もなく、フォーム入力としての要件を満たしていない |
| **src/components/modals/SettingsModal.tsx** | **No Label警告の主因** | フォント設定の input 要素に `id` がなく `htmlFor` との紐づけが切れている |



## 🔴 重大バグ: 右側空白問題

| コンポーネント | 問題 | 原因 |
| :--- | :--- | :--- |
| **src/components/layout/AppLayout.tsx** | メインエリアが真っ白 | ルート要素に `h-full` が指定されているが、親の `html`/`body`/`#app` に `height: 100%` (or `h-screen`) が明示的に伝達されておらず、高さが `0` になっている |
| **src/main.tsx** | ルート要素の高さ不足 | `document.getElementById('app')` でマウントしている `div` にクラス指定がなく、`h-full` の継承チェーンがここで途切れている |
| **src/index.css** | グローバルリセットの影響 | Tailwind の Preflight で `height` がリセットされている可能性があり、明示的な `@apply h-screen` が `html`, `body`, `#app` に必要 |

**推奨対策**: `index.html` または `index.css` にて `html, body, #app { @apply h-screen; }` を適用し、`AppLayout` を `h-screen` に変更する。


## 🧠 ロジック・アーキテクチャ (Grok Review)

| コンポーネント | 指摘事項 | 改善案 |
| :--- | :--- | :--- |
| **src/store/tasks.ts** | Optimistic Update未実装 | 現在はFirestore完了待ちでUIラグが発生。`toggleTaskStatus` 等でローカル状態を先行更新し体感速度を向上させる (重要) |
| **src/store/tasks.ts** | エラーハンドリング欠如 | Firestoreエラー時に例外がスローされずUI反応がない。`try-catch` ブロックとユーザー通知(Toast等)の実装が必要 |
| **src/store/tasks.ts** | トグル処理の競合リスク | `toggleTaskStatus` が引数 `currentStatus` に依存しており古い値を参照する危険性あり。最新取得またはトランザクション利用を推奨 |
| **src/store/tasks.ts** | 認証チェックの効率 | `requireAuthAndWorkspace` が頻繁に呼ばれる。パフォーマンスに影響する場合、Zustandストア内でのキャッシュ利用を検討 |
| **src/logic/search.ts** | 検索ロジックの簡易性 | キーワード検索の `OR` 実装が単純な配列分割のみで、複雑なクエリ ("A OR B C") で意図しない挙動になる |
| **src/logic/search.ts** | フィルタ実装の不完全さ | `status` 判定が `completed` 除外に偏っており、`todo` / `active` 等の細やかな制御や否定検索 (`-tag`) が未対応 |
| **src/logic/search.ts** | パフォーマンス懸念 | タスク数1000件超で毎回全件フィルタ・ソートが走る。メモ化 (`useMemo`) やリストの仮想化 (`react-window`) が必須要件 |
| **src/logic/filter-parser** | パーサーの脆弱性 | 正規表現が簡易的で、`label:work project:"home"` 等のスペース混じりのクエリでパース崩れのリスクが高い |
| **src/logic/filter-parser** | 型変換の非一貫性 | `duration` (number) のパース処理分散や `is:important` の扱いなど、構造的な整理とテストが必要 |
| **src/hooks/useTasks.ts** | Loading状態の不整合 | 初回ロード後 `setLoading(false)` するが、更新時やエラー時の制御がなく、体感遅延やスタックの原因になる |
| **src/hooks/useTasks.ts** | 購読解除の競合リスク | `workspaceId` 変更時の `unsubscribe` タイミングにより、古いリスナーが残るレースコンディションの可能性がある |
| **src/hooks/useTasks.ts** | エラーハンドリング欠如 | Firestoreエラー発生時に `loading` が解除されず永久ローディングになるリスクがある |
| **src/components/modals/ModalManager.tsx** | 単一モーダル制約 | `activeModal` が文字列管理のため、タスク詳細からラベル編集を開く等のネスト・スタック表示が構造的に不可能 (最大弱点) |
| **src/components/modals/ModalManager.tsx** | アクセシビリティ欠落 | バックドロップ、フォーカストラップ、ESCキー対応などの共通機能が実装されておらずUX品質が低い |
| **src/components/modals/ModalManager.tsx** | データフローの切断 | 各モーダルコンポーネントに `modalData` がPropsとして渡されておらず、ストア依存が隠蔽されている |
| **src/store/ui/modal-store.ts** | 非React連携の脆弱性 | `openModal` ヘルパーが `getState()` を直呼びしており、SSRや将来的な拡張でクラッシュするリスクがある |
| **src/store/ui/modal-store.ts** | 型安全性の欠如 | `modalData` が `any` を含んでおり、各利用箇所でのキャストが必要でバグの温床となっている |
| **src/store/store-raw.ts** | グローバルキャッシュの危険性 | `_cachedTasksMap` がモジュールスコープ変数であり、複数タブ/ユーザー切替時の競合やメモリリークの原因になる |
| **src/store/store-raw.ts** | 同期ロジックの脆弱性 | `onSnapshot` エラー時にデータを空 `[]` で上書きしており、一時的な接続断でデータ消失に見える挙動を起こす |
| **src/store/store-raw.ts** | リトライ戦略の曖昧さ | `withRetry` が全操作に一律適用されており、エラー種別判断やバックオフ戦略が不明確で無限ループのリスクがある |
| **src/store/store-raw.ts** | 無効データの隠蔽 | `deserializeTask` が不正データに `Invalid Task` を返すが、根本的なバリデーションエラーとして処理すべき |
| **src/core/firebase.ts** | 型チェックの放棄 | 全体への `@ts-nocheck` 適用は危険。必要な行のみの `ts-ignore` に留め、型定義を守るべき |
| **src/core/firebase.ts** | 設定取得の複雑化 | `window` 注入/Vite/Legacy が混在し保守性が低い。Vite環境変数 (`import.meta.env`) に一本化すべき |
| **src/core/firebase-sdk.ts** | メンテナンス管理の属人化 | `@miyter` タグや古い日付コメントが散見され、SDKラッパーとしての抽象化レイヤーが将来的な負債になり得る |
| **src/utils/retry.ts** | ログ汚染 | `console.warn` でリトライ毎にログ出力しており本番環境のコンソールを汚染する。Sentry等への移行を推奨 |
| **src/utils/retry.ts** | エラー種別の判別不足 | 権限エラー等のみ即 `throw` しているが、ネットワークエラー等の「一時的なエラー」のみをリトライ対象とすべき |
| **src/utils/compare.ts** | 順序依存のキャッシュ比較 | `areTaskArraysIdentical` が配列の並び順に依存しており、Firestoreの順序保証がないためキャッシュヒット率が低下する恐れがある |
| **src/utils/compare.ts** | 危険なJSONシリアライズ | `areArraysEqual` で `JSON.stringify` を使用しており、プロパティ順序不同や循環参照に対応できない |
| **src/logic/sort.ts** | デフォルト動作の隠蔽 | 不明な `criteria` 指定時に全タスクの比較値が `0` となり、並び替えが発生しないまま通知されない |
| **src/logic/sort.ts** | パフォーマンス負荷 | ソート毎に `[...tasks]` で新規配列を作成しており、タスク数が多い場合に不要なメモリコピーが発生する |
| **workers-site/index.js** | 非標準ルーティング実装 | `serveSinglePageApp` を使用しておらず、拡張子なしパスのリライトロジックが独自実装のためエッジケースに弱い |
| **workers-site/index.js** | エラーページの欠如 | 404エラー時に単なるテキスト 'Not Found' を返しており、SPAとしての適切な404ページ（またはindex.htmlへのフォールバック）がない |
| **workers-site/index.js** | デプロイ方式の陳腐化 | `kv-asset-handler` を使用したWorkerスクリプトは古く、現在は `wrangler.toml` の `not_found_handling` 推奨 (2025年基準) |
| **src/store/ui/workspace-store.ts** | ワークスペース情報の揮発 | `persist` で `workspaces` 配列を除外しているため、リロード時にリストが消え、再同期まで表示されないUX上の欠陥がある |
| **src/store/ui/settings-store.ts** | 将来的なストレージ肥大化 | 全設定を無差別に永続化しており、将来的にカスタムフォントデータ等が増えた場合にLocalStorage容量を圧迫するリスクがある |
| **src/components/modals/ModalManager.tsx** | 単一モーダル制約 | 複数モーダルの同時表示・スタッキング（例: タスク詳細を開いたままプロジェクト編集）が不可で、複雑なワークフローに対応できない |
| **src/components/modals/ModalManager.tsx** | Portal未使用 | `createPortal` を使用していないため、親要素の `z-index` や `overflow` の影響を受け、レイアウト崩れのリスクがある |
| **src/components/modals/TaskDetailModal.tsx** | **フォーム属性の欠落** | 多くの入力項目に `name`/`id` 属性がなく、ブラウザのオートフィルが無効で **警告ログの主因** となっている |
| **src/components/modals/TaskDetailModal.tsx** | アクセシビリティ低下 | `label htmlFor` の紐付けが不完全で、特にチェックボックスや日付選択の操作性が低い |
| **src/components/modals/TaskDetailModal.tsx** | 未実装機能の放置 | 繰り返し設定 (`recurrence`) のUIはあるが、バックエンドでの生成ロジックが未完成で機能していない |
| **src/components/modals/ProjectEditModal.tsx** | ストア依存の疎結合崩れ | コンポーネント内で `getCurrentWorkspaceId()` を直呼びしており、テストや再利用が困難な設計になっている |
| **src/components/modals/ProjectEditModal.tsx** | エラー表示位置の不備 | エラーメッセージが入力項目の直下ではなく離れた場所に表示され、ユーザーが気づきにくいUIになっている |

