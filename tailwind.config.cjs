/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#009950',
          hover: '#007a40',
          soft: 'rgba(0, 153, 80, 0.05)',
          border: 'rgba(0, 153, 80, 0.1)',
        },
        secondary: {
          DEFAULT: '#00FF85',
          hover: '#00d970',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          surface: '#111111',
          card: '#161616',
          border: '#1f1f1f',
        },
        gray: {
          50: '#f8faf9',
          100: '#f1f5f3',
          200: '#e2e8e5',
          300: '#cbd5d1',
          400: '#94a39e',
          500: '#64746f',
          600: '#4b5552',
          700: '#37413e',
          800: '#1f2926',
          900: '#0f1715',
          950: '#050a08',
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
      },
    }
  },
  plugins: [],
}
