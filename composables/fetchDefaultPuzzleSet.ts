const key = "fetch-default-puzzle-set";

export const useFetchDefaultPuzzleSet = () => {
  const { profile } = useFetchProfile();

  const { data: defaultPuzzleSet } = useNuxtData<PuzzleSet>(key);

  const fetchDefaultPuzzleSet = async () => {
    await useFetch(`/api/profiles/${profile.value!.id}/puzzle-sets/default`, {
      key,
    });
  };

  const refreshDefaultPuzzleSet = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };

  return { defaultPuzzleSet, fetchDefaultPuzzleSet, refreshDefaultPuzzleSet };
};
