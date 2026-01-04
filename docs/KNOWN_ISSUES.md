# TaskMg 残存課題 (Known Issues)

## 🚀 残存課題

> [!IMPORTANT]
> 修正にあたっては `docs/PROJECT_STATUS.md` の「UI/UX 設計思想」を必ず参照し、情報の高密度化とミニマリズムを両棲させてください。

---

## 🐛 Active Bugs



---

## 🏗️ Long-Term Roadmap

- **完全な多言語化 (i18n)**: バリデーションメッセージの翻訳基盤は整備済み。残る細かいハードコードは発見次第修正。





---



## 💡 実装上のヒント (Technical Implementation Hints)


- **データ制約**: `src/store/schema.ts` の Zod スキーマに `.max()` を追加し、API層でのバリデーションを徹底する。UI層（`Input.tsx`等）でも `maxLength` 属性を併用する。
- **UIレイアウトの安定化**: `TaskItem.tsx` 内のメタ情報エリア（右側）に `flex-basis` を指定し、内容の有無に関わらずスペースを予約する。
- **自動クリーンアップ**: `src/store/maintenance.ts` 等に、`completedAt` が30日以上前のタスクを抽出して `description` を空文字に更新し、メタデータフラグ（`isDetailPurged: true` 等）を付与するロジックを実装する。
