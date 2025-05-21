import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    urlAuth: "https://muaazaltahan-001-site1.dtempurl.com/",
    token: null,
    user: null,
    logoutTimer: null,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await $fetch(`${this.urlAuth}authentication/login`, {
          method: "POST",
          body: credentials,
        });
        this.token = response.token;
        this.user = response.user;
        const end = new Date().getMilliseconds() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem("_user", JSON.stringify(response.user));
        localStorage.setItem("token", response.token);
        localStorage.setItem("exp", end);
      } catch (error) {
        return {
          message: "فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى",
        };
      }
    },
    logout() {
      localStorage.removeItem("_user");
      localStorage.removeItem("token");
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
        this.logoutTimer = null;
      }
      this.token = null;
      this.user = null;
      navigateTo("/login");
    },
    // get product
    async showProduct(url) {
      const token = localStorage.getItem("token");
      const response = await $fetch(`${this.urlAuth}${url}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    // Delet
    async deletThing(product, url) {
      const token = localStorage.getItem("token");
      const response = await $fetch(`${this.urlAuth}${url}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    },
    // add product
    async addProduct(formData, url) {
      const token = localStorage.getItem("token");
      const response = await $fetch(`${this.urlAuth}${url}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response;
    },
    // update product
    async updateProduct(formData, url) {
      const token = localStorage.getItem("token");
      const response = await $fetch(`${this.urlAuth}${url}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response;
    },
  },
});
