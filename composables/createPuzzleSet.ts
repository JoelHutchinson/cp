const key = "create-puzzle-set";

export const useCreatePuzzleSet = () => {
  const { profile } = useFetchProfile();
  const { refreshDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

  const createPuzzleSet = async (puzzleSet: any) => {
    if (!profile.value) throw createError("Profile is not loaded");

    const res = await $fetch(`/api/profiles/${profile.value.id}/puzzle-sets`, {
      method: "POST",
      body: puzzleSet,
    });

    await refreshDefaultPuzzleSet();
  };

  const createSamplePuzzleSet = async () => {
    const samplePuzzleSet = {
      name: "Sample Puzzle Set",
      numberOfPuzzles: 10,
      rating: 1000,
      totalCycles: 5,
      themes: PUZZLE_THEMES.map((t) => t.value),
    };
    return await createPuzzleSet(samplePuzzleSet);
  };

  return { createPuzzleSet, createSamplePuzzleSet };
};
