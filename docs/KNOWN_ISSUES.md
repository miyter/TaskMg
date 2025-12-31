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

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **FilterType の責務混在** | `'wizard'`, `'target-dashboard'`, `'wiki'` などビュー切り替え用途が混入 | ViewType を別の型/ストアに分離 | 中 |
| **検索後のquery残存** | `setSearchQuery` で `filterType: 'search'` に変更後、別フィルタ選択時も query が残る | `setFilter` 時に `query: ''` をリセット（現状対応済かも） | 低 |

#### `src/store/ui/modal-store.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **新旧方式の混在** | `activeModal`/`modalData` (deprecated) と `stack` 方式が併存 | 完全に stack ベースへ移行し、古いプロパティを削除 | 中 |
| **UUIDフォールバックの脆弱性** | `Math.random().toString(36)` は衝突可能性あり | `crypto.randomUUID` が使えない環境向けに別の堅牢なID生成を検討 | 低 |



#### `src/store/ui/settings-store.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **fontEn/fontJp非永続化の理由不明** | コメントアウトで非永続化されているが理由不明 | コメントで意図を明記、または復活判断 | 低 |
| **ThemeMode 'system' のリアルタイム非対応** | OS設定変更時に再読み込み必要 | `matchMedia` リスナーでリアルタイム反映 | 低 |

#### `src/store/ui/ui-store.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **SidebarDensity 型の重複** | `settings-store.ts` の Density と重複 | 共通型に統合 | 低 |
| **sidebarWidth のモバイル非対応** | デバイス/画面サイズごとのレスポンシブ対応なし | 画面幅に応じたデフォルト値または上限設定 | 低 |

#### `src/store/ui/workspace-store.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **Zodバリデーション未実施** | 無効データがストアに入る可能性 | `WorkspaceSchema.parse()` でバリデーション | 低 |

---

### Coreモジュール

#### `src/core/auth.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **initialToken取得の重複** | `window.GLOBAL_INITIAL_AUTH_TOKEN` と `__initial_auth_token` の両方チェック | 環境検出を一元化 | 低 |
| **initAuthListener の多重登録防止なし** | 複数回呼び出し時の防止策がない | モジュールレベルでフラグ管理またはシングルトン化 | 低 |

#### `src/core/firebase.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **import.meta.env の型キャスト** | `(import.meta as any).env` で型安全性を損なう | Vite の `ImportMetaEnv` 拡張を正しく設定 | 低 |
| **apiKeyチェックのみ不十分** | 他の必須フィールド（projectId等）の検証なし | 必須フィールドを明示的にチェック | 低 |

#### `src/core/event-constants.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |

| **イベント detail 型の散在** | 将来的に管理が煩雑 | ジェネリクスまたはユニオン型で一元管理 | 低 |

#### `src/core/ui-constants.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |

| **BREAKPOINT_MD のハードコード** | Tailwind ブレークポイントとの整合性未確認 | Tailwind config から参照または整合性確認 | 低 |
| **SidebarDensity の重複定義** | `DENSITY_CLASSES` と `DENSITY_LEVELS` で重複 | Single Source of Truth へ統合 | 低 |

#### `src/core/firebase-sdk.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **未使用エクスポートの存在** | `deleteUser`, `linkWithCredential` 等が未使用 | 必要最小限に絞るか、将来使用予定としてコメント | 低 |

---

### Hooks

#### `src/hooks/useAppDnD.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **ハードコードプレフィックス依存** | `'task:'` のプレフィックスでタスク判定 | 定数化またはタイプガード関数に抽出 | 低 |

#### `src/hooks/useFilters.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |


#### `src/hooks/useLabels.ts`

| 項目 | 詳細 | 改善案 | 優先度 |
| :--- | :--- | :--- | :--- |
| **workspaceId の空文字フォールバック** | `workspaceId || ''` が不自然 | ラベルが workspace 非依存なら引数自体を削除検討 | 低 |
| **workspace切り替え時の無駄な再購読** | ラベルが workspace 非依存なら不要な処理 | 依存関係を整理し、不要な再購読を回避 | 低 |




