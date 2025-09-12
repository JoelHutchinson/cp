<template>
  <UCard
    :ui="{
      base: 'shadow-lg dark:shadow-gray-600',
      body: { base: 'h-full w-full', padding: 'p-0 sm:px-4 sm:py-5 sm:p-6' },
      rounded: 'rounded-none',
    }"
  >
    <!-- prettier-ignore -->
    <div class="h-full select-none grid items-center
    grid-rows-1 auto-rows-[0] grid-cols-[auto_1fr_auto]
    sm:grid-rows-[1fr_auto] sm:grid-cols-2 sm:gap-4">

    <!-- Message -->
      <div class="flex justify-center items-center
      col-start-2 col-end-3
      sm:col-start-1 sm:col-end-3"> 
        <ChessPuzzleInterfaceMessage :puzzle-board-state="puzzleBoardState" />
      </div> 

        <!-- Skip Button -->
        <UButton class="w-fit col-start-3 col-end-4
        sm:col-start-1 sm:col-end-2 sm:place-self-start" icon="i-heroicons-forward-20-solid" @click="emit('skip')">
          <span class="hidden sm:block">Skip</span>
        </UButton>

        <!-- Prev / Next Buttons -->
        <div class="row-start-1 row-end-2 col-start-1 col-end-2
        sm:col-start-2 sm:col-end-3 sm:row-start-2 sm:row-end-3 sm:place-self-end">
          <ChessPuzzleBoardButton
            icon="i-heroicons-chevron-left"
            @click="emit('prevMove')"
          />
          <ChessPuzzleBoardButton
            icon="i-heroicons-chevron-right"
            @click="emit('nextMove')"
          />
        </div>
      </div>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{ puzzleBoardState: PuzzleBoardState }>();

const emit = defineEmits<{
  (e: "skip"): void;
  (e: "prevMove"): void;
  (e: "nextMove"): void;
}>();
</script>
