/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"M PLUS 2"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'app-sm': ['0.8125rem', { lineHeight: '1.25rem' }],
        'app-base': ['0.9375rem', { lineHeight: '1.375rem' }],
        'app-md': ['1rem', { lineHeight: '1.5rem' }],
        'app-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'app-xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
      colors: {
        primary: {
          light: '#3B82F6',
          dark: '#60A5FA',
        },
        status: {
          today: '#3B82F6',
          weekly: '#10B981',
          monthly: '#8B5CF6',
          unassigned: '#A0AEC0'
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-in-down': 'fadeInDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.2s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}