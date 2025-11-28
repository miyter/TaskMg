/** @type {import('tailwindcss').Config} */
export default {
  // Tailwindが監視すべきファイルを指定
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}