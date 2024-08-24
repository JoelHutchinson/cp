export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === "/puzzle") {
    return navigateTo("/puzzle/1");
  }
});
