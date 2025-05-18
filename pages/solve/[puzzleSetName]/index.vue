<template>
  <ChessPuzzleInterface
    v-if="puzzle"
    :puzzle="puzzle"
    @solved="markPuzzleAsSolved"
  />
  <ChessPuzzleInterfaceSkeleton v-else />
</template>

<script setup lang="ts">
const { puzzleSetName } = useRoute().params as { puzzleSetName: string };
const { profile } = useFetchProfile();

const { data: puzzle, refresh: refreshPuzzle } = await useFetch(
  () =>
    `/api/profiles/${profile.value!.id}/puzzle-sets/${puzzleSetName}/current`
);

const markPuzzleAsSolved = async () => {
  await useFetch(
    () =>
      `/api/profiles/${
        profile.value!.id
      }/puzzle-sets/${puzzleSetName}/current/solved`,
    {
      method: "POST",
    }
  );

  await refreshPuzzle();
};
</script>
