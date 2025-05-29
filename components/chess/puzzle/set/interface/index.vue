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

    <UBadge
      variant="soft"
      class="flex flex-row gap-2 items-center self-center text-xl"
    >
      <!-- TODO: Use vue ticker when this increases -->
      <!-- TODO: Make the text bigger -->
      <UIcon name="i-heroicons-arrow-path" class="size-6" />
      Cycle {{ puzzleSetProgress.current_cycle }}
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
          <span class="text-sm text-center font-bold text-primary-500">
            {{ puzzleSetProgress.solved_in_current_cycle }}/{{
              puzzleSetProgress.total_puzzles
            }}
          </span>
        </template>
      </UProgress>
      <span class="text-center basis-1/2 font-bold text-primary-500"
        >{{
          puzzleSetProgress.solved_in_current_cycle === 0
            ? 0
            : Math.round(
                (puzzleSetProgress.solved_correctly_in_current_cycle /
                  puzzleSetProgress.solved_in_current_cycle) *
                  100
              )
        }}% Accuracy</span
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
