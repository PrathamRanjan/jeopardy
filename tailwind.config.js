/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jeopardy: {
          blue: '#060CE9',
          yellow: '#FFCC00',
          dark: '#02044A',
        }
      }
    },
  },
  plugins: [],
}