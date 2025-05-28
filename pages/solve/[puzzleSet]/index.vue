<template>
  <div class="flex flex-row gap-4">
    <ChessPuzzleInterface
      v-if="puzzle"
      :puzzle="puzzle!"
      @solved="markPuzzleAsSolved"
    >
      <template #leading>
        <ChessPuzzleSetInterface
          v-if="selectedPuzzleSetSlug && puzzleSets && puzzleSetProgress"
          v-model:selected-puzzle-set-slug="selectedPuzzleSetSlug"
          :puzzle-sets="puzzleSets"
          :puzzle-set-progress="puzzleSetProgress"
        />

        <!-- TODO: skeleton goes here -->
        <div v-else></div>
      </template>
    </ChessPuzzleInterface>

    <ChessPuzzleInterfaceSkeleton v-else-if="puzzleStatus === 'pending'" />
    {{ puzzleSetProgress }}
  </div>
</template>

<script setup lang="ts">
const { puzzleSet } = useRoute().params as { puzzleSet: string };
const { profile } = useFetchProfile();
const { data: puzzleSets, refresh: refreshPuzzleSets } =
  await useFetchPuzzleSets();

refreshPuzzleSets();

const selectedPuzzleSetSlug: Ref<string> = ref(puzzleSet);
const selectedPuzzleSet = computed<PuzzleSet | null>(() => {
  return (
    puzzleSets.value?.find((set) => set.slug === selectedPuzzleSetSlug.value) ??
    puzzleSets.value?.[0] ??
    null
  );
});

const { data: puzzleSetProgress, refresh: refreshPuzzleSetProgress } =
  await useFetchPuzzleSetProgress(selectedPuzzleSetSlug.value);

refreshPuzzleSetProgress();

const {
  data,
  refresh: refreshPuzzle,
  status: puzzleStatus,
} = await useLazyAsyncData(() => {
  return $fetch<{ puzzle: Puzzle; progress: PuzzleSetPuzzleProgress }>(
    `/api/profiles/${profile.value!.id}/puzzle-sets/${
      selectedPuzzleSetSlug.value
    }/current-puzzle`,
    {
      headers: useRequestHeaders(["cookie"]), // needed to pass supabase auth session
    }
  );
});

const puzzle = computed(() => data.value?.puzzle);

// TODO: Mark incorrect solves as well
const markPuzzleAsSolved = async () => {
  await $fetch(
    `/api/profiles/${
      profile.value!.id
    }/puzzle-sets/${puzzleSet}/current-puzzle/solves`,
    {
      method: "POST",
      body: {
        solved: true,
      },
    }
  );

  await refreshPuzzle();
  await refreshPuzzleSetProgress();
};

watch(selectedPuzzleSetSlug, async (newSelectedPuzzleSetSlug) => {
  await navigateTo(`/solve/${newSelectedPuzzleSetSlug}`);

  refreshPuzzleSetProgress();
});
</script>
