# TaskMg Known Issues & Roadmap

## 🚀 残存課題

なし - 全ての主要課題は解決済み

---

## 🛠️ TypeScript Status
- **型チェック状況 (2026-01-02)**: `npx tsc --noEmit` を実行し、現在エラーがないことを確認済み。型安全性 100% を維持中。

---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: 主要なモーダルおよびサイドバーの大部分の対応完了。残るはUIラベルの統一とエラーメッセージ等。
- **Firestore制約**: `WorkspaceEditModal` 等でのサーバー側ユニーク制約の検討。
- **定数値の集約**: 引き続きマジックナンバーの抽出を進める。

---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。
- **Localization Consistency (Work in Progress)**: 現在、日本語と英語が混在している箇所があるが、これは完全な i18n 移行への過渡期としての状態。
- **Facade Pattern (Data Flow)**: `store-raw.ts` は内部実装とし、外部からは `tasks.ts` 等のファサード関数を通じてのみアクセス。単一方向データフローを強制。
- **Optimistic Update with Rollback**: 失敗時は自動ロールバックとToast通知でユーザーに通知。

---

## 🧪 Browser Test Plan (Last Run: 2026-01-02)

### 1. Loading & Cache Behavior
- [x] **初期ロード**: アプリを開いた際、Loadingスピナーが一瞬だけ（または全く）表示されず、キャッシュデータが即座に表示されること。
- [x] **ワークスペース切り替え**: サイドバーでワークスペースを切り替えた際、スムーズに新しいデータに切り替わること。
- [x] **リロード**: ページをリロードした際、Loading状態を表示してFirebaseセッションを復元。ログイン画面が一瞬表示される問題を解消。

### 2. Internationalization (i18n)
- [x] **日本語表示**: サイドバーのプロジェクト一覧が空の場合「プロジェクトはありません」、所要時間リストが「15分」のように表示されること。
- [ ] **英語切り替え**: 設定から言語を英語に切り替え、上記箇所が「No projects」「15 min」等に即座に切り替わること。(※多くのラベルが未対応)

### 3. Basic Regressions
- [x] **タスク操作**: タスクの追加、編集、削除がエラーなく動作すること。
- [x] **DnD**: タスクの並び替えがスムーズに行えること。
- [x] **コンソールエラー**: 開発者ツールのConsoleに重大なエラーが出ていないこと。
- [x] **検索体験刷新**: モダンなグラスモーフィズムデザインで検索画面を刷新。サイドバーからのみ検索にアクセス。
- [x] **Fire-and-Forget改善**: `updateTaskStatusRaw`, `updateTaskRaw`, `deleteTaskRaw` に失敗時ロールバックとToast通知を追加。
