<template>
  <div class="flex flex-row gap-4 h-full">
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

        <!-- TODO: skeleton goes here -->
        <div v-else></div>
      </template>
    </ChessPuzzleInterface>

    <ChessPuzzleInterfaceSkeleton v-else-if="puzzleStatus === 'pending'" />

    <!-- Ezoic - sidebar_right_desktop - sidebar_floating_1 -->
    <div id="ezoic-pub-ad-placeholder-118"></div>
    <!-- End Ezoic - sidebar_right_desktop - sidebar_floating_1 -->
  </div>

  <!-- Ezoic - sidebar_bottom_mobile - sidebar_bottom -->
  <div id="ezoic-pub-ad-placeholder-119"></div>
  <!-- End Ezoic - sidebar_bottom_mobile - sidebar_bottom -->
</template>

<script setup lang="ts">
definePageMeta({
  layoutMobileNoPadding: true,
});

useHead({
  script: [
    {
      children: `
        ezstandalone.cmd.push(function () {
          ezstandalone.showAds(118, 119);
        });
      `,
      type: "text/javascript",
    },
  ],
});

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
