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

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: 数値フォーマットの統一 (`formatNumber`, `formatCurrency`) を実装し、主要コンポーネント (`TaskStats`, `LabelItem`) に適用完了。通貨フォーマットは未使用だが基盤は整備済み。
- **定数値の集約**: 主要な `z-index` と `DEFAULT_COLORS` の集約完了。残るハードコード値は随時リファクタリングする方針。
