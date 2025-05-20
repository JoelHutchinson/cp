<template>
  <USelectMenu
    v-if="puzzleSets"
    v-model="selectedPuzzleSet"
    :options="puzzleSets"
    option-attribute="name"
    value-attribute="name"
    class="mb-4"
  />
  <ChessPuzzleInterface
    v-if="puzzleStatus === 'success'"
    :puzzle="puzzle!"
    @solved="markPuzzleAsSolved"
  />
  <ChessPuzzleInterfaceSkeleton v-else-if="puzzleStatus === 'pending'" />
</template>

<script setup lang="ts">
const { puzzleSet } = useRoute().params as { puzzleSet: string };
const { profile } = useFetchProfile();
const { data: puzzleSets } = await useFetchPuzzleSets();

const selectedPuzzleSet = ref(puzzleSet);

const {
  data: puzzle,
  refresh: refreshPuzzle,
  status: puzzleStatus,
  error: puzzleError,
} = await useLazyAsyncData(() => {
  return $fetch<Puzzle>(
    `/api/profiles/${profile.value!.id}/puzzle-sets/${
      selectedPuzzleSet.value
    }/current`,
    {
      headers: useRequestHeaders(["cookie"]), // needed to pass supabase auth session
    }
  );
});

const markPuzzleAsSolved = async () => {
  await useFetch(
    () =>
      `/api/profiles/${
        profile.value!.id
      }/puzzle-sets/${puzzleSet}/current/solved`,
    {
      method: "POST",
    }
  );

  await refreshPuzzle();
};

watch(selectedPuzzleSet, async (newSelectedPuzzleSet) => {
  await navigateTo(`/solve/${newSelectedPuzzleSet}`);
});
</script>
