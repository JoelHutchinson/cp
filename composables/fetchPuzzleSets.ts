const key = "fetch-puzzle-sets";

export const useFetchPuzzleSets = () => {
  const { profile } = useFetchProfile();

  return useLazyAsyncData<PuzzleSet[]>(key, () =>
    $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets`)
  );
};
