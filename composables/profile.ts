const key = "profile";

export const useProfile = () => {
  const user = useSupabaseUser();

  return useLazyAsyncData(key, () => $fetch(`/api/profiles/${user.value.id}`));
};
