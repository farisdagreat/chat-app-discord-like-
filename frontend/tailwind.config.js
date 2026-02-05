/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          650: '#3a3f4b',
          750: '#2a2f3b',
        }
      }
    },
  },
  plugins: [],
}
