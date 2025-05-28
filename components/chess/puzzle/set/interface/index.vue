<template>
  <div class="flex flex-col justify-between h-full">
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

<script setup lang="ts">
const selectedPuzzleSetSlug = defineModel<string>("selectedPuzzleSetSlug", {
  required: true,
});

defineProps<{
  puzzleSets: PuzzleSet[];
  puzzleSetProgress: PuzzleSetProgress;
}>();
</script>
