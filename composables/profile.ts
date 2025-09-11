const key = "profile";

type ConversionStatus = "idle" | "awaiting_verification" | "verified" | "done";

export const useProfile = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  const { createSamplePuzzleSet } = useCreatePuzzleSet();
  const { refresh: refreshPuzzleSets } = useFetchPuzzleSets();
  const { fetchDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

  const conversionStatus = ref<ConversionStatus>("idle");
  const pendingPassword = ref("");
  const pendingProfile = ref<Profile | null>(null);

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
      console.error("Sign-in error:", error);
      return { error };
    }

    return { data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign-out error:", error);
      return { error };
    }
    return { message: "Signed out successfully" };
  };

  /**
   * Creates an anonymous guest user
   */
  const createGuestProfile = async () => {
    if (user.value) {
      console.warn("User already exists, cannot create guest profile.");
      return { error: { message: "User already exists" } };
    }

    // Sign in anonymously
    const { data: signInData, error: signInError } =
      await supabase.auth.signInAnonymously({
        options: {
          data: {
            id: crypto.randomUUID(),
            username: `guest_${Date.now()}`,
            first_name: "Guest",
            last_name: "User",
            type: "guest",
          },
        },
      });

    // Create a sample puzzle set for the guest in the background
    if (!signInError && signInData?.user) {
      // Add any guest account initialization processes here
    } else {
      console.error("Guest sign-in error:", signInError);
      return { error: signInError };
    }

    return { signInData, error };
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
    createGuestProfile,
    createUserProfile,
  };
};
