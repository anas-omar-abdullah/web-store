export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path.startsWith("/admin")) {
    if (!localStorage.getItem("token")) {
      return navigateTo("/login");
    }
  }
});
