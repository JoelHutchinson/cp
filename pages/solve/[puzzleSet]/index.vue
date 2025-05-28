<template>
  <div class="flex flex-row gap-4">
    <ChessPuzzleInterface
      v-if="puzzleStatus === 'success'"
      :puzzle="puzzle!"
      @solved="markPuzzleAsSolved"
    >
      <template #leading>
        <!-- Puzzle Set Details -->
        <div
          v-if="selectedPuzzleSet && puzzleSetProgress"
          class="flex flex-col justify-between h-full"
        >
          <UFormGroup label="Puzzle Set">
            <USelectMenu
              v-if="puzzleSets"
              v-model="selectedPuzzleSetSlug"
              :options="puzzleSets"
              option-attribute="name"
              value-attribute="slug"
            />
          </UFormGroup>

          <span class="flex flex-row gap-2 items-center self-center text-xl">
            <!-- TODO: Use vue ticker when this increases -->
            <!-- TODO: Make the text bigger -->
            <UIcon name="i-heroicons-arrow-path" class="size-6" />
            Cycle {{ puzzleSetProgress.current_cycle }}
          </span>

          <div>
            <UProgress
              :value="
                (puzzleSetProgress.solved_in_current_cycle /
                  puzzleSetProgress.total_puzzles) *
                100
              "
              indicator
            >
              <!-- <template #indicator="{ value }">
                <span class="text-sm">{{ value }}</span>
              </template> -->
            </UProgress>
          </div>
        </div>
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
const progress = computed(() => data.value?.progress);

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

watch(selectedPuzzleSet, async (newSelectedPuzzleSet) => {
  await navigateTo(`/solve/${newSelectedPuzzleSet?.slug}`);

  refreshPuzzleSetProgress();
});
</script>
