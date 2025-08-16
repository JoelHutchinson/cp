<template>
  <!-- Puzzle Sets Loaded -->
  <div v-if="puzzleSetsStatus === 'success'" class="h-full">
    <!-- Puzzle Sets Exist -->
    <div
      v-if="puzzleSets && puzzleSets.length > 0"
      class="flex flex-col sm:flex-row gap-4 h-full lg:h-fit"
    >
      <ChessPuzzleInterface
        v-if="currentPuzzle"
        :puzzle="currentPuzzle"
        @solved="solvePuzzle"
        @correct-move="makePuzzleMove(true)"
        @incorrect-move="makePuzzleMove(false)"
      >
        <template #leading class="hidden md:flex">
          <ChessPuzzleSetInterface
            v-if="selectedPuzzleSetSlug && puzzleSets && puzzleSetProgress"
            v-model:selected-puzzle-set-slug="selectedPuzzleSetSlug"
            :puzzle-sets="puzzleSets"
            :puzzle-set-progress="puzzleSetProgress"
          />
        </template>
      </ChessPuzzleInterface>

      <div
        v-else-if="puzzleStatus === 'pending'"
        class="flex items-center justify-center w-full h-full"
      >
        <ChessPuzzleInterfaceSkeleton />
      </div>
    </div>

    <!-- No Puzzle Sets Exist -->
    <div v-else class="flex items-center justify-center h-full">
      <UiTypography>
        No puzzles sets have been created yet. Please
        <UButton to="/puzzle-set" variant="link" class="p-0 m-0"
          >create a puzzle set</UButton
        >
        to start solving.
      </UiTypography>
    </div>
  </div>

  <!-- Puzzle Sets Pending -->
  <div
    v-else-if="puzzleSetsStatus === 'pending'"
    class="flex items-center justify-center w-full h-full"
  >
    <ChessPuzzleInterfaceSkeleton />
  </div>

  <!-- Puzzle Sets Failed to Load -->
  <div v-else class="flex items-center justify-center h-full">
    <UiTypography class="text-gray-500">
      Failed to load puzzle sets. Please try again later.
    </UiTypography>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layoutMobileNoPadding: true,
});

const {
  data: puzzleSets,
  refresh: refreshPuzzleSets,
  status: puzzleSetsStatus,
} = await useFetchPuzzleSets();

const { refreshDefaultPuzzleSet } = useFetchDefaultPuzzleSet();

refreshPuzzleSets();
refreshDefaultPuzzleSet();

const selectedPuzzleSetSlug: Ref<string> = ref(
  puzzleSets?.value?.[0]?.slug || ""
);

const {
  currentPuzzle,
  currentPuzzleProgress,
  fetchCurrentPuzzle,
  nextPuzzle,
  nextPuzzleProgress,
  puzzleSetProgress,
  puzzleCorrectness,
  puzzleStatus,
  makePuzzleMove,
  solvePuzzle,
  refreshProgress,
} = usePuzzleSet(selectedPuzzleSetSlug);

watch(selectedPuzzleSetSlug, async (newSelectedPuzzleSetSlug) => {
  await fetchCurrentPuzzle();
  await refreshProgress();
});
</script>
