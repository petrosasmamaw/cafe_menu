/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#fffaf3',
          100: '#f7eedd',
          200: '#edd6b7',
          300: '#dcb27f',
          400: '#c78949',
          500: '#a86534',
          600: '#6b3e26',
          700: '#4f2f1d',
        },
      },
      boxShadow: {
        cafe: '0 16px 40px rgba(107, 62, 38, 0.18)',
      },
    },
  },
  plugins: [],
}
