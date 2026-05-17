/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#faf8f3',
          100: '#f5f1e8',
          200: '#e8dcc7',
          300: '#d4a574',
          400: '#b8825f',
          500: '#8B5A3C',
          600: '#6b3e26',
          700: '#4f2f1d',
          800: '#3d2414',
          900: '#2a1810',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '20px',
        xl: '40px',
        '2xl': '60px',
      },
      boxShadow: {
        cafe: '0 16px 40px rgba(139, 90, 60, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 165, 116, 0)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 165, 116, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
