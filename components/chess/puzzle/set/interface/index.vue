<template>
  <div class="flex flex-col justify-between gap-6 h-full">
    <UFormGroup label="Puzzle Set">
      <USelectMenu
        v-if="puzzleSets"
        v-model="selectedPuzzleSetSlug"
        :options="puzzleSets"
        option-attribute="name"
        value-attribute="slug"
      />
    </UFormGroup>

    <UBadge
      variant="soft"
      class="flex flex-row gap-2 items-center self-center text-xl"
    >
      <UIcon name="i-heroicons-arrow-path" class="size-6" />
      Cycle
      <UiOdometer :value="puzzleSetProgress.current_cycle" class="text-xl" />
    </UBadge>

    <div class="flex flex-row gap-2">
      <UProgress
        class="basis-1/2"
        :value="
          (puzzleSetProgress.solved_in_current_cycle /
            puzzleSetProgress.total_puzzles) *
          100
        "
        indicator
      >
        <template #indicator="{ percent }">
          <span class="text-center font-bold text-primary-500">
            <UiOdometer :value="puzzleSetProgress.solved_in_current_cycle" />
            /
            <UiOdometer :value="puzzleSetProgress.total_puzzles" />
          </span>
        </template>
      </UProgress>

      <span
        class="basis-1/2 gap-0.5 justify-center font-bold text-primary-500 flex items-center"
      >
        <UiOdometer
          class="text-primary-500 text-md tracking-tight"
          :value="
            puzzleSetProgress.solved_in_current_cycle === 0
              ? 0
              : Math.round(
                  (puzzleSetProgress.solved_correctly_in_current_cycle /
                    puzzleSetProgress.solved_in_current_cycle) *
                    100
                )
          "
        />
        % Accuracy</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedPuzzleSetSlug = defineModel<string>("selectedPuzzleSetSlug", {
  required: true,
});

defineProps<{
  puzzleSets: PuzzleSet[];
  puzzleSetProgress: PuzzleSetProgress;
}>();
</script>
