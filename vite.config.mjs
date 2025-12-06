import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// @miyter:20251125
// エラー回避のため、pathモジュール依存を完全に排除し、inputとaliasを再定義

export default defineConfig({
  // ビルド成果物の出力先: プロジェクトルート (TaskMg) に dist を出力
  build: {
    outDir: 'dist', 
    emptyOutDir: true, 
    chunkSizeWarningLimit: 800, // ★追加: 警告を抑制するためにチャンクサイズ制限を800kBに引き上げ
    // ★修正1: inputを明示的に指定
    // index.htmlをルートに移動済みであれば、単に 'index.html' でOKです
    rollupOptions: {
      input: {
        main: 'index.html', 
      },
    },
  },
  
  // 2. エイリアス設定
  resolve: {
    alias: {
      // ★修正2: srcフォルダをルートに移動済みの場合、ここは './src' になります
      '@': './src', 
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