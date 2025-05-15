const key = "puzzle-sets";

export const usePuzzleSets = () => {
  const { profile } = useProfile();

  const { data: puzzleSets } = useNuxtData<PuzzleSet[]>(key);

  const refresh = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };

  const fetch = async () => {
    await useFetch(`/api/profiles/${profile.value!.id}/puzzle-sets`, { key });
  };

  return { puzzleSets, fetch, refresh };
};
