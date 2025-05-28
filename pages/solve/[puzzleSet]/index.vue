<template>
  <div class="flex flex-row gap-4">
    {{ progress }}
    <ChessPuzzleInterface
      v-if="puzzleStatus === 'success'"
      :puzzle="puzzle!"
      @solved="markPuzzleAsSolved"
    >
      <template #leading>
        <!-- Puzzle Set Details -->
        <UFormGroup label="Puzzle Set" class="mb-4">
          <USelectMenu
            v-if="puzzleSets"
            v-model="selectedPuzzleSet"
            :options="puzzleSets"
            option-attribute="name"
            value-attribute="slug"
            class="mb-4"
          />
        </UFormGroup>

        <span><UIcon name="i-heroicons-arrow-path" /> 3</span>

        <UProgress :value="55" indicator>
          <template #indicator="{ value }">
            <span class="text-sm">{{ value }}</span>
          </template>
        </UProgress>
      </template>
    </ChessPuzzleInterface>

    <ChessPuzzleInterfaceSkeleton v-else-if="puzzleStatus === 'pending'" />
  </div>
</template>

<script setup lang="ts">
const { puzzleSet } = useRoute().params as { puzzleSet: string };
const { profile } = useFetchProfile();
const { data: puzzleSets } = await useFetchPuzzleSets();

const selectedPuzzleSet = ref(puzzleSet);

const {
  data,
  refresh: refreshPuzzle,
  status: puzzleStatus,
} = await useLazyAsyncData(() => {
  return $fetch<{ puzzle: Puzzle; progress: PuzzleSetPuzzleProgress }>(
    `/api/profiles/${profile.value!.id}/puzzle-sets/${
      selectedPuzzleSet.value
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
};

watch(selectedPuzzleSet, async (newSelectedPuzzleSet) => {
  await navigateTo(`/solve/${newSelectedPuzzleSet}`);
});
</script>
