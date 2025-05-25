<template>
  <div class="flex flex-row gap-4">
    <!-- Puzzle Board -->
    <ChessPuzzleBoard
      ref="chessPuzzleBoard"
      :puzzle="puzzle"
      @solved="emit('solved')"
    />

    <!-- Puzzle Details -->
    <div class="flex flex-col gap-4">
      <ChessPuzzleInterfaceCard v-if="$slots.leading" class="flex-1">
        <slot name="leading"></slot>
      </ChessPuzzleInterfaceCard>

      <ChessPuzzleInterfaceCard class="flex-1">
        <div class="grid grid-cols-1 gap-4 h-full content-end">
          <div class="flex justify-between items-center">
            <UButton icon="i-heroicons-question-mark-circle">Help</UButton>
            <div>
              <ChessPuzzleBoardButton
                icon="i-heroicons-chevron-left"
                @click="handlePrev"
              />
              <ChessPuzzleBoardButton
                icon="i-heroicons-chevron-right"
                @click="handleNext"
              />
            </div>
          </div>
        </div>
      </ChessPuzzleInterfaceCard>

      <ChessPuzzleInterfaceCard v-if="$slots.trailing" class="flex-1">
        <slot name="trailing"></slot>
      </ChessPuzzleInterfaceCard>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  puzzle: Puzzle;
}>();

const emit = defineEmits<{
  (e: "solved"): void;
}>();

const chessPuzzleBoard = ref();

function handleNext() {
  chessPuzzleBoard.value.nextViewMove();
}

function handlePrev() {
  chessPuzzleBoard.value.prevViewMove();
}
</script>
