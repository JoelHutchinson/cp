<template>
  <div class="flex flex-col w-fit gap-1">
    <ChessBoard :board-config="{ events: { move: onMove } }" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import type { Piece, SquareKey } from "vue3-chessboard";

const props = defineProps<{
  puzzle: Puzzle;
}>();

const movesMade = ref<string[]>([]);
const movesMadeStr = computed(() => movesMade.value.join(" "));

const onMove = (
  orig: SquareKey,
  dest: SquareKey,
  capturedPiece?: Piece | undefined
) => {
  movesMade.value.push(orig + dest);

  if (movesMadeStr.value === props.puzzle.solution) {
    console.log("Puzzle solved!");
  }
};
</script>
