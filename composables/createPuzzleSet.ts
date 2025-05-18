const key = "create-puzzle-set";

export const useCreatePuzzleSet = async (puzzleSet: PuzzleSet) => {
  const { profile } = useFetchProfile();

  return useFetch(`/api/profiles/${profile.value!.id}/puzzle-sets`, {
    method: "POST",
    body: puzzleSet,
    key,
  });
};
