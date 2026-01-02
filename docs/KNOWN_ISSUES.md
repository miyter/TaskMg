# TaskMg Known Issues & Roadmap

## 🚀 High Priority: Feature Requests & Improvements
ユーザーからのフィードバックおよびAIレビューに基づく改善項目です。

### ⚙️ Functionality
- **合計時間の集計不備 (再現待ち)**: タスクに所要時間を設定しても、フッターの「TOTAL 0.00h」が更新されない場合がある問題。
    - *Note*: コードロジック修正済み。再現確認待ち。

---

## 🩺 Grok Code Review (2026-01-01)
以下の項目は、コードベース全体の監査結果です。**モバイル環境での安定性、パフォーマンス、UX、データ整合性**を特に重視しています。次回の開発サイクルで順次対応してください。


### 🛡️ Stability & Offline Support
不安定なネットワーク環境やオフライン時の挙動改善、エラーハンドリング。
- **Retry & Recovery**:
    - 各種Hooks/Store (`useAppDnD`, `useTasks`, `workspace.ts`, `timeblocks.ts`, `targets-raw.ts`) にリトライ機構、失敗時のロールバック（Optimistic UpdateのRevert）、およびユーザーへのToast通知を追加。
    - `src/store/store-raw.ts`: `updateTaskStatusRaw`等のfire-and-forget処理にキューイングや信頼性向上策を導入。

### 🎨 UX & Loading States (Anti-Flicker)
スケルトン表示、ロード中のちらつき（Flickering）防止、初期状態の改善。
- **Loading Logic**:
    - 各種Hooks/Store (`useFilters`, `useTasks`, `useTimeBlocks`, `useWorkspaces`, `store/targets.ts`, `store/projects.ts`) で、`loading`判定ロジックを見直し。`workspaceId`切り替え時や初期ロード時に、空リストや古いデータが一瞬表示される問題を解消（キャッシュ活用による初期データ即時表示）。

### 💾 Data Integrity & Schema Validation
データの破損防止、型安全性の向上。
- **Consistency**:
    - Store全体: 外部からのStore更新関数の直接呼び出しを制限し、単一方向データフローを強制。

### 🧹 Code Maintenance
- **Refactoring**:
    - `src/store/*`: Store関数の引数統一（`workspaceId`必須化によるSafety向上）。

---

## 🩺 Grok Code Review (2026-01-02)
コードベースの深度監査による改善提案です。**モジュール性の向上、保守性、およびマルチデバイス環境でのUX一貫性**を重視しています。

### 🏗️ Hooks & Logic (Reliability)



### 📱 Component & UI/UX (Modals)
- **モバイル対応 (Responsive)**:
- **機能改善 (Modal Specific)**:

### 🧹 Maintenance & Technical Debt
- **定数値の集約**: `src/core/constants.ts` を作成し、`AUTH_TIMEOUT` や `TIME_BLOCK_LIMIT` を抽出済み。引き続きマジックナンバーの抽出を進める。
- **i18n の深度化**: `dateOptions`, `validation`, `account`, `time_block` などのメッセージを `translations.ts` に集約し、各コンポーネントで適用済み。
- **Firestore制約**: `WorkspaceEditModal` 等でのサーバー側ユニーク制約の検討。

---

## 🏗️ Technical Debt & Long-Term Roadmap
将来的やアーキテクチャの健全性のための長期課題です。

- **完全な多言語化 (i18n)**: 主要なモーダル（TaskDetail, TimeBlock, Settings, Workspace, Account）およびサイドバーの対応完了。残るは細かいエラーメッセージ等。


---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。
- **Localization Consistency (Work in Progress)**: 現在、日本語と英語が混在している箇所があるが、これは完全な i18n 移行への過渡期としての状態。

---

## 🧪 Browser Test Plan (Post-Refactoring)
これまでの修正（Loading改善、i18n、Cache導入）を確認するための手動テスト項目です。ブラウザでの動作確認時に使用してください。

### 1. Loading & Cache Behavior
- [ ] **初期ロード**: アプリを開いた際、Loadingスピナーが一瞬だけ（または全く）表示されず、キャッシュデータ（タスク、プロジェクトなど）が即座に表示されること。
- [ ] **ワークスペース切り替え**: サイドバーでワークスペースを切り替えた際、前のワークスペースのデータが一瞬残ったりせず、スムーズに新しいデータ（新規なら空の状態）に切り替わること。
- [ ] **リロード**: ページをリロードした際、Firebaseからのフェッチ完了を待たずに（キャッシュがあれば）リストが表示され、Loading状態が最小限であること。

### 2. Internationalization (i18n)
- [ ] **日本語表示**:
    - サイドバーのプロジェクト一覧が空の場合、「プロジェクトはありません」と表示されること。
    - サイドバーの所要時間リストが「15分」「30分」のように表示されること。
- [ ] **英語切り替え**: 設定から言語を英語に切り替え、上記箇所が「No projects」「15 min」等に即座に切り替わること。

### 3. Basic Regressions
- [ ] **タスク操作**: タスクの追加、編集、削除（モーダル経由）がエラーなく動作すること。
- [ ] **DnD**: サイドバーのセクション並び替え、タスクの並び替えがスムーズに行えること。
- [ ] **コンソールエラー**: 開発者ツールのConsoleに、`Key` 警告や `Act` 警告以外の重大なエラー（Firebase権限エラーやUndefinedエラー）が出ていないこと。
