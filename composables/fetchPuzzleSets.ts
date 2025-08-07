const key = "fetch-puzzle-sets";

export const useFetchPuzzleSets = () => {
const { profile } = useFetchProfile();

  return useLazyAsyncData<PuzzleSet[]>(key, () =>
    $fetch<PuzzleSet[]>(`/api/profiles/${profile.value!.id}/puzzle-sets`)
  );
};
