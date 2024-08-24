const key = "profile";

export const useProfile = () => {
  const user = useSupabaseUser();

  const { data: profile } = useNuxtData<Profile>(key);
  const refresh = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };
  const fetch = async () => {
    await useFetch(`/api/profiles/${user.value.id}`, { key });
  };

  return { profile, fetch, refresh };
};
