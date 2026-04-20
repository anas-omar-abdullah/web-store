// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  ssr: false,
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  
  // Runtime configuration for environment variables
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://muaazaltahan-001-site1.dtempurl.com/",
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
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
