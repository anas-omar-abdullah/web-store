/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.ts",
    "./assets/styles/main.css",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3ca2fa',
          50: '#f0f8ff',
          100: '#e0f0fe',
          200: '#bae0fd',
          300: '#7cc3fc',
          400: '#3ca2fa',
          500: '#1a8def',
          600: '#0a71d1',
          700: '#0a5aa6',
          800: '#0d4d89',
          900: '#113f71',
        },
        secondary: {
          DEFAULT: '#6c63ff',
          50: '#f5f4ff',
          100: '#ebe9fe',
          200: '#d8d4fe',
          300: '#b6affd',
          400: '#917ffb',
          500: '#6c63ff',
          600: '#5e42f5',
          700: '#4d2fe5',
          800: '#4026bf',
          900: '#36249b',
        },
        accent: {
          DEFAULT: '#ff6b6b',
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ff9e9e',
          400: '#ff6b6b',
          500: '#ff3a3a',
          600: '#ff1f1f',
          700: '#e50000',
          800: '#be0606',
          900: '#9b0c0c',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 0.5s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}