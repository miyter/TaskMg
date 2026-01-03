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
    - **Component Standardization**: Integrated `Button`, `Input`, `Select`, `Textarea` across all views and modals for consistent UI/UX.
- **Internationalization (i18n)**:
    - **Wiki Content**: Localized Wiki Framework data for JA/EN.
    - **Wizard Content**: Localized Target Wizard modes and steps for JA/EN.
    - **System-wide**: Standardized `useTranslation` usage across all main features.

---

### 🏎️ Performance (Mobile Lighthouse)

- **Render Blocking Resources**:
    - **CSS**: `vendor-*.css` (約90KB) と `main-*.css` (約12KB) がレンダリングをブロックし、LCPを遅延 (推計470ms)。クリティカルCSSのインライン化や遅延読み込みを検討。
- **Forced Reflow**:
    - **Layout Thrashing**: JavaScript (`main-*.js`) によるDOM状態変更後の即時計測が発生中 (36ms)。`useLayoutEffect` やドラッグ操作時のDOM計測ロジックの最適化が必要。
- **Lighthouse/LCP**:
    - **Critical Request Chain**: Firebase Auth iframe等の長いリクエストチェーン (最大2.4s) が初期表示を遅延。

---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: Zodスキーマのエラーメッセージのローカライズ、動的な日付フォーマットのさらなる検討。
- **Firestore制約**: `WorkspaceEditModal` 等でのサーバー側ユニーク制約の検討。
- **定数値の集約**: 引き続きマジックナンバーの抽出を進める。
