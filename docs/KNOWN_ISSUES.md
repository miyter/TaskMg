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
    - 各種Hooks/Store (`useFilters`, `useTasks`, `useTimeBlocks`, `store/workspace.ts`, `store/targets.ts`, `store/projects.ts`) で、`loading`判定ロジックを見直し。`workspaceId`切り替え時や初期ロード時に、空リストや古いデータが一瞬表示される問題を解消する（`isCacheReady`フラグの活用等）。

### 💾 Data Integrity & Schema Validation
データの破損防止、型安全性の向上。
- **Consistency**:
    - Store全体: 外部からのStore更新関数の直接呼び出しを制限し、単一方向データフローを強制。

### 🧹 Code Maintenance
- **Refactoring**:
    - `src/store/*`: Store関数の引数統一（`workspaceId`必須化によるSafety向上）。

---

## 🏗️ Technical Debt & Long-Term Roadmap
将来的なアーキテクチャの健全性のための長期課題です。

- **完全な多言語化 (i18n)**: UIの大部分は対応完了。引き続き新規追加機能での対応を継続する。

---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。
- **Localization Consistency (Work in Progress)**: 現在、日本語と英語が混在している箇所があるが、これは完全な i18n 移行への過渡期としての状態。