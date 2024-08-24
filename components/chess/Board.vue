<template>
  <div class="border-4 rounded-xl w-fit z-20">
    <TheChessboard
      :board-config="boardConfig"
      :reactive-config="true"
      @board-created="handleBoardCreated"
      :style="{ width: '600px', height: '600px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

import type {
  BoardApi,
  BoardConfig,
  MoveEvent,
  PieceColor,
  PromotionEvent,
} from "vue3-chessboard";

const boardConfig: Ref<BoardConfig> = ref({
  coordinates: true,
  autoCastle: false,
  orientation: "white",
  drawable: {
    enabled: true,
    visible: true,
    defaultSnapToValidMove: true,
    eraseOnClick: true,
    shapes: [],
    autoShapes: [],
    brushes: {
      green: { key: "g", color: "#15781B", opacity: 1, lineWidth: 10 },
      red: { key: "r", color: "#882020", opacity: 1, lineWidth: 10 },
      blue: { key: "b", color: "#003088", opacity: 1, lineWidth: 10 },
      yellow: { key: "y", color: "#e68f00", opacity: 1, lineWidth: 10 },
      paleBlue: { key: "pb", color: "#003088", opacity: 0.4, lineWidth: 15 },
      paleGreen: { key: "pg", color: "#15781B", opacity: 0.4, lineWidth: 15 },
      paleRed: { key: "pr", color: "#882020", opacity: 0.4, lineWidth: 15 },
      paleGrey: {
        key: "pgr",
        color: "#4a4a4a",
        opacity: 0.35,
        lineWidth: 15,
      },
    },
  },
});

const emit = defineEmits<{
  (e: "boardCreated", boardApi: BoardApi): void;
  (e: "checkmate", isMated: PieceColor): void;
  (e: "stalemate"): void;
  (e: "draw"): void;
  (e: "check", isInCheck: PieceColor): void;
  (e: "promotion", promotion: PromotionEvent): void;
  (e: "move", move: MoveEvent): void;
}>();

const handleBoardCreated = (boardApi: BoardApi) => {
  emit("boardCreated", boardApi);
};
</script>
