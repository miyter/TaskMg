import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path'; 

// @miyter:20251125
// index.htmlがプロジェクトルート直下にある構造に合わせ、パスを最終修正

export default defineConfig({
  // ★修正1: rootオプションを削除 (index.htmlがルート直下にあるため)
  
  // ビルド成果物の出力先: プロジェクトルート (TaskMg) に dist を出力
  build: {
    outDir: 'dist', 
    emptyOutDir: true, 
    // ★修正2: inputをプロジェクトルートからの相対パスに修正
    //         index.htmlがルート直下にあるため、ファイル名だけを指定
    rollupOptions: {
      input: {
        main: './index.html', 
      },
    },
  },
  
  // 2. エイリアス設定: rootが削除されたため、'@' が public/src を指すように修正
  resolve: {
    alias: {
      // @/core/auth.js が TaskMg/public/src/core/auth.js を指すように設定
      // pathモジュールを使わずに相対パスで記述 (最もシンプルな手法)
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