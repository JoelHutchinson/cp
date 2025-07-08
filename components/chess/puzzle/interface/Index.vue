<template>
  <div
    class="flex flex-col h-full w-full lg:w-full justify-center lg:flex-row sm:gap-4 items-center lg:grid lg:grid-cols-[auto_minmax(200px,300px)] lg:gap-4"
  >
    <!-- On Mobile, the Puzzle panel is displayed as a small banner above the board -->
    <div
      class="flex flex-row gap-4 w-full sm:hidden justify-between items-center max-h-32 bg-white dark:bg-gray-900"
    >
      <ChessPuzzleInterfaceMessage :status="status" />

      <div class="flex justify-between items-center">
        <div class="flex flex-row">
          <UButton
            icon="i-heroicons-forward"
            @click="handleSolved"
            variant="ghost"
          />

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

    <!-- Puzzle Board -->
    <ChessPuzzleBoard
      ref="chessPuzzleBoard"
      :puzzle="puzzle"
      @solved="handleSolved"
      @correct-move="handleCorrectMove"
      @incorrect-move="handleIncorrectMove"
    />

    <!-- Puzzle Details -->
    <div class="flex w-screen sm:w-full lg:flex-col sm:gap-4 md:gap-4 h-full">
      <ChessPuzzleInterfaceCard v-if="$slots.leading" class="flex-1">
        <slot name="leading"></slot>
      </ChessPuzzleInterfaceCard>

      <ChessPuzzleInterfaceCard class="flex-1 hidden sm:flex">
        <div class="grid grid-rows-[1fr_auto] gap-4 h-full">
          <div class="flex justify-center items-center">
            <ChessPuzzleInterfaceMessage :status="status" />
          </div>

          <div class="flex justify-between items-center">
            <UButton icon="i-heroicons-forward" @click="handleSolved">
              Skip</UButton
            >
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
