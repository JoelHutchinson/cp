const key = "fetch-puzzle-set-progress";

export const useFetchPuzzleSetProgress = (slug: string) => {
  const { profile } = useFetchProfile();

  return useLazyAsyncData<PuzzleSetProgress>(key, () =>
    $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets/${slug}/progress`)
  );
};
