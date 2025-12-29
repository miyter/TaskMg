# デザインシステム - 設計思想とガイドライン

## 設計思想

### 1. コンパクトでスタイリッシュ
- 無駄なスペースを排除
- 情報密度を高めつつ、視認性を維持
- ミニマルで洗練されたデザイン

### 2. モダンデザイン
- グラスモフィズム（半透明・ぼかし効果）
- マイクロアニメーション
- ダークモード対応
- グラデーション・シャドウの活用

### 3. スクロールしない
- 全ての主要画面を700px以内に収める
- ヘッダー: 12px（48px）
- フッター: 12px（48px）
- コンテンツ: 676px（700px - 48px - 48px）
- 目線の移動を最小限に

### 4. 目線の位置を固定
- ヘッダー・フッターは常に同じ位置
- コンテンツは垂直方向にコンパクトに配置
- 横スクロールは一切なし

### 5. 文字サイズの統一

#### 見出しレベル（4段階）
- **H1**: ページタイトル（最大見出し）
- **H2**: セクション見出し
- **H3**: サブセクション見出し
- **H4**: 小見出し

#### テキストレベル（4段階）
- **LARGE**: 大きめのテキスト
- **NORMAL**: 通常テキスト（デフォルト）
- **SMALL**: 小さめのテキスト
- **TINY**: 極小テキスト（ラベル等）

### 6. 設定による一括変更
- フォントサイズ設定: xs / sm / md / lg
- 設定変更時、全ての見出しとテキストが一括で変更される
- CSSカスタムプロパティで管理

## 使用方法

### 基本的な使い方

```javascript
import { TYPOGRAPHY, SPACING, LAYOUT } from './core/design-system.js';

// 見出しを使用
<h1 class="${TYPOGRAPHY.HEADING.H1}">ページタイトル</h1>
<h2 class="${TYPOGRAPHY.HEADING.H2}">セクション見出し</h2>

// テキストを使用
<p class="${TYPOGRAPHY.TEXT.NORMAL}">通常のテキスト</p>
<span class="${TYPOGRAPHY.TEXT.SMALL}">小さなテキスト</span>

// スペーシングを使用
<div class="${SPACING.VERTICAL.SECTION}">セクション間の余白</div>
<div class="${SPACING.PADDING.MEDIUM}">中サイズのパディング</div>

// レイアウト制約を使用
<div class="${LAYOUT.MAX_HEIGHT_CLASS}">700px以内に収める</div>
<div class="${LAYOUT.CONTAINER.NORMAL}">通常幅のコンテナ</div>
```

### ヘルパー関数を使用

```javascript
import { getHeadingClass, getTextClass, getSpacingClass } from './core/design-system.js';

// 見出しクラスを取得
const h1Class = getHeadingClass('H1');
const h2Class = getHeadingClass('H2');

// テキストクラスを取得
const normalText = getTextClass('NORMAL');
const smallText = getTextClass('SMALL');

// スペーシングクラスを取得
const sectionSpacing = getSpacingClass('SECTION', 'VERTICAL');
const itemGap = getSpacingClass('ITEM', 'HORIZONTAL');
```

### フォントサイズ設定を変更

```javascript
import { applyFontSizePreset } from './core/design-system.js';

// ユーザーが設定を変更
applyFontSizePreset('sm'); // 小さめ（コンパクト）
applyFontSizePreset('md'); // 通常
applyFontSizePreset('lg'); // 大きめ

// 設定変更イベントをリッスン
window.addEventListener('font-size-changed', (e) => {
    console.log('フォントサイズが変更されました:', e.detail.preset);
    // 必要に応じてUIを再描画
});
```

## フォントサイズプリセット

### xs（極小 - 最もコンパクト）
- H1: text-lg
- H2: text-base
- H3: text-sm
- H4: text-xs
- NORMAL: text-xs

### sm（小 - コンパクト）**← デフォルト**
- H1: text-xl
- H2: text-lg
- H3: text-base
- H4: text-sm
- NORMAL: text-sm

### md（通常）
- H1: text-2xl
- H2: text-xl
- H3: text-lg
- H4: text-base
- NORMAL: text-base

### lg（大）
- H1: text-3xl
- H2: text-2xl
- H3: text-xl
- H4: text-lg
- NORMAL: text-lg

## スペーシング規則

### 垂直方向
- **SECTION**: セクション間（mb-6）
- **BLOCK**: ブロック間（mb-4）
- **ITEM**: アイテム間（mb-2）
- **TIGHT**: 密接なアイテム間（mb-1）

### 水平方向
- **SECTION**: セクション間（gap-6）
- **BLOCK**: ブロック間（gap-4）
- **ITEM**: アイテム間（gap-2）
- **TIGHT**: 密接なアイテム間（gap-1）

### パディング
- **LARGE**: 大きなコンテナ（p-6）
- **MEDIUM**: 中サイズコンテナ（p-4）
- **SMALL**: 小さなコンテナ（p-3）
- **COMPACT**: コンパクトなコンテナ（p-2）
- **MINIMAL**: 最小パディング（p-1）

## レイアウト制約

### 画面全体
- 最大高さ: 700px
- ヘッダー: 48px（h-12）
- フッター: 48px（h-12）
- コンテンツ: 604px（自動計算）

### コンテナ幅
- **NARROW**: max-w-3xl（768px）
- **NORMAL**: max-w-4xl（896px）
- **WIDE**: max-w-5xl（1024px）
- **FULL**: max-w-6xl（1152px）

## アイコンサイズ

- **TINY**: w-3 h-3（12px）
- **SMALL**: w-4 h-4（16px）
- **NORMAL**: w-5 h-5（20px）
- **MEDIUM**: w-6 h-6（24px）
- **LARGE**: w-8 h-8（32px）

## ベストプラクティス

### ✅ DO（推奨）
- デザインシステムの定数を使用する
- 見出しとテキストのレベルを適切に使い分ける
- スペーシングは統一された値を使用する
- 700px制約を常に意識する
- コンパクトなデザインを心がける

### ❌ DON'T（非推奨）
- ハードコードされたフォントサイズを使用しない
- 独自のスペーシング値を作らない
- 700pxを超える高さのコンポーネントを作らない
- 不必要な余白を追加しない
- 縦スクロールを前提としたデザインにしない

## 初期化

アプリケーション起動時に初期化:

```javascript
import { initDesignSystem } from './core/design-system.js';

// アプリ起動時
initDesignSystem();
```

## 今後の拡張

- カラーパレットの統一管理
- アニメーション設定の統一
- レスポンシブブレークポイントの管理
- テーマ設定の拡張
