export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!user.value && to.path !== "/login" && to.path !== "/register")
    return navigateTo("/login");
});
