<template>
  <div class="flex flex-row gap-4">
    <!-- TODO: Mark incorrect solves as well -->
    <ChessPuzzleInterface
      v-if="puzzle"
      :puzzle="puzzle!"
      @solved="() => solvePuzzle(true)"
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

const {
  puzzle,
  puzzleStatus,
  refreshPuzzle,
  puzzleProgress,
  solvePuzzle,
  puzzleSetProgress,
} = await usePuzzleSet(selectedPuzzleSetSlug.value);

watch(selectedPuzzleSetSlug, async (newSelectedPuzzleSetSlug) => {
  await navigateTo(`/solve/${newSelectedPuzzleSetSlug}`);
});
</script>
