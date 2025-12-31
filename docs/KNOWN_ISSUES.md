## 🚨 Critical Issues (Grok Code Review 2025-12-31)

以下の課題は、AIエージェントによるコードレビューで検出された重要項目です。優先的に解消してください。

### 1. Multi-Workspace & Store Architecture
- **Path Logic**: `filters` and `labels` are stored under `userId` (global) but should likely be scoped to `workspaceId` for true multi-workspace support.

### 2. UI/UX & Responsive Design
- **Mobile Experience**:
    - Keyboard shortcut `/` for search doesn't work on mobile (expected behavior).
- **Navigation**: `currentView` persistence causes de-sync with URL/Router state. Browsing history becomes inconsistent.
- **Feedback**: Error handling needs Toast integration in remaining stores (partially addressed in `filters.ts`).

---

### 🤖 AI Agent Implementation Guide
**Recommended Workflow for Next Agent:**
1.  **Path Logic**: Consider scoping `filters` and `labels` to `workspaceId` for true multi-workspace support.
2.  **UX Polish**: Address Toast/error feedback for better user experience.

---

## ⏳ Previously Known Issues (Legacy)

### 備忘録
- **メンテナンスツール**: Settings > Advanced > Database Maintenance 実装済み。

## ✅ 解決済みの課題 (直近の対応分)
> 2025-12-31 のコードレビュー指摘事項はすべて解消(Documentation Reflected)
- **UI/UX**: モバイル対応（Sidebar, LoginPage, Dashboard）、モーダルアクセシビリティ改善
- **機能**: ダッシュボードフィルタリング改善、タスク検索ロジック修正
- **保守性**: `sections` の状態管理移行、インポートパス修正、不要な useEffect 削除
- **High Priority Bugs (2025-12-31)**: 
    - `App.tsx`: `useApplyTheme` インポート追加
    - `markdown.ts`: `escapeHtml` スコープ問題修正
    - `ui-utils.ts`: `getDensityClass` 型ガード追加
    - `maintenance.ts`: Firestore Timestamp 対応、undefined ガード追加
    - `useThemeEffect.ts`: ネストされた useEffect 修正
    - `useTaskCounts.ts`: `useMemo` インポート追加
    - `useWorkspace.ts`: インポートパス修正
    - `translations.ts`: `useTranslation` フック追加
- **Store/Architecture (2025-12-31)**:
    - `store/index.ts`: UI stores の再エクスポート追加
    - `ui-store.ts`: モバイルで Sidebar を自動クローズするように修正
    - `view-store.ts`: `viewData` の永続化を除外（ストレージクォータ対策）
    - `schema.ts`: TimeBlocks に HH:mm 形式 regex 追加、Recurrence にデフォルト値設定
    - `filters.ts`: シグネチャ統一 + Zod バリデーション有効化 + Toast 通知追加
    - `labels.ts`: シグネチャ統一

