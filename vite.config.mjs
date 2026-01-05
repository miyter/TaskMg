import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

// @miyter:20251125
// エラー回避のため、pathモジュール依存を完全に排除し、inputとaliasを再定義

export default defineConfig({
  plugins: [react()],
  // ビルド成果物の出力先: プロジェクトルート (TaskMg) に dist を出力
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // ★追加: 警告を抑制するためにチャンクサイズ制限を1000kBに引き上げ
    // ★修正1: inputを明示的に指定
    // index.htmlをルートに移動済みであれば、単に 'index.html' でOKです
    rollupOptions: {
      input: {
        main: 'index.html',
      },
      output: {
        manualChunks: (id) => {
          // Separate i18n data/logic from React components
          if (id.includes('core/i18n')) {
            return 'i18n';
          }

          if (id.includes('node_modules')) {
            // Firebase (Separate chunk for size)
            if (id.includes('firebase')) {
              return 'firebase';
            }

            // Tiptap (Rich Text Editor) - Large, lazy loadable potential
            if (id.includes('@tiptap') || id.includes('prosemirror')) {
              return 'editor';
            }

            // Chart.js - Large visualization lib
            if (id.includes('chart.js')) {
              return 'viz';
            }

            // React Core & Others (Vendor)
            // Keep React, ReactDOM together to avoid instance issues
            return 'vendor';
          }
        },
      },
    },
  },

  // 2. エイリアス設定と依存関係の調整
  resolve: {
    alias: {
      // ★修正2: srcフォルダをルートに移動済みの場合、ここは './src' になります
      '@': './src',
    },
    // Reactの重複インストールを防ぎ、単一インスタンスを保証
    dedupe: ['react', 'react-dom'],
  },

  // 依存関係の最適化設定
  optimizeDeps: {
    include: ['react', 'react-dom'],
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