[KNOWN_ISSUES.md]
## ⏳ Future Improvements & Long-Term Roadmap

以下の課題は優先度は低いものの、将来的なアーキテクチャ改善のために認識されている項目です。

### 1. Multi-Workspace & Store Architecture
- **Path Logic**: `filters` and `labels` は `userId` 配下に保存されているが、真のマルチワークスペース対応には `workspaceId` スコープが必要。

### 2. UI/UX & Responsive Design
- **Mobile**: キーボードショートカット `/` はモバイルで動作しない。
- **Navigation**: `currentView` の永続化がURL/Router状態と非同期になり、ブラウザ履歴が不整合になる（SPAとブラウザバックの整合性）。
- **Feedback**: 残りのStoreにToastエラー統合が必要（主要なStoreには対応済み）。

### 11. TanStack Query への移行検討
**対象**: `useProjects.ts`, `useTasks.ts`
- **問題**: リアルタイム性とキャッシュ管理の複雑さからカスタム実装が肥大化。
- **解決策**: 長期的に TanStack Query への移行を検討。ただし、リアルタイム購読との統合方法を事前調査。

### 12. グローバル density と sidebar density の統合
**対象**: `useThemeEffect.ts`
- **問題**: `setSidebarDensity(density)` で UIStore を更新しているが、グローバル density と sidebar density が分離されている設計の臭い。
- **解決策**: 長期的に stores を統合すべきか検討。

### 22. カスタムイベントシステムの刷新
**対象**: `src/core/event-constants.ts`
- **問題**: カスタムイベントシステムより Zustand slice や Mitt の方が型安全。
- **解決策**: 長期的に型安全な Pub/Sub への移行を検討。

---

## 🚀 Grok Review Refactoring Targets (2026-01-01)
以下は、コードレビュー（Grok）により指摘された改善点です。保守性、UI/UX、アクセシビリティの向上を目的としています。

### 🛠️ Refactoring Strategy & Priorities
AIエージェント向けの注記: 以下のタスクは、**コンポーネントの分割**（保守性）、**レスポンシブ対応**（モバイル体験）、**状態管理の適正化**（バグ防止）に大別されます。

1.  **High Priority (Core Integrity & Mobile)**:
    -   (Completed) `WorkspaceDropdown` Mobile overflow
    -   (Completed) `FilterEditModal` Logic deduplication
    -   (Completed) `AccountSettingsTab` useAuth
    -   (Completed) `TimeBlockEditModal` Overlap check

2.  **Medium Priority (UX & Maintainability)**:

    -   (Completed) Modal error display enhancement (Standardized `ErrorMessage` component)
    -   (Completed) Accessibility (`aria-label`, `aria-hidden`)
    -   (Partial) Keyboard Navigation (Focus trap in Modals is present, further improvements possible)

3.  **Low Priority (Visual Polish)**:
    -   ホバーエフェクト、アニメーション強化、アイコン差し替え

### Detailed Task List by Component

#### src/components/sidebar/WorkspaceDropdown.tsx



#### src/components/modals/AccountSettingsTab.tsx



#### src/components/modals/FilterEditModal.tsx

- [x] ロジック重複排除 (parseFilterQuery 共通化) - Completed




#### src/components/modals/LabelEditModal.tsx






#### src/components/modals/SettingsModal.tsx




#### src/components/modals/TaskDetailModal.tsx
- [ ] Markdownプレビューにproseクラス使用だが、テーブルやコードブロック対応不足 → カスタムprose設定またはsimpleMarkdownToHtmlの強化検討
- [ ] 期限日入力がtype="date"でネイティブピッカー → カスタムカレンダー検討（将来的）

#### src/components/modals/TimeBlockEditModal.tsx


---

## 📝 Design Decisions (WontFix / By Design)

- **Legacy Exports**: `auth.ts` の関数エクスポートはシングルトンへのプロキシとして維持（API一貫性のため）。
- **Inline Styles**: 色指定（`block.color`）などの動的スタイルには Tailwind ではなくインラインスタイル（`style` 属性）を使用。
- **SidebarSection ID Logic**: モバイル初期状態は折りたたみをデフォルトとする。

---

## 🔄 Previously Resolved
(History removed as requested. See Git log.)