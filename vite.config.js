import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
// import path from 'path'; // ★削除: pathモジュールは削除

// @miyter:20251125
// エラー回避のため、pathモジュール依存を完全に排除し、inputとaliasを再定義

export default defineConfig({
  // rootオプションは削除を維持
  
  // ビルド成果物の出力先: プロジェクトルート (TaskMg) に dist を出力
  build: {
    outDir: 'dist', 
    emptyOutDir: true, 
    // ★修正1: inputを明示的に指定 (プロジェクトルートからの相対パス)
    //         これでRollupが 'TaskMg/public/index.html' を探す
    rollupOptions: {
      input: {
        main: 'index.html', // プロジェクトルートからの相対パス
      },
    },
  },
  
  // 2. エイリアス設定: pathモジュールを削除したため、エイリアスをシンプルな相対パスに戻す
  resolve: {
    alias: {
      // @/core/auth.js が TaskMg/public/src/core/auth.js を指すように設定
      '@': './public/src', 
    },
  },
  
  // Tailwind CSSとPostCSSの設定
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
});