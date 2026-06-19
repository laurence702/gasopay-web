/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Gasopay brand palette extracted from main_logo.svg
        brand: {
          50:  '#f0fdf6',
          100: '#dcfce8',
          200: '#bbf7d1',
          300: '#86efad',
          400: '#4ade80',
          500: '#00bf63', // primary green — flame icon fill
          600: '#00a855',
          700: '#008f48',
          800: '#00703a',
          900: '#005a2f',
          950: '#003d20',
        },
        navy: {
          DEFAULT: '#3f5386', // GasPAY text color
          light: '#5a6fa8',
          dark: '#2c3a5e',
        },
        coral: {
          DEFAULT: '#ff5757', // GAS text color
          light: '#ff7a7a',
          dark: '#e03d3d',
        },
        // Semantic aliases
        primary: '#00bf63',
        'primary-dark': '#008f48',
        'primary-light': '#dcfce8',
      },
      // Auth screen right panel background
      backgroundImage: {
        'brand-dots': 'radial-gradient(circle, rgba(0,191,99,0.15) 1px, transparent 1px)',
        'brand-grid': 'linear-gradient(rgba(0,191,99,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,99,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-sm': '20px 20px',
        'grid-md': '32px 32px',
      },
    },
  },
  plugins: [],
}
