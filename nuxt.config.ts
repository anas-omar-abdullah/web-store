// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  css: [
    "@/assets/styles/main.css",
    "swiper/css",
    "swiper/css/navigation",
    "swiper/css/pagination",
  ],
  plugins: ["~/plugins/pinia.clients.js"],
  app: {
    head: {
      htmlAttrs: {
        dir: "rtl",
        lang: "ar",
      },
    },
  },
  devServer: {
    https: true,
    port: 3000, // default: 3000
    host: "localhost", // deafult: 'localhost'
  },
});
