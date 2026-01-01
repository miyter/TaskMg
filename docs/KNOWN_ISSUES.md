# TaskMg Known Issues & Roadmap

## 🚀 High Priority: Feature Requests & Improvements
ユーザーからのフィードバックに基づく、最優先の機能拡張および改善項目です。

### 1. 設定・国際化 (Settings & i18n)
- **完全な英語対応**:
    - 英語モードにおいて、サイドバー、モーダルの見出し、ボタン、メッセージ等すべてを翻訳。
    - **AI向け補足**: 現在ハードコードされている文字列を抽出し、`src/core/i18n/` の各言語ファイルに移行。サイドバーのセクションタイトル等も翻訳対象に含める。

---

## 🏗️ Technical Debt & Long-Term Roadmap
将来的なアーキテクチャの健全性のための長期課題です。

- **Multi-Workspace スコープの適正化**: `filters`, `labels` の保存先を `workspaceId` スコープへ移行。
- **TanStack Query への移行**: `useProjects`, `useTasks` 等のデータ購読・キャッシュ管理をライブラリ化。
- **イベントシステムの刷新**: カスタムイベントを Zustand slice や型安全な Pub/Sub (Mitt 等) へ移行。

---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。