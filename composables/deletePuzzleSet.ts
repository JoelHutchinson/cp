const key = "delete-puzzle-set";

export const useDeletePuzzleSet = async (puzzleSet: any) => {
  const { profile } = useFetchProfile();

  return $fetch(
    `/api/profiles/${profile.value!.id}/puzzle-sets/${puzzleSet.slug}`,
    {
      method: "DELETE",
      key,
    }
  );
};
