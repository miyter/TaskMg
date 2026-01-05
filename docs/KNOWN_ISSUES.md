# TaskMg 残存課題 (Known Issues)

## 🚀 残存課題

> [!IMPORTANT]
> 修正にあたっては `docs/PROJECT_STATUS.md` の「UI/UX 設計思想」を必ず参照し、情報の高密度化とミニマリズムを両棲させてください。

### 🛡️ 可用性・スケール・堅牢性 (Availability & Robustness)

*(現在、既知の重大な課題はありません)*

### 🏎️ 実行時エラーと保守性のリスク (Runtime & Maintenance)

*(現在、既知の重大な課題はありません)*

---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: バリデーションメッセージの翻訳基盤は整備済み。残る細かいハードコード（UI上の "PJなし" 等）は発見次第修正。
- **型定義の厳密化 (:any の排除)**: `TaskItem` や各種モーダルでのデータ受け渡し、および `dnd-kit` 関連のプロップスで `any` が使用されている箇所の解消。
- **コンポーネントの再分割 (Atomic Design の徹底)**: `TaskDetailModal.tsx` (500行超) をはじめとする巨大な Organism コンポーネントを、ロジックを分離した Hooks や小さな Molecule に再構成。
- **Zod スキーマバリデーションの厳格化**: 現在はバリデーションエラーをログ出力に留めているが、データ整合性維持のため、新規データ作成時などの書き込みブロックを段階的に導入。
- **初期ロードパフォーマンス (LCP) の最適化**:
    - フォント読み込みは `preconnect` と `display: swap` で最適化済み。
    - *残存課題*: クリティカルCSSのインライン化の検討（ビルド設定）。

---

## 💡 実装上のヒント (Technical Implementation Hints)

- **Atomic Design の厳格な運用**:
    - `atoms/`, `molecules/`, `organisms/` 間の依存関係（例: atoms は organisms をインポート不可）を ESLint や `dependency-cruiser` で検出し、階層構造を維持する。
    - Vite エイリアス（`@atoms/` 等）を活用し、インポートパスから階層を明示的に認識できるようにする。
- **テーマ更新の最適化**:
    - CSS 変数（CSS Variables）を優先し、インラインスタイルを避ける。
