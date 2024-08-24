export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser();

  if (!user.value && to.path !== "/") return navigateTo("/login");
  if (user.value && to.path === "/") return navigateTo("/puzzle");
});
