export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  // If the user is not authenticated and trying to access a protected route, redirect to login
  if (!user.value && to.path !== "/login" && to.path !== "/register")
    return navigateTo("/login");

  // If the user is authenticated and trying to access the root path, redirect to solve
  if (user.value && to.path === "/") return navigateTo("/solve");
});
