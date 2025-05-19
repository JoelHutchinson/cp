const key = "create-puzzle-set";

export const useCreatePuzzleSet = async (puzzleSet: any) => {
  const { profile } = useFetchProfile();

  return $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets`, {
    method: "POST",
    body: puzzleSet,
    key,
  });
};
