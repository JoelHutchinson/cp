const key = "create-puzzle-set";

export const useCreatePuzzleSet = () => {
  const { profile } = useFetchProfile();

  const createPuzzleSet = async (puzzleSet: any) => {
    if (!profile.value) throw createError("Profile is not loaded");

    return await $fetch(`/api/profiles/${profile.value.id}/puzzle-sets`, {
      method: "POST",
      body: puzzleSet,
    });
  };

  return { createPuzzleSet };
};
