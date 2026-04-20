import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    logoutTimer: null,
  }),
  getters: {
    // Get API URL from runtime config
    urlAuth: () => {
      const config = useRuntimeConfig();
      return config.public.apiBase || "https://muaazaltahan-001-site1.dtempurl.com/";
    },
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      try {
        const response = await $fetch(`${this.urlAuth}authentication/login`, {
          method: "POST",
          body: credentials,
        });
        this.token = response.token;
        this.user = response.user;
        
        // Fixed: Calculate expiration correctly (30 days from now)
        const expirationTime = Date.now() + (30 * 24 * 60 * 60 * 1000);
        
        if (process.client) {
          localStorage.setItem("_user", JSON.stringify(response.user));
          localStorage.setItem("token", response.token);
          localStorage.setItem("exp", expirationTime.toString());
        }
      } catch (error) {
        return {
          message: "فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى",
        };
      }
    },
    logout() {
      if (process.client) {
        localStorage.removeItem("_user");
        localStorage.removeItem("token");
        localStorage.removeItem("exp");
      }
      
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
      if (!process.client) return null;
      
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
    // Delete
    async deletThing(product, url) {
      if (!process.client) return null;
      
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
      if (!process.client) return null;
      
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
      if (!process.client) return null;
      
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
