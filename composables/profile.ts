const key = "profile";

export const useProfile = () => {
  const user = useSupabaseUser();

  return {
    profile: useNuxtData<Profile>(key).data,
    refresh: async () => {
      clearNuxtData(key);
      await refreshNuxtData(key);
    },
    fetch: async () => {
      await useFetch(`/api/users/${user.value.id}`, { key });
    },
  };
};
