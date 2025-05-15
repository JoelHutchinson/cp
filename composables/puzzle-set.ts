const key = "puzzle-sets";

export const usePuzzleSets = () => {
  const { data: profile } = useProfile();

  return useLazyAsyncData(key, () =>
    $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets`)
  );
};
