## 🚨 Critical Issues (Grok Code Review 2025-12-31)

以下の課題は、AIエージェントによるコードレビューで検出された重要項目です。優先的に解消してください。

### 1. Multi-Workspace & Store Architecture
- **Path Logic**: `filters` and `labels` は `userId` 配下に保存されているが、真のマルチワークスペース対応には `workspaceId` スコープが必要。

### 2. UI/UX & Responsive Design
- **Mobile**: キーボードショートカット `/` はモバイルで動作しない（想定内）。
- **Navigation**: `currentView` の永続化がURL/Router状態と非同期になり、ブラウザ履歴が不整合になる。
- **Feedback**: 残りのStoreにToastエラー統合が必要（`filters.ts`は対応済み）。

---

## 🔧 Hooks Layer Issues (Grok Code Review 2026-01-01)

### 🔴 High Priority（品質・堅牢性に直結）

#### 1. `mounted`フラグパターンの刷新
#### 1. `mounted`フラグパターンの刷新
- **Status**: Resolved (2026-01-01) - 全対象フック（useTimeBlocks, useTargets, useProjects, useLabels, useFilters, useTasks）を `useRef` / `isCancelled` パターンに移行完了。



#### 2. 認証監視の責務分散
- **Status**: Resolved (2026-01-01) - `useAuth` フックを作成し、`useWorkspace` と `useWorkspaces` で共通利用するようにリファクタリング完了。

#### 3. ログアウト時のデータクリア漏れ
- **Status**: Resolved (2026-01-01) - `useWorkspaces` にて `!userId` 時に `setWorkspaces([])` を実行するよう修正済み。


#### 4. エラー発生時の `loading` 永続化リスク
- **Status**: Resolved (2026-01-01) - `TaskCache.subscribe` および `subscribeToTargets` に `onError` コールバックを追加し、フック側でエラー時に `setLoading(false)` するよう修正完了。


---

### 🟡 Medium Priority（UX・保守性向上）

#### 5. Stale Data Flicker（古いデータの一瞬表示）
- **Status**: Resolved (2026-01-01) - `useTimeBlocks.ts`, `useFilters.ts` にて `useLayoutEffect` を使用し、ワークスペース変更時に同期的に状態をリセットするよう修正。

#### 6. テーマ適用時のちらつき
- **Status**: Resolved (2026-01-01) - `useThemeEffect` にリネームし、`useLayoutEffect` を使用するよう修正。

#### 7. フック名とファイル名の不一致
- **Status**: Resolved (2026-01-01) - `useApplyTheme` を `useThemeEffect` にリネームし統一。


#### 8. 検索バッジとフィルタ表示の不整合
- **Status**: Resolved (2026-01-01) - `useTaskCounts.ts` で検索一致（`acc.search`）は全ステータス（アーカイブ除外）を対象とし、他バッジ（Today等）は完了済みを除外することで仕様を明確化。


---

### 🟢 Low Priority（長期的改善）

#### 9. ハードコード値の定数化
- **Status**: Resolved (2026-01-01) - `UI_CONFIG.DND.TOUCH_DELAY` などを定義し、`useAppDnD.ts` で使用。

#### 10. 密度クラスのスコープ明確化
- **Status**: Resolved (2026-01-01) - `UI_CONFIG.SIDEBAR_DENSITY` を定義し、`ui-utils.ts` での使用箇所を修正完了。



#### 11. TanStack Query への移行検討
**対象**: `useProjects.ts`, `useTasks.ts`
- **問題**: リアルタイム性とキャッシュ管理の複雑さからカスタム実装が肥大化。
- **解決策**: 長期的に TanStack Query への移行を検討。ただし、リアルタイム購読との統合方法を事前調査。

#### 12. グローバル density と sidebar density の統合
**対象**: `useThemeEffect.ts`
- **問題**: `setSidebarDensity(density)` で UIStore を更新しているが、グローバル density と sidebar density が分離されている設計の臭い。
- **解決策**: 長期的に stores を統合すべきか検討。

#### 13. `useLabels.ts` の再購読問題
- **Status**: Resolved (2026-01-01) - auth依存を追加し、useRefパターンへ移行済み。


---

## 🌐 Core Layer Issues (Grok Code Review 2026-01-01)

### 🔴 High Priority（i18n・型安全性に直結）



#### 15. 認証処理のタイミング不安定
- **Status**: Resolved (2026-01-01) - `tryInitialTokenLogin` を Promise として制御し、`useAuth` で待機するよう修正。

#### 16. `@ts-ignore` / 不正なキャストの除去
- **Status**: Resolved (2026-01-01) - `declare global` による型定義を信頼し、不正なキャストを削除。


---

### 🟡 Medium Priority（保守性・UX向上）

#### 17. 翻訳キーのネスト構造化
- **Status**: Resolved (2026-01-01) - `src/core/translations.ts` で `msg.*` および `sidebar.*` などのネスト構造を導入し、`getTranslator` でドット記法をサポート。


#### 18. `getTranslator` のメモ化
- **Status**: Resolved (2026-01-01) - `useTranslation` 内で `useMemo` を使用して翻訳関数をメモ化完了。


#### 19. Firebase設定取得ロジックの簡素化
- **Status**: Resolved (2026-01-01) - `src/core/firebase.ts` で `import.meta.env` の型注釈を追加しつつロジックを整理。

#### 20. 本番環境でのコンソールログ抑制
- **Status**: Resolved (2026-01-01) - `src/core/firebase.ts` 初期化ログを `import.meta.env.DEV` でガード。


#### 21. 未使用エクスポートの削除
- **Status**: Resolved (2026-01-01) - `src/core/firebase-sdk.ts` から `linkWithCredential`, `EmailAuthProvider` 等の未使用エクスポートを削除。


---

### 🟢 Low Priority（長期的改善）

#### 22. カスタムイベントシステムの刷新
**対象**: `src/core/event-constants.ts`
- **問題**: カスタムイベントシステムより Zustand slice や Mitt の方が型安全。
- **解決策**: 長期的に型安全な Pub/Sub への移行を検討。

#### 23. 翻訳の英語混在削除
- **Status**: Resolved (2026-01-01) - 日本語訳中の「(Targets)」や「(Language)」などの英語併記を削除。


#### 24. Legacy Exports の統一
- **Status**: Resolved (2026-01-01) - `auth.ts` にてシングルトンへのプロキシとして実装済み（後方互換性維持）。


---

## 🎨 Sidebar Components Issues (Grok Code Review 2026-01-01)

### 🔴 High Priority（レスポンシブ・アクセシビリティ）



#### 26. `WorkspaceDropdown` のレスポンシブ対応
- **Status**: Resolved (2026-01-01) - `max-w` 設定によるテキスト省略と、ドロップダウン自体の幅調整に対応済み。

#### 27. タッチデバイスでの hover 依存アクション
- **Status**: Resolved (2026-01-01) - `SidebarSection` でモバイル時は常にアクションを表示し、ホバーのみの挙動をデスクトップ（`md:`）に限定。


---

### 🟡 Medium Priority（型安全性・パフォーマンス）

#### 28. `TimeBlockList.tsx` の型安全性向上
- **Status**: Resolved (2026-01-01) - `any` 型を排除し、`Task`, `TimeBlock` 型を適用。

#### 29. タスクカウント計算の最適化
- **Status**: Resolved (2026-01-01) - `TimeBlockList` で `useMemo` を使用して一括計算するよう最適化。


#### 30. `SidebarSection.tsx` の sectionId 生成の安全性
- **Status**: Resolved (2026-01-01) - `encodeURIComponent` を使用して日本語を含むタイトルから安全なIDを生成するように修正。
UUID やハッシュ化、または title の正規化（`encodeURIComponent` 等）を強化。

#### 31. SVGアイコンの共通化
- **Status**: Resolved (2026-01-01) - `src/components/common/Icons.tsx` を作成し、`TargetList.tsx` のインラインSVGを置換。

#### 35. 検索入力クラスの抽出
- **Status**: Resolved (2026-01-01) - `SidebarSearch.tsx` 内で `INPUT_CLASSES` 定数として抽出。


---

### 🟢 Low Priority（細かいUX改善）

#### 32. モバイルでの初期折りたたみ
- **Status**: Resolved (2026-01-01) - `SidebarSection.tsx` で画面幅 (`< 768px`) を検知し、モバイル時は初期状態で折りたたむよう修正。

#### 33. `SidebarItem.tsx` の count 表示仕様
- **Status**: Resolved (2026-01-01) - `showZero` プロパティを追加し、明示的に指定された場合は `0` カウントも表示できるよう修正。


#### 34. インラインスタイルのTailwind化
**対象**: `TimeBlockList.tsx`
- **問題**: `style={{ backgroundColor: block.color }}` でインラインスタイル使用。
- **解決策**: ユーザー定義の動的な色指定のため、インラインスタイルまたはCSS変数が適切。現状（`style` 属性）を維持する方針とする（Resolved as WontFix）。


#### 35. 検索入力クラスの抽出
**対象**: `SidebarSearch.tsx`
- **問題**: input のクラスが長大で可読性低い。
- **解決策**: 共通クラス（例: `input-search-sidebar`）を定義して抽出検討。

---

### 🤖 AI Agent Implementation Guide

**優先順序（全体）:**
1. **i18n対応** (High): `messages.ts` 統合、Sidebarコンポーネントの翻訳キー追加
2. **型安全性** (High): `@ts-ignore` 除去、`any` 型修正
3. **レスポンシブ** (High): ドロップダウン位置、タッチデバイス対応
4. **保守性** (Medium): 翻訳キーネスト化、未使用エクスポート削除
5. **パフォーマンス** (Medium): メモ化、カウント計算最適化
6. **長期改善** (Low): イベントシステム刷新、TanStack Query検討

**共通パターン適用時の注意:**
- `mounted` → `useRef` 置き換え時は、全対象ファイルで一括修正すると一貫性が保てる
- キャッシュ即時表示パターンは `useTasks.ts`, `useProjects.ts` を参考に統一
- エラーハンドリング追加時は `toast` 表示を統一（`t('error')` ではなく具体的なキー使用）
- i18n対応時は `useTranslation` フックを使用し、キーは `sidebar.workspace_add` 形式で統一

**未対応理由の記録:**
- `subscribeToLabels` のシグネチャ問題: ラベルがグローバルであるため現状維持。マルチワークスペース対応時に再検討。
- インラインスタイル `backgroundColor`: Tailwind の任意値クラスは動的値に非対応のため現状維持。

---

## ⏳ Previously Known Issues (Legacy)

### 備忘録
- **メンテナンスツール**: Settings > Advanced > Database Maintenance 実装済み。