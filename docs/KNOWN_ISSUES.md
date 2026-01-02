# TaskMg Known Issues & Roadmap

## 🚀 残存課題

### 【優先度: 高】アーキテクチャ・型安全性の債務
- **レイヤー分離の不徹底 (-raw.ts の欠如)**: `store/timeblocks.ts`, `store/filters.ts` など、一部のストアで Firestore インフラ層とビジネスロジックが分離されておらず、設計思想 (`PROJECT_STATUS.md`) から乖離している。
- **機能実装の不備 (Optimistic Update/Validation)**:
    - `store/timeblocks.ts` において、設計思想で謳われている「Optimistic Update」が未実装であり、保存時の Zod によるランタイムバリデーションも欠如している。
    - `store/projects.ts` および `store/labels.ts` においても、`xxxSchema.safeParse()` による書き込み前のバリデーションが実施されていない。

### 【優先度: 中】UI/UXリファクタリング課題
- **原子コンポーネント（Atoms）の適用漏れ**: `SettingsModal.tsx` 等で、共通の `Select` や `Input` コンポーネントを使用せず、生の HTML 要素に Tailwind クラスを直接指定している。
- **言語切り替え時の強制プリセット更新**: `settings-store.ts` の `setLanguage` にて、ユーザーが設定した density や fontSize を上書きしてしまう挙動の検討。
- **統一シグネチャの不徹底**: 設計思想 (#81) では全 subscribe 関数を `(workspaceId, callback)` 形式に統一するとしているが、`store/targets.ts` などで依然として引数パターンが複数存在し、複雑化している。
- **ロジックの重複と散在**: `DashboardApp.tsx` で独自の `formatDate` が定義されているなど、`utils/` 配下の共通関数を使用せず、コンポーネント内に閉じているロジックが散見される。

---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: 主要なモーダルおよびサイドバーの大部分の対応完了。残るはUIラベルの統一とエラーメッセージ等。
- **Firestore制約**: `WorkspaceEditModal` 等でのサーバー側ユニーク制約の検討。
- **定数値の集約**: 引き続きマジックナンバーの抽出を進める。

---

## 🎨 UI/UXリファクタリング課題 (Design Compliance)

`docs/PROJECT_STATUS.md` の「🎨 UI/UX 設計思想」に基づくリファクタリング対象。


### 【優先度: 中】サイドバーコンポーネントの改善

> **修正方針**: 以下は`tsc --noEmit`エラーにならない限りコンパイルは通るが、設計原則違反のためリファクタリング対象。

#### CustomFilterList.tsx
| 項目 | 現状 | 対応 |
|------|------|------|
| (なし) | - | - |

#### Dashboard
| 項目 | 現状 | 対応 |
|------|------|------|
| (なし) | - | - |

### 【優先度: 高】アーキテクチャ・型安全性の債務

> **修正方針**: 設計思想 (`PROJECT_STATUS.md`) との乖離が大きい項目。

| カテゴリ | 課題内容 | 影響 |
|----------|----------|------|
| **アトミックデザイン** | `Button`, `Input` 等の汎用的な「原子」コンポーネントが不足。 | `src/components/ui` に `Button`, `Input`, `Select`, `Textarea` を作成し、`TaskDetailModal` を含む全主要モーダル (`Settings`, `ProjectEdit` 等) に適用完了。 |
| **アイコン管理** | `Icons.tsx` による一元管理が主要コンポーネントで完了。 | 汎用 `Icon` コンポーネントを用い、`Sidebar`, `AppLayout`, `TaskList` 及び主要モーダルでのハードコードをほぼ解消。 |
| **タイムアウト制御** | `useFirestoreSubscription` のデフォルト待機時間を 10秒→5秒に短縮し、オプションで指定可能に変更。 | 以前よりUXが向上。必要に応じて各フック呼び出し側で `timeout` オプションを指定可能。 |
| **所要時間（Duration）のカスタマイズ** | 以前は固定値（30, 45, 60...）のみ。 | `src/store/ui/settings-store.ts` に `customDurations` ステートを追加し、設定画面でカスタマイズ可能にし、`DurationList` に反映させるように変更完了。 |

### 【優先度: 低】アイコン統一性
| 項目 | 現状 | 判定 |
|------|------|------|
| 絵文字アイコン | BasicFilters/CustomFilterListで絵文字使用 | **長期検討**: Lucide導入は依存関係増加のため、アイコン数が増えた時点で再検討。現状は許容。 |
| 手書きSVG | DurationItem等で独自SVG | **By Design**: 軽量実装として現状維持（Icons.tsxと同様の理由） |

---

## 📋 リファクタリング時の注意事項

1. **アニメーション削除時**: `transition-*`、`duration-*`、`animate-*`クラスを削除。静的表示に変更。
2. **影の削減時**: `shadow-2xl`→`shadow-md`→`shadow`の順で控えめに。完全削除も可。
3. **i18n対応時**: `src/core/translations.ts`にキーを追加し、`t('key')`で参照。
4. **アクセシビリティ**: `aria-expanded={isOpen}`、`aria-controls="panel-id"`を追加。
5. **By Design除外**: `SortableItem.tsx`の`isDragging`時opacity変更はDnDフィードバックとして必要最小限のため現状維持を検討。

---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。
- **Localization Consistency (Work in Progress)**: 現在、日本語と英語が混在している箇所があるが、これは完全な i18n 移行への過渡期としての状態。
- **Facade Pattern (Data Flow)**: `store-raw.ts` は内部実装とし、外部からは `tasks.ts` 等のファサード関数を通じてのみアクセス。単一方向データフローを強制。
- **Optimistic Update with Rollback**: 失敗時は自動ロールバックとToast通知でユーザーに通知。
- **Modal Stack**: `ModalManager`はスタック方式で複数モーダルの重ね表示をサポート。これは設定画面からラベル編集を開く等のユースケースで必要。
- **Custom SVG Icons**: `Icons.tsx`は3つのみの軽量実装のため、Lucide等の外部ライブラリ追加より効率的。

---

## 🧪 Browser Test Plan (Last Run: 2026-01-02)

### 1. Loading & Cache Behavior
- [x] **初期ロード**: アプリを開いた際、Loadingスピナーが一瞬だけ（または全く）表示されず、キャッシュデータが即座に表示されること。
- [x] **ワークスペース切り替え**: サイドバーでワークスペースを切り替えた際、スムーズに新しいデータに切り替わること。
- [x] **リロード**: ページをリロードした際、Loading状態を表示してFirebaseセッションを復元。ログイン画面が一瞬表示される問題を解消。

### 2. Internationalization (i18n)
- [x] **日本語表示**: サイドバーのプロジェクト一覧が空の場合「プロジェクトはありません」、所要時間リストが「15分」のように表示されること。
- [ ] **英語切り替え**: 設定から言語を英語に切り替え、上記箇所が「No projects」「15 min」等に即座に切り替わること。(※多くのラベルが未対応)

### 3. Basic Regressions
- [x] **タスク操作**: タスクの追加、編集、削除がエラーなく動作すること。
- [x] **DnD**: タスクの並び替えがスムーズに行えること。
- [x] **コンソールエラー**: 開発者ツールのConsoleに重大なエラーが出ていないこと。
- [x] **検索体験刷新**: モダンなグラスモーフィズムデザインで検索画面を刷新。サイドバーからのみ検索にアクセス。
- [x] **Fire-and-Forget改善**: `updateTaskStatusRaw`, `updateTaskRaw`, `deleteTaskRaw` に失敗時ロールバックとToast通知を追加。
