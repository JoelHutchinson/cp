<template>
  <div class="flex flex-row gap-4">
    <ChessPuzzleInterface
      v-if="puzzleStatus === 'success'"
      :puzzle="puzzle!"
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
    {{ puzzleSetProgress }}
  </div>
</template>

<script setup lang="ts">
const { puzzleSet } = useRoute().params as { puzzleSet: string };
const { data: puzzleSets, refresh: refreshPuzzleSets } =
  await useFetchPuzzleSets();

refreshPuzzleSets();

const selectedPuzzleSetSlug: Ref<string> = ref(puzzleSet);

const {
  puzzle,
  puzzleStatus,
  refreshPuzzle,
  puzzleProgress,
  makePuzzleMove,
  solvePuzzle,
  puzzleSetProgress,
  fetchPuzzleSetProgress,
} = usePuzzleSet(selectedPuzzleSetSlug.value);

// Fetch the initial puzzle set progress on page load. After that it is optimistically updated
await fetchPuzzleSetProgress();

watch(selectedPuzzleSetSlug, async (newSelectedPuzzleSetSlug) => {
  await navigateTo(`/solve/${newSelectedPuzzleSetSlug}`);
});
</script>
