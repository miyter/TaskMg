# TaskMg Known Issues & Roadmap

## 🚀 High Priority: Feature Requests & Improvements
ユーザーからのフィードバックおよびAIレビューに基づく改善項目です。

### ⚙️ Functionality
- **合計時間の集計不備 (再現待ち)**: タスクに所要時間を設定しても、フッターの「TOTAL 0.00h」が更新されない場合がある問題。
    - *Note*: コードロジック修正済み。再現確認待ち。

---

## 🏗️ Technical Debt & Long-Term Roadmap
将来的なアーキテクチャの健全性のための長期課題です。

- **完全な多言語化 (i18n)**: UIの大部分は対応完了。引き続き新規追加機能での対応を継続する。

---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。
- **Localization Consistency (Work in Progress)**: 現在、日本語と英語が混在している箇所があるが、これは完全な i18n 移行への過渡期としての状態。