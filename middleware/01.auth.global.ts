export default defineNuxtRouteMiddleware(async (to) => {
  const { profile, createGuestProfile, signOut } = useProfile();

  const isAuthRoute = ["/login", "/register"].includes(to.path);
  const isProtectedRoute = ["/solve", "/puzzle-set"].includes(to.path);

  if (isAuthRoute && profile.value) {
    await signOut();
  }

  if (!isAuthRoute && !profile.value) {
    if (isProtectedRoute) {
      await createGuestProfile();
    } else {
      createGuestProfile(); // don't await, run in background
    }
  }

  if (!profile.value && isProtectedRoute) {
    return navigateTo("/login");
  }
});
