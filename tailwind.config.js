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
        primary: "#3ca2fa",
      },
    },
  },
  plugins: [],
};
