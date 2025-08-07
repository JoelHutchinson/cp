const key = "fetch-default-puzzle-set";

export const useFetchDefaultPuzzleSet = () => {
  const { profile } = useFetchProfile();
  const fetchDefaultPuzzleSetError = ref<any>(null);

  const defaultPuzzleSet = useAsyncData<PuzzleSet | null>(key, async () => {
    if (!profile.value?.id) {
      console.warn("No profile ID found, cannot fetch default puzzle set.");
      return null;
    }

    try {
      const data = await $fetch<PuzzleSet>(
        `/api/profiles/${profile.value.id}/puzzle-sets/default`
      );
      return data;
    } catch (error) {
      console.error("Error fetching default puzzle set:", error);
      fetchDefaultPuzzleSetError.value = error;
      return null;
    }
  });

  const refreshDefaultPuzzleSet = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };

  return {
    defaultPuzzleSet: defaultPuzzleSet.data,
    fetchDefaultPuzzleSetError,
    refreshDefaultPuzzleSet,
  };
};