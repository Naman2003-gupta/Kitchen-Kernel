/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kitchen: {
          cream:  '#FFF8F0',
          warm:   '#FDF3E3',
          orange: '#E8813A',
          brown:  '#6B3F1F',
          tan:    '#C4956A',
          green:  '#4A7C59',
          yellow: '#F5C842',
          red:    '#D95F3B',
          light:  '#FAF0E6',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(107, 63, 31, 0.08)',
        'card-hover': '0 8px 30px rgba(107, 63, 31, 0.15)',
      }
    },
  },
  plugins: [],
}