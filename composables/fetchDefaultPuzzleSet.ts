const key = "fetch-default-puzzle-set";

export const useFetchDefaultPuzzleSet = () => {
  const { profile } = useFetchProfile();

  const { data: defaultPuzzleSet } = useNuxtData<PuzzleSet>(key);

  const fetchDefaultPuzzleSetError = ref<any>(null);

  const fetchDefaultPuzzleSet = async () => {
    if (!profile.value || !profile.value?.id) {
      console.warn("No profile ID found, cannot fetch default puzzle set.");
      return;
    }

    const { error } = await useFetch(
      `/api/profiles/${profile.value!.id}/puzzle-sets/default`,
      {
        key,
      }
    );

    fetchDefaultPuzzleSetError.value = error.value;
  };

  const refreshDefaultPuzzleSet = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };

  return {
    defaultPuzzleSet,
    fetchDefaultPuzzleSet,
    refreshDefaultPuzzleSet,
    fetchDefaultPuzzleSetError,
  };
};
