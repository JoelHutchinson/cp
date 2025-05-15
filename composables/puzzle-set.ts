const key = "puzzle-sets";

export const usePuzzleSets = () => {
  const { profile } = useProfile();

  const { data: puzzleSets } = useNuxtData<PuzzleSet[]>(key);

  const refreshPuzzleSets = async () => {
    clearNuxtData(key);
    await refreshNuxtData(key);
  };

  const fetchPuzzleSets = async () => {
    await useFetch(`/api/profiles/${profile.value!.id}/puzzle-sets`, { key });
  };

  return { puzzleSets, fetchPuzzleSets, refreshPuzzleSets };
};
