import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    urlAuth: "https://192.168.1.102:7010/authentication/login",
    token:null,
    user:null,
    logoutTimer: null,
  }),
  actions: {
    async login(credentials) {
      try {
        
        const response = await $fetch(this.urlAuth, {
          method: "POST",
          body: credentials,
        });
        this.token = response.token;

        const expTime = 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const autoLogoutDelay = expTime - now - 3600 * 1000;

        if (autoLogoutDelay > 0) {
          if (this.logoutTimer) clearTimeout(this.logoutTimer);
          this.logoutTimer = setTimeout(() => {
            this.logout();
          }, autoLogoutDelay);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error("فشل تسجيل الدخول:", error);
        throw error;
      }
    },
    logout() {
      localStorage.removeItem('_user');
      if (this.logoutTimer) {
        clearTimeout(this.logoutTimer);
        this.logoutTimer = null;
      }
      navigateTo("/login");
    },
  },
});
