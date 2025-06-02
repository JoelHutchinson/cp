<template>
  <div
    class="flex flex-col md:flex-row sm:gap-3 md:gap-4 items-center md:items-start"
  >
    <!-- Puzzle Board -->
    <ChessPuzzleBoard
      ref="chessPuzzleBoard"
      :puzzle="puzzle"
      @solved="handleSolved"
      @correct-move="handleCorrectMove"
      @incorrect-move="handleIncorrectMove"
    />

    <!-- Puzzle Details -->
    <div class="flex w-screen md:flex-col sm:gap-2 md:gap-4 h-full">
      <ChessPuzzleInterfaceCard v-if="$slots.leading" class="flex-1">
        <slot name="leading"></slot>
      </ChessPuzzleInterfaceCard>

      <ChessPuzzleInterfaceCard class="flex-1">
        <div class="grid grid-rows-[1fr_auto] gap-4 h-full">
          <div class="flex justify-center items-center">
            <ChessPuzzleInterfaceMessage :status="status" />
          </div>

          <div class="flex justify-between items-center">
            <UButton icon="i-heroicons-forward">Skip</UButton>
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
  (e: "correct-move", move: string): void;
  (e: "incorrect-move", move: string): void;
}>();

const chessPuzzleBoard = ref();

const status: Ref<PuzzleStatus> = computed(
  () => chessPuzzleBoard.value?.status ?? "notStarted"
);

const handleNext = () => {
  chessPuzzleBoard.value.nextViewMove();
};

const handlePrev = () => {
  chessPuzzleBoard.value.prevViewMove();
};

const handleSolved = () => {
  emit("solved");
};

const handleCorrectMove = (move: string) => {
  emit("correct-move", move);
};

const handleIncorrectMove = (move: string) => {
  emit("incorrect-move", move);
};
</script>
