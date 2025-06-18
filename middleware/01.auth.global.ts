export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  if (user.value) {
    if (to.path === "/") return navigateTo("/about");
  } else {
    if (to.path === "/login" || to.path === "/register") {
      // If the user is not authenticated and trying to access login or register, allow access
      return;
    } else {
      // If the user is not authenticated and trying to access a protected route, redirect to login
      return navigateTo("/login");
    }
  }
});
