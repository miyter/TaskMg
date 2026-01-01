# TaskMg Known Issues & Roadmap

## 🚀 High Priority: Feature Requests & Improvements
ユーザーからのフィードバックに基づく、最優先の機能拡張および改善項目です。

*(現在は項目なし)*

---

## 🏗️ Technical Debt & Long-Term Roadmap
将来的なアーキテクチャの健全性のための長期課題です。

*(現在は項目なし)*

---

## 📝 Design Decisions (By Design)
- **Legacy Exports**: API互換性のため、`auth.ts` のプロキシ関数は維持。
- **Inline Styles**: 動的な色指定には Tailwind ではなく `style` 属性を使用。
- **Mobile Behavior**: サイドバーはモバイルでの初期状態を「折りたたみ」とする。
- **Localization Consistency (Work in Progress)**: 現在、日本語と英語が混在している箇所があるが、これは完全な i18n 移行への過渡期としての状態。