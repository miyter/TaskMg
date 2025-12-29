/**
 * UI設定管理のドキュメント
 * 
 * このモジュールは、アプリケーション全体のUI設定（フォント、フォントサイズ、UI密度）を
 * 一元管理し、4つの主要な画面セグメントに適用します。
 */

# UI設定管理システム

## 概要

UI設定は以下の3つのカテゴリに分類されます：

1. **フォント設定** - 英語フォント、日本語フォント
2. **フォントサイズ設定** - 5段階（sm, base, md, lg, xl）
3. **UI密度設定** - 4段階（compact, normal, comfortable, spacious）

## 画面セグメント

設定は以下の4つの主要セグメントに適用されます：

### 1. サイドバー
- **影響を受ける設定**: フォント、フォントサイズ、UI密度
- **適用内容**:
  - アイテムの高さ（py-1, py-1.5, py-2, py-2.5）
  - パディング
  - テキストサイズ

### 2. メインカラム
- **影響を受ける設定**: フォント、フォントサイズ、UI密度
- **適用内容**:
  - タスクリストのスペーシング
  - 行間
  - タスクカードのパディング

### 3. モーダル
- **影響を受ける設定**: フォント、フォントサイズ、UI密度
- **適用内容**:
  - モーダル内のパディング（--modal-p）
  - 要素間のギャップ（--modal-gap）
  - テキストサイズ

### 4. ダッシュボード
- **影響を受ける設定**: フォント、フォントサイズ、UI密度
- **適用内容**:
  - カードのスペーシング
  - グラフのマージン
  - テキストサイズ

## 使用方法

### 設定の取得
```javascript
import { getCurrentUISettings } from './ui-settings-manager.js';

const settings = getCurrentUISettings();
// { fontEn: 'Inter', fontJp: 'M PLUS 2', fontSize: 'md', density: 'normal' }
```

### 設定の変更
```javascript
import { setFont, setFontSize, setDensity } from './ui-settings-manager.js';

// フォント変更
setFont('EN', 'Roboto');
setFont('JP', 'Noto Sans JP');

// フォントサイズ変更
setFontSize('lg');

// UI密度変更
setDensity('comfortable');
```

### すべての設定を適用
```javascript
import { applyAllUISettings } from './ui-settings-manager.js';

// アプリ起動時や設定変更時に実行
applyAllUISettings();
```

### 特定のセグメントのみに適用
```javascript
import { applyUISettingsToSegment } from './ui-settings-manager.js';

// サイドバーのみ再適用
applyUISettingsToSegment('sidebar');

// ダッシュボードのみ再適用
applyUISettingsToSegment('dashboard');
```

### 設定変更イベントの監視
```javascript
import { onUISettingsChange } from './ui-settings-manager.js';

onUISettingsChange(() => {
    console.log('UI設定が変更されました');
    // カスタム処理
});
```

## CSS変数

設定は以下のCSS変数として適用されます：

### フォント
- `--font-en`: 英語フォント
- `--font-jp`: 日本語フォント

### UI密度
- `--modal-p`: モーダルのパディング
- `--modal-gap`: モーダル内の要素間ギャップ

## Bodyクラス

設定に応じて以下のクラスがbodyに適用されます：

### フォントサイズ
- `font-app-sm`: 0.8125rem / 1.25rem
- `font-app-base`: 0.9375rem / 1.375rem
- `font-app-md`: 1rem / 1.5rem
- `font-app-lg`: 1.125rem / 1.75rem
- `font-app-xl`: 1.25rem / 1.75rem

### UI密度
- `app-density-compact`: 最小スペーシング
- `app-density-normal`: 標準スペーシング
- `app-density-comfortable`: 広めのスペーシング
- `app-density-spacious`: 最大スペーシング

## 実装の詳細

### セグメント別適用関数

各セグメントには専用の適用関数があります：

1. `applySidebarSettings()` - サイドバーアイテムの密度クラスを適用
2. `applyMainColumnSettings()` - タスクリストのスペーシングを調整
3. `applyModalSettings()` - モーダルのパディングとギャップを設定
4. `applyDashboardSettings()` - ダッシュボードコンテナにdata属性を設定

### イベントフロー

1. ユーザーが設定を変更
2. `setFont()`, `setFontSize()`, `setDensity()` が呼ばれる
3. LocalStorageに保存
4. `applyAllUISettings()` が実行される
5. 各セグメント別適用関数が順次実行される
6. `notifyUISettingsChange()` でイベント発火
7. リスナーが反応して追加処理を実行

## 拡張方法

新しいセグメントを追加する場合：

1. `applyXXXSettings()` 関数を作成
2. `applyAllUISettings()` に追加
3. `applyUISettingsToSegment()` のswitch文に追加
4. このドキュメントを更新
