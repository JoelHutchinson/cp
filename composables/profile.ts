const key = "profile";

type ConversionStatus = "idle" | "awaiting_verification" | "verified" | "done";

export const useProfile = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  const { refresh: refreshPuzzleSets } = useFetchPuzzleSets();
  const { fetchDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

  const conversionStatus = ref<ConversionStatus>("idle");

  // Load the profile for a logged-in user
  const {
    data: profile,
    status,
    error,
    refresh,
    clear,
  } = useAsyncData(key, async () => {
    if (!user.value?.id) return null;
    return await $fetch(`/api/profiles/${user.value.id}`);
  });

  // Set up auth state change listener to initialize user data
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === "INITIAL_SESSION") {
        console.info("[Auth] Initial session detected");
        await initializeUserData();
      } else if (event === "SIGNED_OUT") {
        console.info("[Auth] Signed out");
      }
    }
  );

  onUnmounted(() => {
    authListener?.subscription.unsubscribe();
  });

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { error };
    }
    return { message: "Signed out successfully" };
  };

  /**
   * Creates a fully registered user from scratch (skipping guest flow)
   */
  const createUserProfile = async (profile: Profile, password: string) => {
    if (user.value) {
      console.warn("User already exists, cannot create user profile.");
      return { error: { message: "User already exists" } };
    }

    const { data, error } = await supabase.auth.signUp({
      email: profile.email!,
      password,
      options: {
        data: {
          id: profile.id,
          username: profile.username,
          first_name: "",
          last_name: "",
          email: profile.email,
          type: "user",
        },
      },
    });

    return { data, error };
  };

  const initializeUserData = async () => {
    if (!user.value?.id) {
      console.warn("No user ID found, cannot initialize user data.");
      return;
    }

    await refreshPuzzleSets();
    await fetchDefaultPuzzleSet();
  };

  return {
    user,
    profile,
    status,
    error,
    refresh,
    clear,
    conversionStatus,

    signIn,
    signOut,
    createUserProfile,
  };
};
