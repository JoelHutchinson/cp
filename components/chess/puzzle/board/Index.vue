<template>
  <ChessBoard v-bind="$attrs" :view-only="isViewOnly" @move="onMove" @board-created="(api) => (boardApi = api)" />
</template>

<script setup lang="ts">
import { ref, toRef } from "vue";
import type { Ref } from "vue";
import type { ChessBoardAPI } from "~/types/types";
import { useChessPuzzle } from "~/composables/puzzle";

const props = defineProps<{
  puzzle: Puzzle;
}>();

const emit = defineEmits<{
  (e: "solved"): void;
  (e: "correct-move", move: string): void;
  (e: "incorrect-move", move: string): void;
}>();

// Create a wrapper that matches the composable's emit signature
const composableEmit = (
  event: "solved" | "correct-move" | "incorrect-move",
  move?: string
) => {
  if (event === "solved") {
    emit("solved");
  } else if (event === "correct-move" && move) {
    emit("correct-move", move);
  } else if (event === "incorrect-move" && move) {
    emit("incorrect-move", move);
  }
};

/* ------------------------------------------------------------------
| * Board refs
| * ------------------------------------------------------------------ */

const boardApi: Ref<ChessBoardAPI | null> = ref(null);

/* ------------------------------------------------------------------
| * Puzzle logic
| * ------------------------------------------------------------------ */

const { state, isViewOnly, onMove, nextViewMove, prevViewMove } =
  useChessPuzzle(toRef(props, "puzzle"), boardApi, composableEmit);

/* ------------------------------------------------------------------
| * Shortcuts
| * ------------------------------------------------------------------ */

defineShortcuts({
  arrowleft: prevViewMove,
  arrowright: nextViewMove,
});

/* ------------------------------------------------------------------
| * Expose
| * ------------------------------------------------------------------ */

defineExpose({
  state,
  nextViewMove,
  prevViewMove,
});
</script>
