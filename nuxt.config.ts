// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["@/assets/styles/main.css"],
  plugins: [
    "~/plugins/pinia.clients.js",
  ],
  app: {
    head: {
      htmlAttrs: {
        dir: "rtl",
        lang: "ar",
      },
    },
  },
});
