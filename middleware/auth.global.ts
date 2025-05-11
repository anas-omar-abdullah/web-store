export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith("/admin")) {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigateTo("/login");
    }
  }
  
  if (to.path === "/login" || to.path === "/forgot-password") {
    const token = localStorage.getItem("token");
    if (token) {
      return navigateTo("/");
    }
  }

  if (to.path.includes("/add-admin")) {
    const user = localStorage.getItem("_user");
    if (user) {
      const role = JSON.parse(user).role;
      if (role != 3) {
        return navigateTo("/admin");
      }
    } else {
      return navigateTo("/login");
    }
  }
});
