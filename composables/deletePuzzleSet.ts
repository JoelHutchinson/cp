const key = "delete-puzzle-set";

export const useDeletePuzzleSet = () => {
  const { profile } = useFetchProfile();

  const deletePuzzleSet = async (slug: string) => {
    if (!profile.value) throw createError("Profile is not loaded");

    await $fetch(`/api/profiles/${profile.value!.id}/puzzle-sets/${slug}`, {
      method: "DELETE",
      key,
    });
  };

  return { deletePuzzleSet };
};
