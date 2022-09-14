/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./dist/**/*.{html,js}', './src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
      vpurple: {
        '100': '#E1D6F5',
      }
    }
    },
  },
  plugins: [],
}
