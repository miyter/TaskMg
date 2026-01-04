# TaskMg 残存課題 (Known Issues)

## 🚀 残存課題

> [!IMPORTANT]
> 修正にあたっては `docs/PROJECT_STATUS.md` の「UI/UX 設計思想」を必ず参照し、情報の高密度化とミニマリズムを両棲させてください。

---

## 🐛 Active Bugs




---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: バリデーションメッセージの翻訳基盤は整備済み。残る細かいハードコードは発見次第修正。

- **UIコンポーネントの標準化 (Atomic Design)**: `TaskDetailModal.tsx` などの大型コンポーネント内に生の HTML やインラインスタイル、独自のアイコン実装が散見される。`components/ui/` 以下の標準コンポーネントへの置き換えを進める。
- **レンダリングパフォーマンスの最適化**: モバイル端末等でのテーマ切り替えやフォント適用時に、CSS 変数の操作による強制リフロー（Forced Reflow）が発生する可能性がある。
    - 指針: React 18 の `startTransition` や `useDeferredValue` を活用した状態更新のバッチ化。CSS 変数の操作には `:root` への一括反映と `requestAnimationFrame` を併用する。
- **データキャッシュの冗長性**: `FirestoreCollectionCache` (手動管理) と React Query のキャッシュが重複しており、メモリ使用量と複雑さを増大させている。
- **購読ロジックの重複**: `onSnapshot` 購読のボイラープレートが各 `*-raw.ts` ファイルに分散している。基底クラスまたは共通の購読エンジンへの集約が必要。
- **日付処理の断片化**: Firestore Timestamp と JS Date の相互変換ロジックが各所に散在し、標準化されていない。
- **Optimistic UI 実装の非一貫性**: 「保存 -> 更新 -> 失敗時にリトライ/ロールバック」という共通パターンを、再利用可能なユーティリティとして抽出する余地がある。

- **比較ロジックの独自実装**: `compare.ts` 内でエンティティごとに比較関数を記述している。汎用的なディープイコールへの移行が望ましい。
- **アクセシビリティの向上 (A11y)**: 一部のコンポーネントで `<label>` がフォームフィールドに関連付けられていない問題。スクリーンリーダー利用時の利便性を損なうため順次修正する。
- **UI実装の重複と非一貫性**: `TaskDetailModal.tsx` 等における重複した存在チェックロジックの整理。
- **ハードコードされた文字列の残存**: 静的な title/aria-label 属性の i18n 化はほぼ完了。動的キー (colors, theme, density 等) は設計上キャストが必要。
- **バリデーションロジックの二重管理**: UI 層での手動チェックと Zod スキーマ検証の重複解消。`validateWithSchema` 等への集約。
- **デザインシステムの整合性と抽象化**: `index.css` における `!important` の多用や、コンポーネント内でのハードコードされた Tailwind クラスの使用。グローバル定数（`--modal-p` 等）への完全移行が必要。
- **アイコン実装の一貫性**: `Icons.tsx` によるローカル定義への統一はほぼ完了。
- **エラーロギングの永続化**: `ErrorLogger` がメモリ内バッファのみで動作しており、リロード時にログが消失する。Firestore への保存実装。
- **パス生成と認証の過剰設計**: `getAppId` や初期トークンログインなど、特定の環境に依存した複雑なロジックの整理と標準化。
- **i18n ユーティリティの型安全性**: `resolve` 関数における `any` 型排除完了。動的キーを扱う箇所は `as I18nKeys` でキャスト。
- **日付処理の二重化と一貫性の欠如**: `date.ts` (レガシー/日本語ハードコード) と `date-tz.ts` (モダン/タイムゾーン対応) が併存している。全てのコードを `date-tz.ts` 相当の実装へ移行し、`date.ts` を廃止する必要がある。
- **認証状態管理の分散**: `App.tsx` 内で `onAuthStateChanged` を直接監視しており、`useAuth.ts` や `AuthService` と役割が重複・分散している。
- **命令的な DOM 操作によるパフォーマンス懸念**: `useThemeEffect.ts` 等で `document.body.classList` を反映しており、React の宣言的なパラダイムから外れ、レイアウトスレッシングを誘発する恐れがある。
- **DOM 構造への依存**: モーダル表示の判定を `document.querySelector` で行うなど、React のステート管理を介さない脆弱な実装の改善。



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

