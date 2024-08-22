<template>
  <TheChessboard
    :board-config="{ coordinates: true,  }"
    @board-created="handleBoardCreated"
  />
</template>

<script setup lang="ts">
import { TheChessboard } from "vue3-chessboard";
import "vue3-chessboard/style.css";

import type {
  BoardApi,
  MoveEvent,
  PieceColor,
  PromotionEvent,
} from "vue3-chessboard";

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
