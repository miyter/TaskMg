# 既知の課題と改善候補

このドキュメントは、コードレビューで指摘された既知の技術的課題と将来の改善候補を記録します。
AIが新しいセッション開始時に参照することを想定しています。

**最終更新**: 2025-12-30

---

## � 概要（AI向けサマリー）

### 最優先で修正すべき問題
1. **search.ts の二重フィルタリング** - `filterTasks` と `getProcessedTasks` が重複・不整合。duration比較でバグあり。
2. **projects キャッシュ問題** - ワークスペース切り替え時にデータ混在。`Map` 構造に変更必須。
3. **TaskItem の JSON.stringify 比較** - パフォーマンス爆発リスク。shallow compare に変更必須。
4. **filterType 未実装** - `today/upcoming/important` が処理されていない機能欠落。

### 作業時の注意点
- `store.ts` の `auth.currentUser` 依存は、App.tsx の再マウントで救われているが、エッジケースあり。
- Zustand を使っているが、`useTasks`/`useProjects` は `useState` 管理。統一が望ましい。
- 型安全が不十分な箇所多数（`config: any`, `sortCriteria: string` など）。

---

## �🔴 優先度: 高（即時対応推奨）

### 1. search.ts - フィルタリングロジックの二重管理 ⚠️
| 項目 | 内容 |
|------|------|
| **ファイル** | `src/logic/search.ts` |
| **問題** | `filterTasks` と `getProcessedTasks` で同様のロジックが重複。**7つの不整合**あり。 |
| **バグ** | duration: 文字列比較 vs parseInt → **結果が異なる** |
| **対策** | `getProcessedTasks` 廃止。`filterTasks` + `sortTasks` に統一。 |

<details>
<summary>詳細な不整合リスト</summary>

1. **duration 比較**: `filterTasks` は文字列比較、`getProcessedTasks` は `parseInt` で数値比較 → **重大バグ**
2. **keyword 検索**: `filterTasks` は AND 検索 (every)、`getProcessedTasks` は単一 includes → 挙動不一致
3. **filterType 未対応**: `today/upcoming/important` が `getProcessedTasks` で未実装 → **機能欠落**
4. **filter-parser の価値半減**: `filterTasks` は savedFilter 経由でしか使われていない
5. **unassigned 対応**: `getProcessedTasks` のみ
6. **showCompleted 適用**: `getProcessedTasks` のみ
7. **config の型が any**: 型安全ゼロ
</details>

### 2. projects-raw.ts / projects.ts - キャッシュ構造問題
| 項目 | 内容 |
|------|------|
| **ファイル** | `src/store/projects-raw.ts`, `src/store/projects.ts` |
| **問題** | `_cachedProjects` が単一変数。ワークスペース切り替えでデータ混在。 |
| **比較** | `store-raw.ts` は `Map<string, Task[]>` を使用済み。 |
| **対策** | `Map<string, Project[]>` に変更。`getProjects(workspaceId)` に引数必須化。 |

### 3. TaskItem.tsx - JSON.stringify 比較
| 項目 | 内容 |
|------|------|
| **ファイル** | `src/components/tasks/TaskItem.tsx` |
| **問題** | `React.memo` で `JSON.stringify` 比較。タスク100件超で即体感劣化。 |
| **追加** | `dueDate` 表示が仮実装（`'Date'` 文字列を表示）。 |
| **対策** | shallow compare（`id, status, title, dueDate`）に変更。 |

### 4. useWorkspace.ts - userId 未提供
| 項目 | 内容 |
|------|------|
| **ファイル** | `src/hooks/useWorkspace.ts` |
| **問題** | `workspaceId` のみ返却。`userId` がない。`loading` 状態もない。 |
| **対策** | `useAuth` と統合、または `userId` + `loading` を返すよう拡張。 |

---

## 🟡 優先度: 中（次回作業時に対応）

### ストア関連
| ファイル | 問題 | 対策 |
|----------|------|------|
| `workspace.ts` | グローバル変数、Zodバリデーションコメントアウト | Zustand store へ移行検討 |
| `store-raw.ts` | JSON.stringify 比較のパフォーマンス | 大量データ時に shallow compare 検討 |
| `store-raw.ts` | deserializeTask のバリデーション不足 | 必須フィールドチェック追加 |
| `store-raw.ts` | エラーリカバリなし（再試行なし） | exponential backoff 導入 |
| `store.ts` | 認証状態変更時の再購読が手動 | App.tsx の再マウントで救済中 |

### フィルタ/ソート関連
| ファイル | 問題 | 対策 |
|----------|------|------|
| `filter-store.ts` | `filterType` (`today`等) が未処理 | search.ts 統一時に実装 |
| `filter-store.ts` | `sortCriteria` が `string` 型 | `SortCriteria` 型を共有 |
| `filter-parser.ts` | duration/date の値バリデーションなし | 数値/キーワードチェック追加 |

### フック関連
| ファイル | 問題 | 対策 |
|----------|------|------|
| `useProjects.ts` | `getCurrentWorkspaceId()` で非リアクティブ | `useWorkspace` フック使用に変更 |
| `useTasks.ts` | `loading` が workspaceId 変更時にリセットされない | `setLoading(true)` を useEffect 先頭に追加 |

---

## 🟢 優先度: 低（時間があれば対応）

### コード品質
| ファイル | 問題 | 対策 |
|----------|------|------|
| `store.ts` | バレルファイル肥大化 | ドメイン別バレル検討 |
| `store.ts` | エラーケースのログ出力なし | `console.warn` 追加 |
| `store-raw.ts` | グローバル変数による状態保持 | Zustand へ移行（マルチユーザー対応時） |
| `filter-parser.ts` | 未知プレフィックスがキーワードにフォールバック | 現状妥当。変更不要。 |
| `filter-parser.ts` | 重複キーワード未除去 | `Set` 使用 |
| `filter-parser.ts` | フレーズ検索未対応 | 機能拡張として検討 |

### UI/UX
| ファイル | 問題 | 対策 |
|----------|------|------|
| `AddTaskButton.tsx` | `aria-label` なし | アクセシビリティ追加 |
| `AddTaskButton.tsx` | 追加成功時のハンドリングなし | `onSuccess` コールバック追加 |
| `TaskList.tsx` | スクロール時の操作性 | sticky ヘッダー化 |

### ソート
| ファイル | 問題 | 対策 |
|----------|------|------|
| `sort.ts` | `criteria.split('_')` の型安全性 | `SortCriteria` union型で厳密定義 |
| `sort.ts` | null ソート順の明文化 | ドキュメント追記 |

---

## ✅ 対応不要（誤認または問題なし）

| 指摘 | 判断 |
|------|------|
| `addTaskRaw` の id delete を型で防ぐべき | 現状の `delete` で問題なし |
| `useTasks` に userId を渡していない | `store.ts` ラッパーが内部取得 |
| `toggleTaskStatus` が未定義 | `store/index.ts` に定義済み |

---
