/** @type {import('tailwindcss').Config} */
// @miyter:20251221
// デザインシステムのトークンを一元管理し、保守性を向上

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // アプリケーション全体で使用する日本語/英字フォント
        sans: ['"M PLUS 2"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // 設定画面で切り替える body.font-* クラスに対応するベースサイズ定義
        'app-sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px相当
        'app-md': ['1rem', { lineHeight: '1.5rem' }],     // 16px相当
        'app-lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px相当
      },
      colors: {
        // ブランド・プライマリカラー
        primary: {
          light: '#3B82F6', // blue-500
          dark: '#60A5FA',  // blue-400
        },
        // ダッシュボードや時間帯で使用するセマンティックカラーの定義
        // これにより dashboard.js 等で色コードの直接指定を減らせる
        status: {
          today: '#3B82F6',   // 日次推移用
          weekly: '#10B981',  // 週次推移用
          monthly: '#8B5CF6', // 月次推移用
          unassigned: '#A0AEC0' // 未設定用
        },
      },
      backdropBlur: {
        // Glassmorphism(すりガラス)用の微細なブラー設定
        xs: '2px',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
      },
      animation: {
        // ビュー遷移やモーダル用のカスタムアニメーション
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        // ガラスカード用の立体感のあるシャドウ
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }
    },
  },
  plugins: [],
}