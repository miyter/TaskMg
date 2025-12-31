# 既知の課題と改善候補

**最終更新**: 2025-12-31
**ステータス**: 🟢 概ね完了 (Quality Improvements in Progress)

すべての主要な不具合（Firebaseエラー、白抜けバグ）は解消されました。
現在は将来的な品質向上とUI/UXの一貫性向上のためのタスクが残っています。

## 🟢 優先度: 低 (将来的な品質向上・保守性)

| ファイル | 項目 | 詳細 | 改善案 |
| :--- | :--- | :--- | :--- |
| - | **ストア構成の洗練** | `store/` 配下のファイル構成が一部複雑 | バレルファイル (`index.ts`) への集約を徹底し、循環参照を回避する構造へ整理 |
| - | **グローバルキャッシュのクラス化** | `store-raw.ts` のモジュール変数キャッシュ | シングルトンクラスや Zustand ストアへ移行し、副作用を制御しやすくする |

---

## 📝 Grok コードレビュー (2025-12-31)

### Storeレイヤー



#### `src/store/tasks.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **toastメッセージの日本語固定** | 全エラーメッセージが日本語で多言語対応を阻害 | i18n対応または定数ファイルへ抽出 | 低 |

#### `src/store/index.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **循環依存リスク** | `export * from './schema'` と store-raw.ts 間の依存が不明瞭 | 依存グラフの可視化と整理、必要に応じて分離 | 低 |
| **workspaceId fallback の曖昧さ** | 引数と `getCurrentWorkspaceId()` のフォールバック混在で契約不明瞭 | 引数必須化またはフォールバック戦略の明確化 | 低 |

---

### UIストア

#### `src/store/ui/filter-store.ts`

*(特になし)*

#### `src/store/ui/modal-store.ts`

*(特になし)*

#### `src/store/ui/settings-store.ts`

*(特になし)*

#### `src/store/ui/ui-store.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **sidebarWidth のモバイル非対応** | デバイス/画面サイズごとのレスポンシブ対応なし | 画面幅に応じたデフォルト値または上限設定 | 低 |
#### `src/store/ui/workspace-store.ts`

*(特になし)*

---

### Coreモジュール

#### `src/core/auth.ts`

*(特になし)*

#### `src/core/firebase.ts`

*(特になし)*

#### `src/core/event-constants.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |

| **イベント detail 型の散在** | 将来的に管理が煩雑 | ジェネリクスまたはユニオン型で一元管理 | 低 |

#### `src/core/ui-constants.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |

| **BREAKPOINT_MD のハードコード** | Tailwind ブレークポイントとの整合性未確認 | Tailwind config から参照または整合性確認 | 低 |

#### `src/core/firebase-sdk.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **未使用エクスポートの存在** | `deleteUser`, `linkWithCredential` 等が未使用 | 必要最小限に絞るか、将来使用予定としてコメント | 低 |

---

### Hooks

#### `src/hooks/useAppDnD.ts`

*(特になし)*

#### `src/hooks/useFilters.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |


#### `src/hooks/useLabels.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **workspaceId の空文字フォールバック** | `workspaceId || ''` が不自然 | ラベルが workspace 非依存なら引数自体を削除検討 | 低 |
| **workspace切り替え時の無駄な再購読** | ラベルが workspace 非依存なら不要な処理 | 依存関係を整理し、不要な再購読を回避 | 低 |




