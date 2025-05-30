<template>
  <div class="flex flex-row gap-4">
    <ChessPuzzleInterface
      v-if="currentPuzzle"
      :puzzle="currentPuzzle"
      @solved="solvePuzzle"
      @correct-move="makePuzzleMove(true)"
      @incorrect-move="makePuzzleMove(false)"
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
  </div>
</template>

<script setup lang="ts">
const { puzzleSet } = useRoute().params as { puzzleSet: string };
const { data: puzzleSets, refresh: refreshPuzzleSets } =
  await useFetchPuzzleSets();

refreshPuzzleSets();

const selectedPuzzleSetSlug: Ref<string> = ref(puzzleSet);

const {
  currentPuzzle,
  currentPuzzleProgress,
  nextPuzzle,
  nextPuzzleProgress,
  puzzleSetProgress,
  puzzleCorrectness,
  puzzleStatus,
  makePuzzleMove,
  solvePuzzle,
  refreshProgress,
} = usePuzzleSet(selectedPuzzleSetSlug.value);

watch(selectedPuzzleSetSlug, async (newSelectedPuzzleSetSlug) => {
  await navigateTo(`/solve/${newSelectedPuzzleSetSlug}`);
});
</script>
