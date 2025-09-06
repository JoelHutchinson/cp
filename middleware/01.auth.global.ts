export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  if (user.value) {
    if (to.path === "/") return navigateTo("/about");
  } else {
    if (to.path !== "/puzzle-set" && to.path !== "/solve") {
      // If the user is not authenticated and trying to access a none-protected route allow access
      return;
    } else {
      // If the user is not authenticated and trying to access a protected route, redirect to about page
      return navigateTo("/login");
    }
  }
});
