const key = "profile";

export const useProfile = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient<Database>();

  const { error, refresh } = useAsyncData(key, async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .match({ id: user.value?.id });

    if (error) {
      throw createError(error.message);
    }

    return data[0];
  });

  if (error.value) {
    throw createError(error.value.message);
  }

  return { profile: useNuxtData<Profile | null>(key).data, refresh };
};
