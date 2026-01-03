# TaskMg 残存課題 (Known Issues)

## 🚀 残存課題

> [!IMPORTANT]
> 修正にあたっては `docs/PROJECT_STATUS.md` の「UI/UX 設計思想」を必ず参照し、情報の高密度化とミニマリズムを両棲させてください。

---

### ✅ Completed (Recent Refinements)
- **TaskList**:
    - **Optimistic Reorder**: Added local state for instant sorting feedback (abolished delay).
    - **DnD Integration**: Unified global (sidebar move) and local (reorder) DnD logic via `useDnDStore`.
- **Dashboard**:
    - **Density & Spacing**: Vertical spacing compressed between sections.
    - **Progress Bar Overflow**: Progress bar layout adjusted for responsiveness.
- **Task Edit Modal**:
    - **Density & Layout**: Border-based layout was abolished in favor of dividers. Information density improved.
    - **Header Simplification**: Icons prioritized over text labels.
    - **WYSIWYG Editor**: Abolished preview toggle in favor of a real-time split-view editor.
- **Main View**:
    - **Wording**: Sort option text shortened.
    - **Empty State**: Added "日付なし" display for tasks without due dates.
- **Workspace**:
    - **Edit/Delete**: Added edit/delete functionality in the workspace dropdown.
- **Time Block & Duration**:
    - **Settings UI**: Added dedicated schedule tab in settings modal.
- **Performance & Architecture**:
    - **Lazy Loading**: Implemented `React.lazy` for all modal components to optimize bundle size and TTI.
    - **Reflow Optimization**: Converted `useThemeEffect` to use `useEffect` to reduce layout thrashing during initial load.
    - **Render Blocking Resources**:
    - **CSS**: `vendor-*.css` was optimized by deferring font loading (`@fontsource` imports moved to dynamic import). Monitor LCP improvement.
    - **Performance**:
    - **Firestore Unique Check**: Implemented server-side duplicate check in `WorkspaceEditModal` to prevent name collision across devices.
    - **Component Standardization**: Integrated `Button`, `Input`, `Select`, `Textarea` across all views and modals for consistent UI/UX.
- **Internationalization (i18n)**:
    - **Wiki Content**: Localized Wiki Framework data for JA/EN.
    - **Wizard Content**: Localized Target Wizard modes and steps for JA/EN.
    - **System-wide**: Standardized `useTranslation` usage across all main features.

---

### 🏎️ Performance (Mobile Lighthouse)

- **Lighthouse/LCP**:
    - **Critical Request Chain**: `initializeAuth` と `browserLocalPersistence` の明示的利用により iframe 依存を軽減し、初期ロードを最適化。(Status: Optimized)

---

## 🐛 Active Bugs

### ~~React Error #185: Maximum update depth exceeded~~ ✅ Fixed (2026-01-03)

- **発生環境**: Production build (minified)
- **エラー内容**: `Maximum update depth exceeded.`
- **原因**: `handleTaskReorder` の依存配列に `localOrderedTasks`/`processedTasks` が含まれ、毎レンダーで再生成 → 無限ループ

**修正内容** (`src/components/tasks/TaskList.tsx`):
1. `useRef` で最新値を参照し、`useCallback` の依存配列を空に
2. 無限ループストッパー追加: 1秒以内に10回以上のuseEffect実行を検知したら登録をスキップ

```tsx
// Stopper example
if (effectCallCountRef.current > 10) {
    console.error('[TaskList] Infinite loop detected. Aborting.');
    return;
}
```

---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: 数値フォーマットの統一 (`formatNumber`, `formatCurrency`) を実装し、主要コンポーネント (`TaskStats`, `LabelItem`) に適用完了。通貨フォーマットは未使用だが基盤は整備済み。
- **定数値の集約**: 主要な `z-index` と `DEFAULT_COLORS` の集約完了。残るハードコード値は随時リファクタリングする方針。

---

## 🔧 Architectural Debt (Store Layer)

> [!NOTE]
> 以下はGrokによるコードレビュー結果（2026-01-03）を精査・整理したもの。

### ~~1. Raw Store Layer (`src/store/*-raw.ts`)~~ ✅ Completed (2026-01-03)

**実装内容**: `FirestoreCollectionCache<T>` ベースクラスを `src/store/base-cache.ts` に作成し、全 `*-raw.ts` をリファクタリング。

- `projects-raw.ts`, `labels-raw.ts`, `targets-raw.ts`, `filters-raw.ts`, `timeblocks-raw.ts`, `workspace-raw.ts`, `tasks-raw.ts` が `FirestoreCollectionCache` を継承
- 各ファイルで約25-40行のボイラープレート削減
- 共通メソッド: `isInitialized`, `getItems`, `setCache`, `clearCache`, `notifyListeners`, `registerListener`, `setFirestoreSubscription`, `hasFirestoreSubscription`

---

### ~~2. API Layer (`src/store/*.ts`)~~ ✅ Completed (2026-01-03)

**実装内容**: `src/store/store-utils.ts` に共通ユーティリティを集約し、`projects.ts`, `labels.ts`, `tasks.ts` をリファクタリング。

- `requireAuth()`, `requireAuthAndWorkspace()` - 認証ガード
- `getT()` - 翻訳ヘルパー
- `validateWithSchema()`, `validateOrThrow()` - Zod検証ユーティリティ
- `withErrorHandling()` - エラーハンドリングラッパー

---

### 3. Hooks Layer (`src/hooks/use*.ts`)

**共通問題**: `subscribeFn` と loading ロジック（`authLoading && isCacheReady`）がほぼ同一で重複。

| 対象ファイル | 現状の問題点 |
|---|---|
| `useTasks.ts` | userId/workspaceId ガードが hooks 層に混在。`useFirestoreSubscription` のキー配列が動的で不安定。 |
| `useLabels.ts` | 同上。`isCacheReady` の計算で初期化競合リスク。 |
| `useProjects.ts` | React Query と Store キャッシュの二重管理で不整合リスク。 |

**推奨対応**: ジェネリックな `useFirestoreEntity<T>` フックへの共通化

---

### ~~4. DnD Layer~~ ✅ Partially Completed (2026-01-03)

**実装内容**:
- `reorderProjectsRaw` を `orderedIds: string[]` 形式に統一（`reorderLabelsRaw`, `reorderTasksRaw` と一貫）
- `SortableItem.tsx` の DnD 状態スタイルを Tailwind クラスに統一

---

### ⚡ 対応優先度

1. ~~**最優先**: `*-raw.ts` の `*Cache` クラス → `FirestoreCollectionCache<T>` 共通化~~ ✅ 完了
2. ~~**高**: 認証ガード・Zod検証の共通ユーティリティ抽出~~ ✅ 完了
3. ~~**中**: `addTaskRaw` の Optimistic Update 実装~~ ✅ 完了
4. ~~**低**: reorder引数形式の統一、DnDスタイル統一~~ ✅ 完了

