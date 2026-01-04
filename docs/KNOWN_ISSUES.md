# TaskMg 残存課題 (Known Issues)

## 🚀 残存課題

> [!IMPORTANT]
> 修正にあたっては `docs/PROJECT_STATUS.md` の「UI/UX 設計思想」を必ず参照し、情報の高密度化とミニマリズムを両棲させてください。

---



## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: バリデーションメッセージの翻訳基盤は整備済み。残る細かいハードコードは発見次第修正。

- **UIコンポーネントの標準化 (Atomic Design)**: `TaskDetailModal.tsx` などの大型コンポーネント内に生の HTML やインラインスタイル、独自のアイコン実装が散見される。`components/ui/` 以下の標準コンポーネントへの置き換えを進める。
- **レンダリングパフォーマンスの最適化**: モバイル端末等でのテーマ切り替えやフォント適用時に、CSS 変数の操作による強制リフロー（Forced Reflow）が発生する可能性がある。
    - 指針: React 18 の `startTransition` や `useDeferredValue` を活用した状態更新のバッチ化。CSS 変数の操作には `:root` への一括反映と `requestAnimationFrame` を併用する。



- **Optimistic UI 実装の非一貫性**: 「保存 -> 更新 -> 失敗時にリトライ/ロールバック」という共通パターンを、再利用可能なユーティリティとして抽出する余地がある。


- **ハードコードされた文字列の残存**: 静的な title/aria-label 属性の i18n 化はほぼ完了。動的キー (colors, theme, density 等) は設計上キャストが必要。
- **バリデーションロジックの二重管理**: UI 層での手動チェックと Zod スキーマ検証の重複解消。`validateWithSchema` 等への集約。
- **デザインシステムの整合性と抽象化**: `index.css` における `!important` の多用や、コンポーネント内でのハードコードされた Tailwind クラスの使用。グローバル定数（`--modal-p` 等）への完全移行が必要。
- **アイコン実装の一貫性**: `Icons.tsx` によるローカル定義への統一はほぼ完了。
- **エラーロギングの永続化**: `ErrorLogger` がメモリ内バッファのみで動作しており、リロード時にログが消失する。Firestore への保存実装。
- **パス生成と認証の過剰設計**: `getAppId` や初期トークンログインなど、特定の環境に依存した複雑なロジックの整理と標準化。





---


## 💡 実装上のヒント (Technical Implementation Hints)

- **データ制約**: `src/store/schema.ts` の Zod スキーマに `.max()` を追加し、API層でのバリデーションを徹底する。UI層（`Input.tsx`等）でも `maxLength` 属性を併用する。

- **型安全性の強化 (Zod & i18n)**:
    - `z.ZodErrorMap` 型を明示的に定義し、`z.ZodIssueOptionalMessage` を返すカスタムエラーマップを作成する。
    - `any` を Zod スキーマからの推論型 (`z.infer`) やジェネリクスに置き換え、`@typescript-eslint/no-explicit-any` ESLint ルールでガードする。
- **Atomic Design の厳格な運用**:
    - `atoms/`, `molecules/`, `organisms/` 間の依存関係（例: atoms は organisms をインポート不可）を ESLint や `dependency-cruiser` で検出し、階層構造を維持する。
    - Vite エイリアス（`@atoms/` 等）を活用し、インポートパスから階層を明示的に認識できるようにする。
- **テーマ更新の最適化**:
    - CSS 変数（CSS Variables）を優先し、インラインスタイルを避ける。
    - フォントのプリロードと `font-display: swap` を設定し、フォント読み込みによるレイアウトシフトを最小限に抑える。
- **アクセシビリティ (Label 関連付け)**:
    - `<label>` がフォームフィールドに関連付けられていない場合、`<input>` を `<label>` 内にネストするか、`<label>` の `for` (React では `htmlFor`) 属性とフィールドの `id` を一致させることで解決する。

