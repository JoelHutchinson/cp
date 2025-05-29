const key = "make-puzzle-set-default";

export const useMakePuzzleSetDefault = () => {
  const { profile } = useFetchProfile();

  const makePuzzleSetDefault = async (slug: string) => {
    if (!profile.value) throw createError("Profile is not loaded");

    return await $fetch(
      `/api/profiles/${profile.value.id}/puzzle-sets/default`,
      {
        method: "PUT",
        body: {
          slug,
        },
      }
    );
  };

  return { makePuzzleSetDefault };
};
