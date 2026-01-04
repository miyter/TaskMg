# TaskMg 残存課題 (Known Issues)

## 🚀 残存課題

> [!IMPORTANT]
> 修正にあたっては `docs/PROJECT_STATUS.md` の「UI/UX 設計思想」を必ず参照し、情報の高密度化とミニマリズムを両棲させてください。

---

### 🏎️ Performance (Mobile Lighthouse)

- **Lighthouse/LCP**:
    - **Critical Request Chain**: `initializeAuth` と `browserLocalPersistence` の明示的利用により iframe 依存を軽減し、初期ロードを最適化。(Status: Optimized)

---

## 🐛 Active Bugs

現在、重大なバグはありません。

---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: 数値フォーマットの統一 (`formatNumber`, `formatCurrency`) を実装し、主要コンポーネント (`TaskStats`, `LabelItem`) に適用完了。通貨フォーマットは未使用だが基盤は整備済み。
- **定数値の集約**: 主要な `z-index` と `DEFAULT_COLORS` の集約完了。残るハードコード値は随時リファクタリングする方針。

---

## 🔧 Architectural Debt (Store Layer)

> [!NOTE]
> 以下はGrokによるコードレビュー結果（2026-01-03）を精査・整理したもの。

### Hooks Layer (`src/hooks/use*.ts`)

**共通問題**: `subscribeFn` と loading ロジック（`authLoading && isCacheReady`）がほぼ同一で重複。

| 対象ファイル | 現状の問題点 |
|---|---|
| `useTasks.ts` | userId/workspaceId ガードが hooks 層に混在。`useFirestoreSubscription` のキー配列が動的で不安定。 |
| `useLabels.ts` | 同上。`isCacheReady` の計算で初期化競合リスク。 |
| `useProjects.ts` | React Query と Store キャッシュの二重管理で不整合リスク。 |

**推奨対応**: ジェネリックな `useFirestoreEntity<T>` フックへの共通化

---

### ⚡ 対応優先度

1. **中**: Hooks Layer の共通化（`useFirestoreEntity<T>`）
