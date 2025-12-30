# TaskMg プロジェクト状況ドキュメント

**最終更新**: 2025-12-30

---

## 🏗️ 技術スタック

| カテゴリ | 技術 | バージョン |
|----------|------|------------|
| **フレームワーク** | React | 18.3.1 |
| **ビルドツール** | Vite | 6.0.0 |
| **言語** | TypeScript | 5.9.3 |
| **状態管理** | Zustand | 5.0.9 |
| **スタイリング** | Tailwind CSS | 3.4.3 |
| **バックエンド** | Firebase Firestore | 10.14.1 |
| **デプロイ** | Cloudflare Workers | wrangler 4.56.0 |
| **バリデーション** | Zod | 4.2.1 |
| **D&D** | @dnd-kit | core 6.3.1, sortable 10.0.0 |

---

## 📁 ディレクトリ構造

```
src/
├── App.tsx              # React アプリケーションルート
├── main.tsx             # エントリーポイント
├── index.css            # グローバルスタイル
│
├── components/          # ★ React コンポーネント (新アーキテクチャ)
│   ├── common/          # Modal.tsx, SortableItem.tsx
│   ├── modals/          # ModalManager, SettingsModal, TaskDetailModal
│   ├── sidebar/         # BasicFilters, LabelList, ProjectList, Sidebar
│   └── tasks/           # TaskItem, TaskList, AddTaskButton
│
├── ui/                  # ⚠️ Vanilla TS UI (旧アーキテクチャ - 移行対象)
│   ├── modals/          # task-modal.ts, modal-dom-generator.ts など
│   ├── features/        # sidebar, target-dashboard, wiki
│   ├── core/            # design-system, ui-settings-manager など
│   ├── layout/          # レイアウト制御
│   └── settings/        # 設定画面
│
├── store/               # データストア
│   ├── schema.ts        # Zod スキーマ & 型定義
│   ├── store.ts         # 公開API
│   ├── store-raw.ts     # Firestore CRUD
│   ├── ui/modal-store.ts # モーダル状態 (Zustand)
│   └── *.ts             # projects, labels, timeblocks, workspace
│
├── hooks/               # カスタムフック
│   ├── useLabels.ts
│   ├── useProjects.ts
│   └── useTasks.ts
│
├── core/                # コア機能
│   └── firebase.ts, auth.ts
│
├── logic/               # ビジネスロジック
└── utils/               # ユーティリティ
```

---

## ⚠️ 二重構造問題

プロジェクトには**2つのUI層**が混在しています：

| 層 | パス | 方式 | 状態 |
|----|------|------|------|
| **React (新)** | `src/components/` | JSX + Zustand | 推奨 |
| **Vanilla TS (旧)** | `src/ui/` | 手動DOM操作 + innerHTML | 非推奨・移行対象 |

### 移行優先度

| ファイル | 問題 | 優先度 |
|----------|------|--------|
| `ui/modals/modal-dom-generator.ts` | HTML文字列生成、XSS脆弱性 | 🔴 高 |
| `ui/modals/task-modal.ts` | Vanilla DOM制御 | 🔴 高 |
| `ui/features/sidebar/sidebar-drag-drop.ts` | 独自D&D実装 | 🟡 中 |
| `ui/modals/*.ts` (他) | HTML文字列パターン | 🟡 中 |

---

## 🔄 JS → TS 移行状況

- **JSファイル**: 0件 ✅ (移行完了)
- **TSファイル**: 多数 (型定義の厳密さは要レビュー)

---

## 📊 モーダルシステム

### React版 (推奨)
```typescript
// src/store/ui/modal-store.ts
type ModalType = 'settings' | 'task-detail' | 'create-project' | null;

// 使用例
const { openModal, closeModal } = useModalStore();
openModal('task-detail', task);
```

### Vanilla版 (非推奨)
```typescript
// src/ui/modals/task-modal.ts
showTaskModal(task);  // innerHTML で DOM 生成
closeTaskModal();
```

---

## 🎯 改善タスク

### モーダルシステム
- **現状**: すべてのモーダル（タスク、ラベル、プロジェクト、ワークスペース、フィルター、時間帯、設定）が React/JSX 移行済み。
- **管理**: `useModalStore` (Zustand) と `ModalManager.tsx` による一元管理。
- **バニラJS互換性**: `modal-store.ts` のヘルパー関数を通じて非Reactコードからも呼び出し可能。
- [ ] スケジュール設定 (dueDate, recurrence)
- [ ] 時間帯選択 (timeBlockId)
- [ ] 所要時間選択 (duration)
- [ ] Markdown メモ & プレビュー
- [ ] ラベル選択

### Phase 2: 旧モーダル削除
- [ ] `modal-dom-generator.ts` 削除
- [ ] `task-modal.ts` 削除
- [ ] 関連ファイルのインポート修正

### Phase 3: D&D 統一
- [ ] `sidebar-drag-drop.ts` → @dnd-kit 移行検討

---

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# デプロイ
npm run deploy
```

---

## 📝 備考

- `tsconfig.json`: `strict: true`, `allowJs: true`
- エイリアス: `@` → `./src`
- 状態管理: React Query (`@tanstack/react-query`) も依存に含むが用途未確認
