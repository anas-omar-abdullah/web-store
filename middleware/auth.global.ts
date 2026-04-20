export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client-side (SSR-safe)
  if (process.server) return;
  
  // Check if token is expired
  const now = Date.now();
  const exp = parseInt(localStorage.getItem("exp") || "0");
  
  if (exp && now >= exp) {
    // Token expired, clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("_user");
    localStorage.removeItem("exp");
  }
  
  // Admin routes protection
  if (to.path.startsWith("/admin")) {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigateTo("/login");
    }
  }
  
  // Redirect authenticated users away from login/forgot-password
  if (to.path === "/login" || to.path === "/forgot-password") {
    const token = localStorage.getItem("token");
    if (token) {
      return navigateTo("/");
    }
  }

  // Super admin only routes
  if (to.path.includes("/add-admin")) {
    const user = localStorage.getItem("_user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.role !== 3) {
          return navigateTo("/admin");
        }
      } catch (error) {
        // Invalid user data, logout
        localStorage.removeItem("_user");
        localStorage.removeItem("token");
        return navigateTo("/login");
      }
    } else {
      return navigateTo("/login");
    }
  }
});
