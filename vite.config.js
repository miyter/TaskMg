import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
// import path from 'path'; // ★削除: pathモジュールを削除し、Node.jsのパス解決ロジックに依存しないようにする

// @miyter:20251125
// Windowsの日本語パスエラーを回避するため、pathモジュールと絶対パスを回避

export default defineConfig({
  // rootオプションは削除したまま
  
  // ビルド成果物の出力先: プロジェクトルートに dist を出力
  build: {
    outDir: 'dist', 
    emptyOutDir: true, 
    // ★修正1: inputをプロジェクトルートからの相対パスとしてシンプルに指定
    //         Rollupがこれを直接受け取り、パス解決のミスマッチを避けることを期待
    rollupOptions: {
      input: {
        main: 'public/index.html', // プロジェクトルートからの相対パス
      },
    },
  },
  
  // 2. エイリアス設定: Rollupのパス解決に依存しないように、pathモジュールも削除
  resolve: {
    alias: {
      // pathモジュールを使用しないエイリアス定義 (Vite v5+の推奨外だが、日本語パス回避のため)
      // VITEが自動的にプロジェクトルートを基準に解決することを期待
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