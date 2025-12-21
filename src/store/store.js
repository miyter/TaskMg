// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: Barrelファイルの定義。互換性維持のためのエイリアス集約。
 */

// 各ドメインのストアをエクスポート
export * from './index.js';
export * from './filters.js';
export * from './labels.js';
export * from './projects.js';
export * from './timeblocks.js';
export * from './workspace.js';

/**
 * 互換性維持セクション
 * UIコンポーネントの移行をスムーズにするための古い名称のエイリアス。
 * 新規実装では使用禁止。
 */
export { addTask as addTaskCompatibility } from './index.js';