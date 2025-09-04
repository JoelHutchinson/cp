<template>
  <!-- No puzzle sets -->
  <div
    v-if="puzzleSets && puzzleSets.length === 0"
    class="flex items-center justify-center h-full"
  >
    <UiTypography>
      No puzzles sets have been created yet. Please
      <UButton to="/puzzle-set" variant="link" class="p-0 m-0"
        >create a puzzle set</UButton
      >
      to start solving.
    </UiTypography>
  </div>

  <!-- prettier-ignore -->
  <div
    v-else
    class="size-full grid
    grid-rows-[auto_auto_auto] grid-cols-1 items-center
    sm:gap-4 sm:p-4 sm:grid-rows-2 sm:grid-cols-[minmax(400px,600px)_minmax(200px,350px)] sm:items-stretch
    md:p-0 md:grid-rows-2 md:grid-cols-[600px_minmax(200px,350px)]
    xl:grid-rows-2 xl:grid-cols-[600px_minmax(200px,350px)_minmax(200px,350px)]">
    <!-- Puzzle Details -->
    <div
      class="row-start-1 row-end-2 sm:row-start-2 sm:row-end-3 sm:col-start-2 sm:col-end-3"
    >
      <ChessPuzzleDetails
        v-if="puzzleBoardState"
        :puzzle-board-state="puzzleBoardState"
        @next-move="handleNext"
        @prev-move="handlePrev"
        @skip="solvePuzzle"
        class="h-full"
      />

      <USkeleton v-else class="size-full" />
    </div>

    <!-- Puzzle Set Details -->
    <div
      class="row-start-3 row-end-4 sm:row-start-1 sm:row-end-2 sm:col-start-2 sm:col-end-3"
    >
      <ChessPuzzleSetDetails
        v-if="selectedPuzzleSetSlug && puzzleSets && puzzleSetProgress"
        v-model:selected-puzzle-set-slug="selectedPuzzleSetSlug"
        :puzzle-sets="puzzleSets"
        :puzzle-set-progress="puzzleSetProgress"
        class="size-full"
      />
      <USkeleton v-else class="size-full" />
    </div>

    <ChessPuzzleBoard
      v-if="currentPuzzle"
      ref="chessPuzzleBoard"
      :puzzle="currentPuzzle"
      @solved="solvePuzzle"
      @correct-move="makePuzzleMove(true)"
      @incorrect-move="makePuzzleMove(false)"
      class="row-start-2 row-end-3 max-w-[400px] place-self-center sm:max-w-full sm:col-start-1 sm:col-end-2 sm:row-start-1 sm:row-end-3"
    />
    <USkeleton
      v-else
      class="size-full row-start-2 row-end-3 place-self-center sm:max-w-full sm:col-start-1 sm:col-end-2 sm:row-start-1 sm:row-end-3"
    />

    <!-- Ad -->
    <div class="col-start-3 col-end-4 row-start-1 row-end-3 hidden xl:block">
      <AdsterraSidebarAd />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layoutMobileNoPadding: true,
});

const { fetchDefaultPuzzleSet } = useFetchDefaultPuzzleSet();
await fetchDefaultPuzzleSet();

const {
  data: puzzleSets,
  refresh: refreshPuzzleSets,
  status: puzzleSetsStatus,
} = await useFetchPuzzleSets();

refreshPuzzleSets();

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

// Previous ChessPuzzleInterface Script Below

const chessPuzzleBoard = ref();

const puzzleBoardState = computed(
  () => chessPuzzleBoard.value?.state || INITIAL_PUZZLE_BOARD_STATE
);

const handleNext = () => {
  chessPuzzleBoard.value.nextViewMove();
};

const handlePrev = () => {
  chessPuzzleBoard.value.prevViewMove();
};
</script>
