const key = "delete-puzzle-set";

export const useDeletePuzzleSet = () => {
  const { profile } = useFetchProfile();

  const deletePuzzleSet = async (puzzleSet: any) => {
    if (!profile.value) throw createError("Profile is not loaded");

    $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets/${puzzleSet.slug}`, {
      method: "DELETE",
      key,
    });
  };

  return { deletePuzzleSet };
};
