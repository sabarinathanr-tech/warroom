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
        brand: {
          50: '#EEF0FF',
          100: '#E0E3FF',
          500: '#5B5CE2',
          600: '#4F50D0',
          700: '#4344BC',
        },
        surface: {
          light: '#F7F8FA',
          sidebar: '#FFFFFF',
          border: '#E8EAF0',
          text: '#171923',
          muted: '#737987',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
