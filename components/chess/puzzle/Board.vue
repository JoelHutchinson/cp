<template>
  <div class="flex flex-col w-fit gap-1">
    <ChessBoard
      :board-config="{ events: { move: onMove } }"
      v-bind="$attrs"
      :width="300"
      :height="300"
    />
    <UButton @click="popMove">Undo</UButton>
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
  pushMove(orig, dest);

  if (movesMadeStr.value === props.puzzle.moves) {
    console.log("Puzzle solved!");
  }
};

const pushMove = (orig: SquareKey, dest: SquareKey) => {
  movesMade.value.push(origDestToSan(orig, dest));
};

const popMove = () => {
  movesMade.value.pop();
};

const origDestToSan = (orig: SquareKey, dest: SquareKey) => {
  return orig + dest;
};
</script>
