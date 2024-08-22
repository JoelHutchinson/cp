export const useProfile = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient<Database>();

  // get the profile associated with the user
  const { data: profile, error } = useAsyncData(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .match({ id: user.value.id })
      .single();

    if (error) {
      throw createError(error.message);
    }

    return data;
  });

  return { profile };
};
