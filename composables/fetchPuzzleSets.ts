const key = "fetch-puzzle-sets";

export const useFetchPuzzleSets = async () => {
  const { profile } = useFetchProfile();

  return useLazyAsyncData(key, () =>
    $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets`)
  );
};
