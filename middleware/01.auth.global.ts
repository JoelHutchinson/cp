export default defineNuxtRouteMiddleware(async (to) => {
  const { profile, createGuestProfile, signOut } = useProfile();

  // If navigating to login or register, log the user out
  const isAuthRoute = ["/login", "/register"].includes(to.path);
  if (isAuthRoute && profile.value) {
    await signOut();
  }

  // Skip guest account creation on login or register pages
  if (!isAuthRoute && !profile.value) {
    await createGuestProfile();
  }

  // Redirect unauthenticated users away from protected routes
  const isProtectedRoute = ["/solve", "/puzzle-set"].includes(to.path);
  if (!profile.value && isProtectedRoute) {
    return navigateTo("/login");
  }
});
