# TaskMg 作業履歴

このドキュメントは、プロジェクトの主要な変更履歴を記録します。

---

## 2025-12-30

### リファクタリング完了 ✅
- **完全 React 化**: `src/ui` 内のレガシー DOM 操作コードを全廃し、全て React コンポーネントに移行完了。
- **ディレクトリ最適化**: `src/features` に主要機能をフラットに配置し、見通しを改善。
- **型安全性**: プロジェクト全体の TypeScript 化率 100%。

### パフォーマンス/設計改善 ✅
- **データ購読の高度化**: `store-raw.ts` / `projects-raw.ts` にて、JSON比較による更新抑制と参照安定化を実装。
- **レンダリング最適化**: `TaskItem`, `ProjectItem` の `React.memo` 化および `CustomFilterList` の `useMemo` による計算コスト削減。
- **App.tsx スリム化**: サイドバー定義とDnDロジックを分離 (`SidebarContent`, `useAppDnD`)。
- **コード共通化**: 日付処理 (`utils/date.ts`) と UI密度ロジック (`utils/ui-utils.ts`) を集約し、各コンポーネントで再利用開始。
- **設定の永続化**: ソート・完了表示設定を `filter-store` に統合し永続化。`TaskList` にUI追加。

### 残務処理・品質向上 ✅
- **未使用コード削除**: `api-adapters.ts`, レガシー `showMessageModal` 依存関係、未使用 `getTasks()` 関数を削除。
- **破損したインポートパスの修正**: `features/` 配下の壊れた相対パスを多数修正。
- **TypeScript 型チェック 100% pass**: `npx tsc --noEmit` がエラーなしで完了。

---
