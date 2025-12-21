// @ts-nocheck
/**
 * 更新日: 2025-12-21
 * 内容: 公開APIの集約。互換性関数の再エクスポート追加。
 */

// 各モジュールからの集約エクスポート
export * from './index.js';
export * from './filters.js';
export * from './labels.js';
export * from './projects.js';
export * from './timeblocks.js';
export * from './workspace.js';

// ★重要: 後方互換性のためのエイリアス
// task-input.js 等が使用している addTaskCompatibility を
// 実装モジュール(index.js)の addTask に紐付ける
export { addTask as addTaskCompatibility } from './index.js';