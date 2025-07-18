import { defineStore } from "pinia";

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

  /**
   * Set up email verification listener
   * Completes the guest → user transition
   */
  const setupEmailVerificationListener = () => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "USER_UPDATED") {
          const updatedUser = session?.user;
          if (
            updatedUser?.email_confirmed_at &&
            pendingPassword.value &&
            pendingProfile.value
          ) {
            console.info("Email verified. Updating password and metadata...");

            const { error: updateError } = await supabase.auth.updateUser({
              password: pendingPassword.value,
              data: {
                username: pendingProfile.value.username,
                first_name: pendingProfile.value.first_name,
                last_name: pendingProfile.value.last_name,
                email: pendingProfile.value.email,
                type: "user",
              },
            });

            if (!updateError) {
              conversionStatus.value = "done";
              pendingPassword.value = "";
              pendingProfile.value = null;
              await refresh();
            } else {
              console.error(
                "Error updating password or metadata:",
                updateError
              );
            }
          }
        }
      }
    );

    onUnmounted(() => {
      listener?.subscription.unsubscribe();
    });
  };

  setupEmailVerificationListener();

  // Set up auth state change listener to initialize user data
  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        console.info("[Auth] Initial session or sign-in detected");
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
      createSamplePuzzleSet();
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
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          type: "user",
        },
      },
    });

    return { data, error };
  };

  /**
   * Converts an anonymous guest into a full user
   * - Sends email verification
   * - Waits for `onAuthStateChange` to pick up confirmation
   * - Then updates password and metadata
   */
  const convertGuestToUserProfile = async (
    profile: Profile,
    password: string
  ) => {
    if (!user.value?.id) {
      console.warn("No user ID found, cannot convert guest to user profile.");
      return;
    }

    pendingPassword.value = password;
    pendingProfile.value = profile;

    const { error: updateEmailError } = await supabase.auth.updateUser({
      email: profile.email!,
    });

    if (updateEmailError) {
      console.error("Failed to update email:", updateEmailError);
      return { updateEmailError };
    }

    conversionStatus.value = "awaiting_verification";
    return {
      message: "Verification email sent. Please confirm your email.",
    };
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
    convertGuestToUserProfile,
  };
};

interface ProfileStoreState {
  profile: Profile | null;
  conversionStatus: ConversionStatus;
  pendingLoginData: {
    email: string;
    password: string;
  } | null;
}

export const useProfileStore = defineStore("profile", {
  state: (): ProfileStoreState => ({
    profile: null,
    conversionStatus: "idle",
    pendingLoginData: null,
  }),

  actions: {
    // If there is a user, fetch their profile. Otherwise, create a guest profile
    async initialize() {
      const user = useSupabaseUser();

      if (user.value && !this.profile) {
        this.profile = await $fetch<Profile>(`/api/profiles/${user.value.id}`);
      } else {
        await this.createGuestProfile();
      }
    },

    // Delete guest user and sign in to user profile
    signIn() {},

    // Sign out and create a new guest user
    signOut() {},

    // Create a new guest profile
    async createGuestProfile() {
      const supabase = useSupabaseClient();

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

      if (signInError) {
        console.error("Guest sign-in error:", signInError);
        return { error: signInError };
      }

      // Fetch the newly created guest profile
      this.profile = await $fetch<Profile>(
        `/api/profiles/${signInData.user?.id}`
      );
    },

    // Convert guest profile to user profile
    createUserProfile() {},
  },
});
